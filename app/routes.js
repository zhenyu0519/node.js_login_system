module.exports = function(app,passport){
	//show home pages
	app.get('/', function(req,res){
		//load the index.ejs file
		res.render('index.ejs');
	});

	//show login form
	app.get('/login', function(req,res){
		//render the page and pass in any flash data if exists
		res.render('login.ejs',{message: req.flash('loginMessage')});
	});

	//process the login form
	// app.post('/login', do all passport stuff here);
	app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.get('/signup', function(req,res){
		res.render('signup.ejs', {message:req.flash('signupMessage')});
	});

	//process the signup form
	// app.post('/signup.ejs', do all our passport stuff here);
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	//This is protected so you have to be logged in to visit
	app.get('/profile', isLoggedIn, function(req,res){
		res.render('profile.ejs',{user:req.user});
	});

	//log out
	app.get('/logout', function(req,res){
		req.logout();
		res.redirect('/');
	});

}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/')
}