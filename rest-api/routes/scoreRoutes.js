const express = require('express');
const router = express.Router();
const scoresController = require('../controllers/scoresController'); 
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
  .post(scoresController.createNewScore)

// Geschützte Routen für die anderen Operationen
router.use(verifyJWT);

router.route('/')
  .get(scoresController.getAllScores)
  .patch(scoresController.updateScore)
  .delete(scoresController.deleteScore);

module.exports = router;
