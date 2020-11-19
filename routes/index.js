var express = require('express');
var router = express.Router();
//房間列表模組
var roomList = require('../models/roomlist');
/* GET home page. */
router.get('/', function(req, res, next) {
  //透過模組取得現有房間資訊，並交給ejs處理
  res.render('index', { title: '直播o_ob' ,list:roomList.getList()});
});


module.exports = router;
