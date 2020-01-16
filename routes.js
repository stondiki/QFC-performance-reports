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
};