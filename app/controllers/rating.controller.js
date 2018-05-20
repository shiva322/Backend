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
    Rating.find().and([{User:req.params.User},{MenuID:req.params.MenuID}]).exec().then(data=>{
        if(data.length>0){
        Rating.findOneAndUpdate( { $and: [{MenuID:rating.MenuID},{User:rating.User}]}, { $set: { Rating: rating.Rating }},{new:true}).exec().then(data => {
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
            //        console.log(data[0].average_rating);

            Menu.update({ID:rating.MenuID}, { $set: { Rating: data[0].average_rating }}).exec();

    });
        res.send(data);

    });

        }
        else {
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
            //        console.log(data[0].average_rating);

            Menu.update({ID:rating.MenuID}, { $set: { Rating: data[0].average_rating }}).exec();

    });
        res.send(data);

    });
    }
    }

    );



    
};

exports.findAll = (req, res) => {

    if(!req.params.User && !req.params.MenuID) {
        return res.status(400).send({
            message: "User or MenuID cannot be empty"
        });
    }
    Rating.findOne({User:req.params.User, MenuID: req.params.MenuID})
        .then(rating => {
        res.send(rating);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while retrieving Orders."
    });
});
};


