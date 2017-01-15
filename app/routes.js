//export the module
module.exports = function(app,passport){
	//when direct to the home page, response will render the index.ejs template
	app.get('/', function(req,res){
		res.render('index.ejs');
	});

	//when direct to the login page, response will render the login.ejs template
	app.get('/login', function(req,res){
		//render the page and pass in any flash data if exists
		res.render('login.ejs',{message: req.flash('loginMessage')});
	});

	//process the login form
	app.post('/login', passport.authenticate('local-login', {
        // redirect to the secure profile section if success
        successRedirect : '/profile', 
        // redirect back to the login page if there is an error
        failureRedirect : '/login', 
        // allow flash messages
        failureFlash : true 
    }));

	//when direct to the signup page, response will render the signup.ejs template
	app.get('/signup', function(req,res){
		res.render('signup.ejs', {message:req.flash('signupMessage')});
	});

	//process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

	//when direct to the profile page, you have to logged in
	app.get('/profile', isLoggedIn, function(req,res){
		res.render('profile.ejs',{user:req.user});
	});

	//when log out, rediect to the home page
	app.get('/logout', function(req,res){
		req.logout();
		res.redirect('/');
	});

}

//check if the users is logged
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/')
}