//++++++++++++++++get all the tools we need+++++++++++++++++++++++
var express = require('express');
var app = express();
//This will allow you to listen to your own port number but the default will be 8080
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
//Helps us authenticating with different methods
var passport = require('passport');
//Allows for passing session flashdata messages. For example the login error messages
var flash = require('connect-flash');
//Create log for every request
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
//Parse body information from html form 
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

//++++++++++++++++configuration+++++++++++++++++++++++++
//connect the database
mongoose.connect(configDB.url);

//pass passport for configuration
require('./config/passport')(passport);

//setup the express application

//create log by the dev formant
app.use(morgan('dev'));
app.use(cookieParser());
//use this instead of app.use(bodyParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//use the ejs template as view engine
app.set('view engine', 'ejs');

//required for passport
app.use(session({secret: 'ilovescotchscotchyscotchscotch', saveUninitialized: true, resave:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//+++++++++++++++++++++++route+++++++++++++++++++++++++++++++
require('./app/routes.js')(app, passport);

//+++++++++++++++++++launch+++++++++++++++++++++++++++++++
app.listen(port);
console.log('The server has started on port ' + port);