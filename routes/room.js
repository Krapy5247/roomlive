var express = require('express');
var router = express.Router();
//房間列表模組
var roomlist = require('../models/roomlist');
var User = require('../models/user')
router.get('/', function(req, res, next) {
  //取得現有房間列表
  let list = roomlist.getList();
  //根據網址列所帶的參數，取得對應id房間資訊
  let roominfo = list[req.query.id];
  //將資訊透過ejs轉換為html後傳給使用者
  res.render('room', {
    title: roominfo.name,
    link01: roominfo.test01,
    link02: roominfo.test02,
    rtmp: roominfo.test01 + req.user.roomkey + roominfo.test02,
    chatname: req.user.username,
    titlename: roominfo.titlename,
    test000: roominfo.test03
  });
});

router.post('/', function(req, res, next) {
  let choice = req.body.choice; 
  if(choice==0){
    let list = roomlist.getList();
    let id = req.body.seller;
    delete list[id];
    console.log('delete Room'+id)
  }else if(choice==1){
    let list = roomlist.getList();
    let roomid = req.user.username;
    list[roomid] = {
      titlename:req.user.username,
      name: req.body.roomname,
      test01: req.body.rtmp01,
      test02: req.body.rtmp02,
    };
    res.json({
      msg: roomid
    });
    console.log('create Room'+key)
  }else{
    let list = roomlist.getList();
    
  }

});



module.exports = router;
