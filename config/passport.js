// choose the passport strategy, here is local s
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// export this function
module.exports = function(passport) {
    /*In a typical web application, the credentials used to authenticate a user will
    only be transmitted during the login request. If authentication succeeds, a session
    will be established and maintained via a cookie set in the user's browser.
    Each subsequent request will not contain credentials, but rather the unique cookie that
    identifies the session. In order to support login sessions, Passport will serialize and
    deserialize user instances to and from the session.*/

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup',new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        // allows us to pass back the entire request to the callback
        passReqToCallback : true 
    },
    // callback with email and password from our form
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check if there already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'This email is already taken.'));
            } else {

                // if there is no user with that email then create the account
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email = email;
                //hash the password
                newUser.local.password = newUser.generateHash(password);
                //save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    // when user want to login
    passport.use('local-login',new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        // find a user whose email is the same as the forms email
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Incorrect password.')); // create the loginMessage and save it to session as flashdata

            // if the user is found and password is right, return successful user
            return done(null, user);
        });

    }));

};