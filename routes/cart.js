const comModel = require('../models/my_com')
const cartModel = require('../models/my_cart')
const User = require('../models/user')
var roomlist = require('../models/roomlist');
var express = require('express');
var router = express.Router();
//商品列表
router.get('/cart/:id', (req, res, next) => {
    let list = roomlist.getList();
    //console.log(req.user.username)
    let response = res
    let roominfo = list[req.user.username];
    var sellername = roominfo.seller;
    comModel.find({'sellername':sellername}, (err, result, res) => {
        if(err) return console.log(err)
        response.render('cart', { result,sellername:roominfo.seller})
    })
})
//添加商品到購物車

router.post('/cart/:id', (req, res, next) => {
    //console.log(req.body.sellersroom)
    let list = roomlist.getList();
    let audience = req.user.username;
    let sellerroom = list[req.params.id]
    list[audience] = {seller: sellerroom.sellername};
    var sellername = req.body.sellersroom;
    let num = req.body.num,
        condiction = {_id: req.body._id[num]},
        buyercart = [{
            productname: req.body.productname[num],
            moneyId: req.body.money_id[num],
            buyername: req.user.username,
            count: req.body.count[num],
            testsum : req.body.money_id[num]*req.body.count[num],
            sellernick :sellerroom.sellername
        }]       
    cartModel.create(buyercart, (err) => {
        if(err) return console.log(err)
        //return res.redirect('back')
    })

})

router.get('/carts/:id', (req, res, next) => {
    let list = roomlist.getList();
    let roominfo = list[req.user.username];
    var sellername = roominfo.seller

    let response = res
    cartModel.find({buyername:req.user.username}, (err, result, res) => {
        if(err) return console.log(err)
        response.render('carts', { result,sellername:roominfo.seller })
    })
})

router.post('/carts/:id', (req, res, next) => {
    let list = roomlist.getList();
    let audience = req.user.username;
    list[audience] = {seller: req.body.sellersroom};

    cartModel.remove({_id: req.body.carts}, (err, result) => {
        if(err) return console.log(err)
        console.log(result.result)
        res.redirect('/cart/carts/'+ req.params.id)
    })
})

module.exports = router;