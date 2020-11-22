const comModel = require('../models/my_com')
const cartModel = require('../models/my_cart')
var roomlist = require('../models/roomlist');
const User = require('../models/user')
var express = require('express');
var router = express.Router();


    router.get('/shop', (req, res, next) => {
        let response = res
        comModel.find({sellername:req.user.username}, (err, result, res) => {
            if(err) return console.log(err)
            response.render('shop', { result, sellername:req.user.username})
        })
    })

    router.get('/create', (req, res, next) => {
        res.render('create', {Roomname: req.user.username})
    })
    router.post('/create', (req, res, next) => {
        let newcom = [{
            productname: req.body.name,
            moneyId: req.body.money_id,
            sellername: req.user.username,
            image: req.body.result
        }]
        comModel.create(newcom, (err) => {
            if(err) return console.log(err)
            res.redirect('/com/shop')
        })
    })

    router.get('/del', (req, res, next) => {
        let response = res
        comModel.find({sellername:req.user.username}, (err, result, res) => {
            if(err) return console.log(err)
            response.render('del', { result,Roomname: req.user.username })
        })
    })
    router.post('/del', (req, res, next) => {
        comModel.remove({_id: req.body.student}, (err, result) => {
            if(err) return console.log(err)
            console.log(result.result)
            res.redirect('/com/shop')
        })
    })

    router.get('/update', (req, res, next) => {
        let response = res
        comModel.find({sellername:req.user.username}, (err, result, res) => {
            if(err) return console.log(err)
            response.render('update', { result,Roomname: req.user.username })
        })
    })
    router.post('/update', (req, res, next) => {
        console.log(req.body)
        let num = req.body.num,
            condiction = {_id: req.body._id[num]},
            query = {$set: {productname: req.body.productname[num], moneyId: req.body.money_id[num]}}
        comModel.update(condiction, query, (err, result) => {
            if(err) {
                console.log(err)
                res.send('<script>alert("選擇要修改的商品")</script>')
            }
            res.redirect('/com/shop')
        })
    })

    router.get('/reach', (req, res, next) => {
        let result = null
        res.render('reach', { result })
    })
    router.post('/reach', (req, res, next) => {
        console.log(req.body)
        let response = res
        let reachType = req.body.reach_type,
            keyWord = req.body.keyword
        if (reachType == 0) {
            comModel.find({productname: keyWord}, (err, result) => {
                console.log(result)
                if(err) return console.log(err)
                response.render('reach', { result })
            })
        } else {
            comModel.find({moneyId: keyWord}, (err, result) => {
                if(err) return console.log(err)
                response.render('reach', { result })
            })
        }
    })

    module.exports = router;