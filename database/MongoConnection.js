const mongoose = require('mongoose')

const dbConnectionMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {})
    console.log('MongoDB Connected')
  } catch (err) {
    console.log(err)
    throw new Error('Error connecting to MongoDB')
  }
}

module.exports = {
  dbConnectionMongo
}
