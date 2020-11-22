const comModel = require('../models/my_com')
const cartModel = require('../models/my_cart')
const User = require('../models/user')
var roomlist = require('../models/roomlist');
var express = require('express');
var router = express.Router();
//商品列表
router.get('/cart/:id', (req, res, next) => {
    let listbuy = roomlist.buyList();
    //console.log(req.user.username)
    let response = res
    let roominfo = listbuy[req.user.username];
    var sellername = roominfo.seller
    comModel.find({'sellername':sellername}, (err, result, res) => {
        if(err) return console.log(err)
        response.render('cart', { result,sellername:roominfo.seller})
    })
})
//添加商品到購物車

router.post('/cart/:id', (req, res, next) => {
   // console.log(req.body.sellersroom)
   let listbuy = roomlist.buyList();
   let audience = req.user.username;
   let sellerroom = listbuy[req.params.id]
   listbuy[audience] = {seller: req.params.id};
    console.log(+req.params.id)
    let num = req.body.num,
        condiction = {_id: req.body._id[num]},
        buyercart = [{
            productname: req.body.productname[num],
            moneyId: req.body.money_id[num],
            sellername: req.params.id,
            buyername: req.user.username,
            count: req.body.count[num],
            testsum : req.body.money_id[num]*req.body.count[num]
    }]       
        
    cartModel.create(buyercart, (err) => {
        if(err) return console.log(err)
        res.redirect('/cart/cart/'+req.params.id)
    })
   
})

router.get('/carts/:id', (req, res, next) => {
    let listbuy = roomlist.buyList();
    let roominfo = listbuy[req.user.username];
    var sellername = roominfo.seller
    let response = res
    cartModel.find({buyername:req.user.username}, (err, result, res) => {
        if(err) return console.log(err)
        response.render('carts', { result,sellername:roominfo.seller,buyername:req.user.username })
    })
})

router.post('/carts/:id', (req, res, next) => {
    let listbuy = roomlist.buyList();
    let audience = req.user.username;
    listbuy[audience] = {seller: req.params.id};
    console.log(+req.params.id)
    cartModel.remove({_id: req.body.carts}, (err, result) => {
        if(err) return console.log(err)
        console.log(result.result)
        res.redirect('/cart/carts/'+req.params.id)
    })
})
router.get('/finish', (req, res, next) => {
    let listbuy = roomlist.buyList();
    let roominfo = listbuy[req.user.username];
    var sellername = roominfo.seller
    var buyername = req.user.username
    let response = res
    cartModel.find({buyername:req.user.username}, (err, result, res) => {
        if(err) return console.log(err)
        response.render('finish', { result,sellername:roominfo.seller,buyername:req.user.username })
    })
})

router.get('/finishsell', (req, res, next) => {
    let list = roomlist.buyList();
    let roominfo = list[req.user.username];
    var sellername = req.user.username
    list[ req.user.username] = [{NowTime: req.query.NowTime}]
    //var buyername = roominfo.buyername
    let response = res
    cartModel.find({sellername:req.user.username}, (err, result, res) => {
        if(err) return console.log(err)
        response.render('finishsell', { result,sellername:req.user.username,NowTime: req.query.NowTime })
    })
})
router.post('/finishsell',(req ,res ,next) =>{
    let list = roomlist.buyList();
    list[req.user.username] = [{NowTime: req.body.NowTime}]

})

module.exports = router;