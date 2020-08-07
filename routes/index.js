
const loginRoutes = require('./login');
const registrationRoutes = require('./registration');
const logoutRoutes = require('./logout');
const parser = require('body-parser');

const constructorMethod = (app) => {
    app.use(parser.json());
    app.use('/login', loginRoutes);
    app.use('/logout', logoutRoutes);
    app.use('/registration', registrationRoutes);

    app.use('*', (req, res) => {
        const authenticated = req.session.user || false;
        res.render('user/erroraccess',{title:"Access Error", authenticated: authenticated });
    });
};

module.exports = constructorMethod;