const Cart = require('../models/cart.model.js');
const Menu = require('../models/menu.model.js');
var mailer = require("nodemailer");
//var smtpTransport = require('nodemailer-smtp-transport');

exports.create = (req, res) => {
    // Validate request
    if(!req.body.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    console.log(req.body.User);

    Cart.findOne({User:req.body.User}).exec().then(data=> {
        console.log(data);
        if(data){
            console.log("fds");
            res.send("User Exists");
        }
        else
        {
                        // Use Smtp Protocol to send Email
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "cmpe277group@gmail.com",
                    pass: "Jamjam@123"
                }

     });

            var order_id = 1;
            var receiver_email = req.body.User;
            var mail = {
                from: "CMPE 277 Restaurant<cmpe277group@gmail.com>",
                to: req.body.User,
                subject: "Welcome to Bay Leaf Restaurant",
                text: "Please find the below order details",
                html: "<b>Welcome to Bay Leaf Restaurant</b>"
            }



            smtpTransport.sendMail(mail, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }

                smtpTransport.close();
            });


            // Create a Cart
            const cart = new Cart({
                User : req.body.User,
                Items : []
            });

            // Save Cart in the database
            cart.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while adding Cart Item."
                });
            });

        }

        

}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while adding Cart Item."
    });
});

    
};


exports.update = (req, res) => {
    // Validate request
    if(!req.params.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    Cart.findOne().and([{User:req.params.User},{ "Items.MenuID":req.body.MenuID}]).exec().then(data=> {
        if(data){
                data.Items.forEach(function (item) {
                    //console.log(item);
                    if (item.MenuID === req.body.MenuID) {
                        item.Quantity += req.body.Quantity;
                    }
                });

                Cart.findOneAndUpdate({User: req.params.User}, data, {new: true}).exec().then(data_response => {
                    res.send(data_response);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while adding Cart Item."
                        })
                    });
                }

        else {

            Cart.findOneAndUpdate({User:req.params.User},
            {
                $push : {
                    Items :  {
                        MenuID : req.body.MenuID,
                        Quantity: req.body.Quantity
                    }
                }
            },
            { new: true })
            .then(data => {
            res.send(data);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while adding Cart Item."
    });
});
}
});

/*
    Cart.findOne({User:req.params.User}).exec().then( data => {
        //var pushNewFlag = true;
            //console.log(data);
            menuArray = data.Items.map(item => {return item.MenuID});
            menuArray.forEach(function (item) {
                console.log(item);
            if(item===req.body.MenuID){
                Cart.findOneAndUpdate({User:req.params.User},
                    {
                        $set : {
                            Items :  {
                                MenuID : req.body.MenuID,
                                Quantity: req.body.Quantity
                            }
                        }
                    },
                    { new: true })
                    .then(data => {
                    res.send(data);
            }).catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while adding Cart Item."
                });
            });
            }
            /*  else {
               /* Cart.findOneAndUpdate({User:req.params.User},
                    {
                        $push : {
                            Items :  {
                                MenuID : req.body.MenuID,
                                Quantity: req.body.Quantity
                            }
                        }
                    },
                    { new: true })
                    .then(data => {
                    res.send(data);
            }).catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while adding Cart Item."
                });
            });
            }
        });
    });
*/

};


exports.findOne = (req, res) => {
    Cart.findOne({User:req.params.User})
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "No user found "
            });
        }

    Promise.all(cart.Items.map( function(item) {
        return Menu.findOne({"ID":item.MenuID}).then( data => {
                //console.log(item.Quantity);
                data["Quantity"] = item.Quantity;
                return data;
        });
    })).then(function(results) {
        cart.Items = results;
        res.send(cart.Items);
    })
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "No user found "
            });
        }
        return res.status(500).send({
            message: "Error retrieving user "
        });
    });
};

exports.removeMenu = (req, res) => {
    // Validate request
    if(!req.params.User) {
    return res.status(400).send({
        message: "User name can not be empty"
    });
}



Cart.findOneAndUpdate({User:req.params.User},
    {
        $pull : {
            Items :  {
                MenuID: req.params.MenuID
            }
        }
    },
    { new: true })
    .then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
    message: err.message || "Some error occurred while adding Cart Item."
});
});

};

exports.delete = (req, res) => {
    Cart.find({User:req.params.User,MenuID:req.params.MenuID}).remove().exec()
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "User or Menu ID not found "
            });
        }
        res.send({message: "Cart item deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User or Menu ID not found  "
            });
        }
        return res.status(500).send({
            message: "Could not delete item "
        });
    });
};
