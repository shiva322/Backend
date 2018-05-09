const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema({
	Category:String,
	ID : Number,
	Name: String,
	Unitprice: Number,
	Calories : Number,
	Preparationtime: Number,
    Quantity:Number
    Popularity:Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Menu', MenuSchema);