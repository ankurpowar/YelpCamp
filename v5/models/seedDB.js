var mongoose = require("mongoose");
var campground = require("./campground");
var Comment = require("./comment");

var sites = [
    {
        name:"pochinki",
        img:"https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg",
        description:"everyone's favourite"
    },
    {
        name:"military base",
        img:"https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/freemans-campground/freemans-campground-03.jpg",
        description:"Pros like it"
    },
    {
        name:"polyana",
        img:"https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.jpg",
        description:"My fav"
    },
    {
        name:"cave",
        img:"http://wafflefarm.com/wp-content/uploads/2016/12/WaffleFarmCampground_Sunset_ClubGroup-Camping-Slide.jpg",
        description:"novices come here"
    }
];

var comments = [
    {
        text:"all is well",
        author:"Ranchodas"
    },
    {
        text:"Patanjali is great",
        author:"baba ramdev"
    },
    {
        text:"koi mil gaya",
        author:"alien"
    }
];

function seedDB(){
    campground.deleteMany({},function(err){
        if(err){
            console.log("error in deleting");
        }else{
            console.log("deleted all data sucssefully!");

            Comment.deleteMany({},function(err){
                if(err){
                    console.log("error in deleting comments "+err);
                }else{
                    sites.forEach(function(site){
                        campground.create(site,function(err,data){
                            if(err){
                                console.log("error in adding site");
                            }else{
                                console.log("site: "+data+" added successfully!");
                               // comments.forEach(function(comment){
                                            Comment.create({text:"all is not wel", author:"someone shitty"},function(err, commentadded){
                                                if(err){
                                                    console.log("error in adding comment :"+err);
                
                                                }else{
                                                    console.log("comment added successfully to comment database");
                                                    data.comments.push(commentadded);
                                                    data.save(function(err){
                                                        if(err){
                                                            console.log("error in attaching comment:   "+err);
                                                        }
                                                    });
                                                    console.log("to the end!!");
                                                }
                                            });
                
                                        // });
                                }
                        });
                    });
                }
            });

       
        }
    });
}

module.exports = seedDB;