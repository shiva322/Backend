const Rating = require('../models/rating.model.js');

exports.create = (req, res) => {

    // Create a rating
    const rating = new Rating({
        User:req.params.User,
        MenuID:req.params.MenuID,
        Rating: req.body.rating
    });

    // Save rating in the database
    rating.save()
    .then(data => {
        Rating.aggregate([
        
        {"$avg":{"average":"$Rating"}}
    ]);
        res.send(data);

});
    
};




