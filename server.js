//++++++++++++++++get all the tools we need+++++++++++++++++++++++
var express = require('express');
var app = express();
//This will allow you to listen to your own port number but the default will be 8080
var port = process.env.PORT || 8080;
var mongoose = reuqire('mongoose');
//Helps us authenticating with different methods
var passport = require('passport');
//Allows for passing session flashdata messages. For example the login error messages
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyPareser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');