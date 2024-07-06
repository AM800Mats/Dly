const User = require('../models/User');
const Score = require('../models/Score');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc Get all scores 
// @route GET /scores
// @access Private
const getAllScores = asyncHandler(async (req, res) => {
    // Get all scores from MongoDB
    const scores = await Score.find().lean();

    // If no scores 
    if (!scores?.length) {
        return res.status(400).json({ message: 'No scores found' });
    }

    // Add username to each score before sending the response 
    const scoresWithUser = await Promise.all(scores.map(async (score) => {
        const user = await User.findById(score.user).lean().exec();
        return { ...score, username: user.username };
    }));

    res.json(scoresWithUser);
});

// @desc Create new score
// @route POST /scores
// @access Public
const createNewScore = asyncHandler(async (req, res) => {
    const { user, game, absolute_score, relative_score } = req.body;

    // Confirm data
    if (!user || !game || !absolute_score || !relative_score) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check for duplicate score for the same user, game, and day
    const duplicate = await Score.findOne({
        user: new mongoose.Types.ObjectId(user),
        game: game,
        createdAt: { $gte: startOfDay, $lt: endOfDay }
    }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Score for this user on this game already exists for today' });
    }

    // Create and store the new score
    const score = await Score.create({
        user,
        game,
        absolute_score,
        relative_score
    });

    if (score) { // Created
        return res.status(201).json({ message: 'New score created' });
    } else {
        return res.status(400).json({ message: 'Invalid score data received' });
    }
});

// @desc Update a score
// @route PATCH /scores
// @access Private
const updateScore = asyncHandler(async (req, res) => {
    const { id, user, game, absolute_score, relative_score } = req.body;

    // Confirm data
    if (!id || !user || !game || absolute_score == null || relative_score == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Confirm score exists to update
    const score = await Score.findById(id).exec();

    if (!score) {
        return res.status(400).json({ message: 'Score not found' });
    }

    score.user = user;
    score.game = game;
    score.absolute_score = absolute_score;
    score.relative_score = relative_score;

    const updatedScore = await score.save();

    res.json({ message: `'${updatedScore.game}' updated` });
});

// @desc Delete a score
// @route DELETE /scores
// @access Private
const deleteScore = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Score ID required' });
    }

    // Confirm score exists to delete 
    const score = await Score.findById(id).exec();

    if (!score) {
        return res.status(400).json({ message: 'Score not found' });
    }

    const result = await score.deleteOne();

    const reply = `Score for game '${result.game}' with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllScores,
    createNewScore,
    updateScore,
    deleteScore
};
