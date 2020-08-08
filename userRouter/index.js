/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Yiqun Peng
 * @Date: 2020-08-05 21:43:34
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 20:01:54
 */


const loginRoutes = require('./login');
const registrationRoutes = require('./registration');
const userRoutes = require('./users');
const logoutRoutes = require('./logout');
const accountRoutes = require('./account');
const parser = require('body-parser');

const constructorMethod = (app) => {
  app.use(parser.json());
  app.use('/users', userRoutes);
  app.use('/account', accountRoutes);
  app.use('/login', loginRoutes);
  app.use('/logout', logoutRoutes);
  app.use('/registration', registrationRoutes);
  app.use('*', (req, res) => {
      const authenticated = req.session.user || false;
      res.render('pages/erroraccess',{title:"Access Error", authenticated: authenticated });
  });
};

module.exports = constructorMethod;