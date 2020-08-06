/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Yiqun Peng
 * @Date: 2020-08-05 21:43:34
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-06 01:17:32
 */
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;