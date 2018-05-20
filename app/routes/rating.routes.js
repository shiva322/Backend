module.exports = (app) => {
    const rating = require('../controllers/rating.controller.js');

    app.post('/rating/:User/:MenuID', rating.create);

    app.get('/rating/:User/:MenuID', rating.findAll);

    // Get list of existing orders
    //app.get('/orderlist', orderlist.findAll);

  
}