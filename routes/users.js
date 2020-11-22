var express = require('express');
var router = express.Router();

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')

var roomList = require('../models/roomlist');

/* GET users listing. */
router.get('/signin', function(req, res, next) {
  console.log(res.locals)
  res.render('signin');
});

router.post('/signin',
  passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signin',
    failureFlash: true
  }),
  function(req, res) {
    res.redirect('/users/profile')
});

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('signup', {errors: ''});
});

// Post Sign Up
router.post('/signup', function(req, res, next) {
  // Parse Info
  var username = req.body.username
  var password = req.body.password
  var roomkey = Math.random().toString(36).substr(2,16);
console.log(username);
  // Validation
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()

  var errors = req.validationErrors();
  if(errors) {
    res.render('signup', {errors: errors})
  } else {
  //Create User
  var newUser = new User({
    username: username,
    password: password,
    roomkey: roomkey
  })
  User.createUser(newUser, function(err, user){
    if(err) throw err;
  })
  
  req.flash('success_msg', 'you are registered now log in')
  res.redirect('/users/signin')
  }
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
  console.log(req.user)
  res.render('profile', {
    user: req.user.username,
    roomkey: req.user.roomkey
  });
});

router.get('/Buyer', ensureAuthenticated, function(req, res, next) {
  console.log(req.user)
  res.render('Buyer', {
    user: req.user.username,list:roomList.getList()
  });
});

router.get('/seller', ensureAuthenticated, function(req, res, next) {
  //console.log(req.user)
  res.render('seller', {
    user: req.user.username,
    list:roomList.getList(),
    roomkey: req.user.roomkey
  });
});

router.post('/seller', function(req, res, next) {
  //取得現有房間列表
  let list = roomlist.getList();
  //房間ID 
  let roomid = req.user.username;
  //將資訊傳到房間列表，並將key設為剛剛產生的時間戳
  list[roomid] = {
    name: req.body.roomname,
    link: req.body.rtmplink,
    test01: req.body.rtmp01,
    test02: req.body.rtmp02,
  };
  
  //將產生的id傳給web，web端將會轉跳到對應頁面
  res.json({
    msg: roomid
  });
});


router.get('/logout', function(req, res, next) {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/signin')
});








function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'you are not logged in')
    res.redirect('/users/signin')
  }
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err
        if(isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid password'})
        }
      })
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


module.exports = router;
