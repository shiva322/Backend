const Menu = require('../models/menu.model.js');
var  numberofDocs;

exports.create = (req, res) => {
    // Validate request
    if(!req.body.Name) {
        return res.status(400).send({
            message: "Menu name can not be empty"
        });
    }
    var total;
    Menu.count().exec(function (err, count) {
        total = count;
    });

    setTimeout( function() {

    // Create a Menu
    var menu = new Menu({
        Category: req.body.Category,
        ID: total + 1,
        Name: req.body.Name,
        Unitprice: req.body.Unitprice,
        Calories: req.body.Calories,
        Preparationtime: req.body.Preparationtime
    });

    //console.log(menu);

        // Save Menu in the database
        menu.save()
            .then(data => {
            res.send(data);
    }).catch(err => {
            res.status(500).send({
            message: err.message || "Some error occurred while creating the Menu Item."
        });
    });
    },1500);
};

exports.findAll = (req, res) => {
    Menu.find({Category:req.params.categoryName})
        .then(menus => {
        res.send(menus);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while retrieving menu items."
    });
});
};

exports.sortBy = (req, res) => {

    //db.getCollection('menus').find({Category:"Main Course"}).sort({Name:1})
var query = Menu.find({Category:req.params.categoryName});
console.log(req.params.sorttype);
var s = req.params.sorttype;

if(s=="Name"){

var sorted = query.sort({"Name":1})
query.exec(function(error, docs){
  res.send(docs);
});
}
else if(s=="Price"){
var sorted = query.sort({"Unitprice":1})
query.exec(function(error, docs){
  res.send(docs);
});
}

else if(s=="Popularity"){
var sorted = query.sort({"Popularity":1})
query.exec(function(error, docs){
  res.send(docs);
});
}

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
