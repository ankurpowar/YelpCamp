var mongoose = require("mongoose");

var CampGroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String
});

module.exports = mongoose.model('Campground', CampGroundSchema);