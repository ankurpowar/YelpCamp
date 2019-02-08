var express = require("express");
var app = express();
var mongoose = require("mongoose");
var campground = require("./models/campground");
var seedDB = require("./models/seedDB");
var Comments = require("./models/comment");

var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser: true});
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret:"I dont like you",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000, function(){
    console.log("Sever has started !!!")
});

app.use(function(req,res,next){
    console.log("current user: "+req.user);
    res.locals.currentUser = req.user;
    next();
});







app.get("/",function(req, res){
    res.render("landing");
});

app.get("/campground/new",isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

app.get("/campground",function(req, res){
    
    campground.find({},function(err, campgrounds){
        if(err){
            console.log(" error for finding: "+err)
        }
            else{

                res.render("campgrounds/campground",{sites : campgrounds});
            }
        });
});

app.post("/campground",function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var obj = {name: name , img:image, description:desc};
    campground.create(obj, function(err, site){
        if(err){
            console.log("problem in adding: "+err);
        }else{
            console.log("site added successfully: "+site);
            res.redirect("http://localhost:3000/campground");
            
        }
    });
});

app.get("/campground/:id",function(req,res){
    campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err){
            console.log("cant find campground :"+err);
        }else{
            console.log("campground: "+campground.findById(req.params.id).populate('comments'));
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

app.get("/campground/:id/comments/new",isLoggedIn,function(req,res){
    campground.findById(req.params.id,function(err, camp){
        if(err){
            console.log("error in finding campground :"+err);
        }else{
            res.render("comments/new",{campground:camp});
        }
    });
    
});

app.post("/campground/:id/comments",isLoggedIn, function(req,res){
    campground.findById(req.params.id,function(err, camp){
        if(err){
            console.log("error in finding campground :"+err);
        }else{
            var comment = req.body.comment;
            Comments.create(comment, function(err, com){
                if(err){
                    console.log("error in adding comment to database: "+err);
                }else{
                    camp.comments.push(com);
                    camp.save();
                    res.redirect("http://localhost:3000/campground/"+camp._id);
                }
            });
        }
    });
});

app.get("/register",function(req, res){
    res.render("register");
});

app.post("/register",function(req, res){
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log("error in registering: "+err);
            res.render("register");
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/campground");
            });
        }
    });
});

app.get("/login",function(req, res){
    res.render("login");
});

app.post("/login",
        passport.authenticate("local",
                              {
                                successRedirect: "/campground",
                                failureRedirect: "/login"
                              }
                             )
); 

app.get("/logout",function(req, res){
    req.logOut();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}



