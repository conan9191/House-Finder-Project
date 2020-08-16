/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-08-07 16:20:41
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 15:53:21
 */
const express = require("express");
const router = express.Router();
const data = require("../../data/userData");
const userData = data.users;
const house = require("../../data/houseData");
const houseData = house.houseData;
const review = require("../../data/commentAndReviewData");
const reviewData = review.reviewsDate;

router.get("/", async (req, res) => {
  let userId = req.session.user;
  let user = {};
  try {
    user = await userData.getUserById(userId);
  } catch (error) {
    console.log(error);
  }

  let allUserFavourites = user["favourites"];
  let favHouseList = [];
  try {
    for (let i of allUserFavourites) {
      let houseId = i["houseId"];
      let favhouse = await houseData.getHouseById(houseId);
      favHouseList.push(favhouse);
    }
  } catch (error) {
    console.log(error);
  }

  let allUserReviews = user["reviewIds"];
  let reviewsList = [];
  try {
    for (let i of allUserReviews) {
      console.log(i);
      let review = await reviewData.getReviewById(i);
      reviewsList.push(review);
    }
  } catch (error) {
    console.log(error);
  }
  res.render("pages/account", {
    title: "User Account",
    user: user,
    hasLogin: true,
    list: favHouseList,
    reviews: reviewsList
  });
});

router.post("/", async (req, res) => {
  let postBody = req.body;
  let profilePicture = postBody.profilePicture
  console.log(profilePicture);
  if (!profilePicture) {
      res.status(400).json({ error: "You must provide data to create a profilePicture" });
      return;
  }
  let userId = req.session.user;
  if (!userId) {
      res.status(400).json({ error: "You must be a login User" });
      return;
  }
  
  let loginUser = {};
  try {
      try {
          loginUser = await userData.getUserById(userId);
      } catch (error) {
          console.log(error);
      }
      loginUser.profilePicture = profilePicture;
      await userData.updateUser(userId, loginUser);
  } catch (error) {
      console.log(error);
  }
});

module.exports = router;
