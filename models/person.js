const mongoose = require('mongoose')

const url = process.env.MONGODB_URI


mongoose.set('strictQuery', false)
mongoose.connect(url).then(result => {
  console.log('Connected to mongodb')
}).catch(err => {
  console.log('There was an error while connecting to mongodb: ', err.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    maxLength: 50,
    required: true,
    validate: {
      validator: (n) => /^(\d{2}|\d{3})-\d+$/.test(n),
      message: 'invalid phone number'
    }
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)