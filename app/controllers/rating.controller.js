const Rating = require('../models/rating.model.js');
const Menu = require('../models/menu.model.js');
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
        {
            $match: {
                MenuID: rating.MenuID
            }
        }, {
            $group: {
                _id: null,
                average_rating: {
                    $avg: "$Rating"
                }
            }
        }
    ]).exec().then(data=>{
        console.log(data[0].average_rating);

        Menu.update({ID:rating.MenuID}, { $set: { Rating: data[0].average_rating }}).exec();

    });
        res.send(data);

});
    
};




