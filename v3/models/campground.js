var mongoose = require("mongoose");



var CampGroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String,
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

module.exports = mongoose.model('Campground', CampGroundSchema);