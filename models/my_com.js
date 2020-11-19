const mongoose = require('mongoose')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'error：'))
db.once('open', (callback) => {
  console.log('DB Success 02')
})

const classSchema = new mongoose.Schema({
  productname: String,
  moneyId: Number,
  sellername: String,
  image: String
})

const comModel = mongoose.model('newClass', classSchema)

module.exports = comModel