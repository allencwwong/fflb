// local env
//require('dotenv').config('./.env');

// heroku activity monitor
require ('newrelic');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
const session = require('express-session');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');


// mongo db connection
var mongoose = require('mongoose');

// hide db login info
mongoose.connect('mongodb://admin:fantasyfootball2018!@ds139262.mlab.com:39262/fflb_db',{ useNewUrlParser: true } )
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

// q
mongoose.Promise = require('q').Promise;
// native promises
mongoose.Promise = global.Promise;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist/')));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/slideout', express.static(__dirname + '/node_modules/slideout/')); // redirect slideout



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(expressLayouts);

app.use('/', indexRouter);
app.use('/login', authRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
