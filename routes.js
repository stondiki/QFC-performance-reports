module.exports = (app) => {
    const home = require('./routes/home');
    app.route('/').get(home.index);

    const register = require('./routes/register');
    app.route('/register').get(register.index);
    app.route('/register').post(register.register);

    const login = require('./routes/login');
    app.route('/login').get(login.index);
    app.route('/login').post(login.login);
    app.route('/logout').get(login.logout);

    const stocks = require('./routes/stocks');
    app.route('/stocks').get(stocks.index);
    app.route('/stocks/get').get(stocks.getStocks);
    app.route('/stocks/add').post(stocks.addStock);
    app.route('/stocks/delete').delete(stocks.deleteStock);
    app.route('/stocks/orders').post(stocks.getOrders);
    app.route('/stocks/orders/add').post(stocks.addOrder);
    app.route('/stocks/orders/delete').delete(stocks.cancelOrder);
};