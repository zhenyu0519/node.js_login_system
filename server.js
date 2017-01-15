//Load all the module we need
var express = require('express');
var app = express();
//allow you to listen to your own port number but the default will be 8080
var port = process.env.PORT || 8080;
//object modeling for MongoDB
var mongoose = require('mongoose');
//help us do authenticating
var passport = require('passport');
//flashdata messages. For example the login error messages
var flash = require('connect-flash');
//log every request
var morgan = require('morgan');
//parse the cookie
var cookieParser = require('cookie-parser');
//Parse information from html form 
var bodyParser = require('body-parser');

var session = require('express-session');

var configDB = require('./config/database');

//connect the database
mongoose.connect(configDB.url);

//pass the passport parameter from passport js file for configuration
require('./config/passport')(passport);

//use morgan to create log by the dev formant
app.use(morgan('dev'));
app.use(cookieParser());
//use this instead of app.use(bodyParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//use the ejs template as view engine
app.set('view engine', 'ejs');

//set the secret string tp hash the password and save it in cookie
app.use(session({secret: 'ilovescotchscotchyscotchscotch', saveUninitialized: true, resave: true}));
//In a Connect or Express-based application, passport.initialize() middleware is required to
//initialize Passport. If your application uses persistent login sessions, 
//passport.session() middleware must also be used. Remember use the express.session before passport.session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//pass the app and passport parameter from routers js file for configuration
require('./app/routes.js')(app, passport);

//lunch the port and display port naumber in console
app.listen(port);
console.log('The server has started on port ' + port);