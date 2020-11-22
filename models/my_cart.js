const mongoose = require('mongoose')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'error：'))
db.once('open', (callback) => {
  console.log('DB Success 01')
})

const classSchema = new mongoose.Schema({
    productname: String,
    moneyId: Number,
    buyername: String,
    sellername:String,
    count: Number,
    testsum: Number,
})

const cartModel = mongoose.model('newCart', classSchema)

module.exports = cartModel