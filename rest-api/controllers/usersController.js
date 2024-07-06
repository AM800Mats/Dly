const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route Get /users
// @acces Private
const getAllUsers = asyncHandler(async(req, res) => {
  const users = await User.find().select('-password').lean()
  if (!users.length ){
    return res.statusCode(400).json({message: 'No users found'})
  }
  return res.json(users)
})

// @desc  Create User
// @route Post /users
// @acces Public
const createNewUser = asyncHandler(async(req, res) => {
  const { username, password, roles } = req.body

  //confirm data
  if(!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({message: 'All field are required'})
  }

  //Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate) {
    return res.status(409).json({message: 'Duplicate username'})
  }
  
  //Hash password
  const hashedPwd = await bcrypt.hash(password, 10) // 10 salt rounds

  const userObject = { username, "password": hashedPwd, roles}

  //Create and store new user
  const user = await User.create(userObject)

  if(user) { // was created
    res.status(201).json({ message: `New user ${username} created`})
  } else {
    res.status(400).json({message: 'invalid userdata received'})
  }
})

// @desc  Update User
// @route Patch /users
// @acces Private
const updateUser = asyncHandler(async(req, res) => {
  const { id, username, roles, active, password } = req.body

  //confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
    return res.status(400).json({message: 'All field are required'})
  }

  const user = await User.findById(id).exec()

  if(!user){
    return res.status(400).json({message: 'user not found'})
  }

  //Check for duplicate
  const duplicate = await User.findOne({username}).lean().exec()
  //Allow updates to the original user
  if(duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({message: 'Duplicate username'})
  }

  user.username = username
  user.roles = roles
  user.active = active

  if(password){
    //Hash password
    user.password = await bcrypt.hash(password, 10)
  }
  
  const updatedUser = await user.save()

  res.json({message: `${updatedUser.username} updated`})
})

// @desc  Delete User
// @route Delete /users
// @acces Private
const deleteUser = asyncHandler(async(req, res) => {
  const { id } = req.body

  if(!id){
    return res.status(400).json({message: 'User ID required'})
  }

  const user = await User.findById(id).exec()
  if(!user) {
    return res.status(400).json({message: 'User not found'})
  }

  const result = await user.deleteOne()
  const reply = `Username ${user.username} with ID ${user._id} deleted`

  res.json(reply)
})

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}