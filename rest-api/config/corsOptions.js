const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true) // Allow all origins for now
  },
  credentials: true,  
  optionsSuccesStatus: 200
}

module.exports = corsOptions