var config = require('./config/default');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport')
var LocalStrategy = require('passport-local')
var mongoose = require('mongoose')
var constains = require('constants');
var keys = require('./config/default');

mongoose.connect(keys.mongoURL);


var indexRouter = require('./routes/index');
var roomRouter = require('./routes/room');
var users = require('./routes/users');
var com = require('./routes/com');
var cart = require('./routes/cart');

var app = express();
var httpServer = http.createServer(app);
var mysocket = require('./models/mysocket')(httpServer);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressValidator()); 
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

app.use('/', indexRouter);
app.use('/room', roomRouter);
app.use('/users', users);
app.use('/com',com);
app.use('/cart', cart );


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
   res.status(err.status || 500);
  res.render('error');
});

httpServer.listen(config.http_port, function() {
  console.log('HTTPS Server is running on: http://localhost:%s', config.http_port);
});

module.exports = app;
