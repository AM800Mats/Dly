const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  game: {
    type: String,
    required: true
  },
  absolute_score: {
    type: Number,
    required: true
  },
  relative_score: {
    type: Number,
    default: true  }
},
{
  timestamps: true
}
)

module.exports = mongoose.model('Score', userSchema)