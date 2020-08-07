/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Yiqun Peng
 * @Date: 2020-08-05 21:43:34
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 16:37:24
 */
const userRoutes = require('./users');
const accountRoutes = require('./account');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/account', accountRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;