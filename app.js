/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-05 14:07:28
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 19:28:59
 */
const express = require('express');
const app = express();
const configRoutes = require('./userRouter');
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
const path = require('path');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
