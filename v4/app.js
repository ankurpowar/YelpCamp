var express = require("express");
var app = express();
var mongoose = require("mongoose");
var campground = require("./models/campground");
var seedDB = require("./models/seedDB");
var Comments = require("./models/comment");


mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser: true});
app.set("view engine", "ejs");

seedDB();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

// var sites = [
//     {
//         name: "pratapGad",
//         img: "http://www.onguma.com/uploads/1/1/7/5/117537555/201604-aoba-935_2_orig.jpg"
//     },
//     {
//         name: "Mahableshwar",
//         img: "https://cdn.shopify.com/s/files/1/2468/4011/products/campsite_1_600x.png?v=1524622915"
//     },
//     {
//         name: "sinhgad",
//         img: "https://visitreykjavik.is/sites/default/files/styles/whattodo_photo_600x450/public/campsite_reykjavik.jpg?itok=POovyC8J"
//     },
//     {
//         name: "Tekadi",
//         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AW1qwp-ow2CsxiPoVm7Qhw97OeC_jzj235ITc63g1lYfvCgDeA"
//     },
//     {
//         name: "pratapGad",
//         img: "http://www.onguma.com/uploads/1/1/7/5/117537555/201604-aoba-935_2_orig.jpg"
//     },
//     {
//         name: "Mahableshwar",
//         img: "https://cdn.shopify.com/s/files/1/2468/4011/products/campsite_1_600x.png?v=1524622915"
//     },
//     {
//         name: "sinhgad",
//         img: "https://visitreykjavik.is/sites/default/files/styles/whattodo_photo_600x450/public/campsite_reykjavik.jpg?itok=POovyC8J"
//     },
//     {
//         name: "Tekadi",
//         img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AW1qwp-ow2CsxiPoVm7Qhw97OeC_jzj235ITc63g1lYfvCgDeA"
//     }
// ];

app.listen(3000, function(){
    console.log("Sever has started !!!")
});

app.get("/",function(req, res){
    res.render("landing");
});




app.get("/campground/new",function(req, res){
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
            // campground.find({},function(err, campgrounds){
            //     if(err){
            //         console.log(" error for finding: "+err)
            //     }
            //         else{
            //             // res.send(`<!DOCTYPE html>
            //             // <html>
            //             // <head>
            //             //     <meta charset="utf-8" />
            //             //     <meta http-equiv="X-UA-Compatible" content="IE=edge">
            //             //     <title>alibaba</title>
            //             //     <meta name="viewport" content="width=device-width, initial-scale=1">
                            
                           
            //             // </head>
            //             // <body>
            //             //     <script>
            //             //     window.location.href ="http://localhost:3000/campground";    
            //             //     </script>
            //             // </body>
            //             // </html>`);
                        
            //             res.redirect("http://localhost:3000/campground");
            //             // res.render("campground",{sites : campgrounds});
            //         }
            // });
        }
    });
});
   



// var george = new cat({
//     name: "notCool",
//     age: 3,
//     temperament: "grumpy"
// })

// george.save(function(err, cat){
//     if(err){
//         console.log("something went wrong with the error: "+err);
//     }
//     else{
//         console.log("Saved A Cat: "+cat );
//         console.log(typeof(cat));
//     }
// }); 

// sites.forEach(function(site){
//     campground.create(site, function(err, site){
//         if (err) {
//             console.log("there is a error: "+err)
//         } else {
//             console.log("campground added successfully "+ site)
//         }
//     });
// });

// cat.create( {name: "fulu",age:10}, function(err,cat){
//     if(err){
//         console.log("error: "+err);
//     }
//     else{
//         console.log("cat is inserted: "+cat);
//     }
// });  


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

app.get("/campground/:id/comments/new",function(req,res){
    campground.findById(req.params.id,function(err, camp){
        if(err){
            console.log("error in finding campground :"+err);
        }else{
            res.render("comments/new",{campground:camp});
        }
    });
    
});

app.post("/campground/:id/comments",function(req,res){
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


