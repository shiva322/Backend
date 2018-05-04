const Menu = require('../models/menu.model.js');

exports.create = (req, res) => {
    // Validate request
    if(!req.body.Name) {
        return res.status(400).send({
            message: "Menu name can not be empty"
        });
    }

    // Create a Menu
    const menu = new Menu({
        Category:req.body.Category,
        ID : req.body.ID,
        Name: req.body.Name,
        Unitprice: req.body.Unitprice,
        Calories : req.body.Calories,
        Preparationtime: req.body.Preparationtime
    });

    // Save Menu in the database
    menu.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Menu Item."
        });
    });
};

exports.findAll = (req, res) => {
    Menu.find()
    .then(menus => {
        res.send(menus);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving menu items."
        });
    });
};


exports.findOne = (req, res) => {
    Menu.find({ID:req.params.menuId})
    .then(menu => {
        if(menu=="") {
            return res.status(404).send({
                message: "Menu Item not found with id " + req.params.menuId
            });            
        }
        res.send(menu[0]);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Menu Item not found with id " + req.params.menuId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving menu item with id " + req.params.menuId
        });
    });
};


exports.delete = (req, res) => {
    Menu.find({ID:req.params.menuId}).remove().exec()
    .then(menu => {
        if(!menu) {
            return res.status(404).send({
                message: "Menu item not found with id " + req.params.menuId
            });
        }
        res.send({message: "Menu item deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Menu item not found with id " + req.params.menuId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Menu with id " + req.params.menuId
        });
    });
};
