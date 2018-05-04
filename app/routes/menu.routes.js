module.exports = (app) => {
    const menus = require('../controllers/menu.controller.js');

    // Create a new Menu Item
    app.post('/menu', menus.create);

    // Retrieve all Menu Items
    app.get('/menu/:categoryName', menus.findAll);



    // Retrieve a single Menu with MenuId
    app.get('/menu/:menuId', menus.findOne);

    // Delete a Menu with MenuId
    app.delete('/menu/:menuId', menus.delete);
}