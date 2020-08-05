const express = require("express");
const app = express();
const configRoutes = require("./houseRouter");
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true})); //i have no idea what this is for

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

//make the individual house list page
//use handlebars to render the page with different house data
//should show all details of the house
//from then on, you can use DOM to manipulate the page as needed
//worry about that later