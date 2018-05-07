module.exports = (app) => {
    const carts = require('../controllers/cart.controller.js');

    app.put('/cart/:User', carts.update);
    // Create a new Cart Item
    app.post('/cart', carts.create);

    // Retrieve a single Cart with CartId
    app.get('/cart/:User', carts.findOne);

    // Delete a Menu in Cart
    app.delete('/cart/:User/:MenuID', carts.removeMenu);
}