/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-08-07 16:20:41
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 23:30:39
 */
const express = require("express");
const router = express.Router();
const data = require("../../data/userData");
const userData = data.users;
const house = require("../../data/houseData");
const houseData = house.houseData;
const favHouseData = house.favHouseData;
const review = require("../../data/commentAndReviewData");
const reviewData = review.reviewsDate;
const comment = require("../../data/commentAndReviewData");
const commentData = comment.commentsData;

router.get("/", async (req, res) => {
  let userId = req.session.user;
  if(!userId){

  }

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
  let commentList = [];
  try {
    for (let i of allUserReviews) {
      console.log(i);
      let review = await reviewData.getReviewById(i);
      reviewsList.push(review);
    }
  } catch (error) {
    console.log(error);
  }
  try {
    let comments = await commentData.getAllComments();
    for (let c of comments) {
      if(c.userId === userId)
      commentList.push(c);
    }
  } catch (error) {
    console.log(error);
  }

  res.render("pages/account", {
    title: "User Account",
    user: user,
    hasLogin: true,
    list: favHouseList,
    reviews: reviewsList,
    comments: commentList
  });
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "You must Supply and ID to delete" });
    return;
  }
  let userId = req.params.id;
  let user = {};
  try {
    user = await userData.getUserById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
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
  let commentList = [];
  try {
    for (let i of allUserReviews) {
      console.log(i);
      let review = await reviewData.getReviewById(i);
      reviewsList.push(review);
    }
  } catch (error) {
    console.log(error);
  }
  try {
    let comments = await commentData.getAllComments();
    for (let c of comments) {
      if(c.userId === userId)
      commentList.push(c);
    }
  } catch (error) {
    console.log(error);
  }

  res.render("pages/userHomePage", {
    title: "User Home Page",
    user: user,
    hasLogin: true,
    list: favHouseList,
    reviews: reviewsList,
    comments: commentList
  });


});

router.patch("/", async (req, res) => {
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
   res.json({ success: true});
});

router.delete("/", async (req, res) => {
  let userId = req.session.user;
  if (!userId) {
    res.status(400).json({ error: "You must Supply and ID to delete" });
    return;
  }
  let user = {};
  try {
    user = await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  try {
    user = await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  let reviewIds = user.reviewIds;
  for(let i of reviewIds){
    let review = {};
    try {
      review = await reviewData.getReviewById(i);
    } catch (e) {
      console.log(e);
    }
    let comments = review.comments;
    for(let c of comments){
      try{
          await commentData.deleteComment(c._id);
      }catch (e) {
          console.log(e);
      }
    }
    try {
      await reviewData.removeReview(i);
    } catch (e) {
      console.log(e);
    }
  }
  let favourites = user.favourites;
  for(let f of favourites){
    let favHouseId = f._id;
    try {
      await favHouseData.deleteFavouriteHouse(favHouseId);
    } catch (error) {
      console.log(error);
    }
  }
  try {
    await userData.removeUser(userId);
  } catch (e) {
    console.log(error);
  }
  req.session.cookie.expires = new Date(new Date().getTime - 60).getTime();
  req.session.destroy();
  res.json({ success: true});
});

module.exports = router;
