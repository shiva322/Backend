const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
	User:String,
	MenuID:Number,
	Rating:Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Rating', RatingSchema);

