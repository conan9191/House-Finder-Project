/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-12 22:59:36
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-20 17:42:47
 */
const express = require("express");
const router = express.Router();
const review = require("../../data/commentAndReviewData");
const reviewData = review.reviewsDate;
const data = require("../../data/userData");
const userData = data.users;

const comment = require("../../data/commentAndReviewData");
const commentData = comment.commentsData;

const xss = require("xss");

router.post("/", async (req, res) => {
    let review = req.body;
    let houseId = xss(review.houseId);
    let rating = xss(review.rating);
    let reviewText = xss(review.reviewText);
    console.log(review);
    if (!review) {
        res.status(400).render("pages/error", {
            title: "Error Page",
            error: "You must provide data to create a review" , 
            hasLogin: req.session.user
          });
        return;
    }
    if (Object.keys(review).length === 0) {
        res.status(400).render("pages/error", {
            title: "Error Page",
            error: "You must provide data without null body" , 
            hasLogin: req.session.user
          });
        return;
    }
    let userId = req.session.user;
    if (!userId) {
        res.status(400).render("pages/error", {
            title: "Error Page",
            error: "You must be a login User", 
            hasLogin: req.session.user
          });
        return;
    }
    if (!houseId) {
        res.status(400).render("pages/error", {
            title: "Error Page",
            error: "You must provide a houseId" , 
            hasLogin: req.session.user
          });
        return;
    }
    if (!rating) {
        res.status(400).render("pages/error", {
            title: "Error Page",
            error: "You must provide a rating" , 
            hasLogin: req.session.user
          });
        return;
    }
    if (!reviewText) {
        res.status(400).render("pages/error", {
            title: "Error Page",
            error: "You must provide a reviewText" , 
            hasLogin: req.session.user
          });
        return;
    }
    let newReviewId = {};
    try {
        const newReview = await reviewData.addReview(
            houseId,
            userId,
            Number(rating),
            reviewText
        );
        newReviewId = newReview._id;
      } catch (e) {
        console.log(e);
      }
    
    // Add reviewsId in user
    let loginUser = {};
    try {
        try {
            loginUser = await userData.getUserById(userId);
        } catch (error) {
            console.log(error);
        }
        let userReviewsId = [];
        if (loginUser["reviewIds"]) {
            userReviewsId = loginUser["reviewIds"];
        }
        userReviewsId.push(newReviewId.toString());
        await userData.updateUser(userId, loginUser);
    } catch (error) {
        console.log(error);
    }
    res.redirect('http://localhost:3000/house/'+ houseId);

});

router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).render("pages/error", {
        title: "Error Page",
        error: "You must Supply and ID to delete" , 
        hasLogin: req.session.user
      });
      return;
    }
    if (!req.body) {
        res.status(400).render("pages/error", {
            title: "Error Page",
            error: "You must provide data to delete a review" , 
            hasLogin: req.session.user
          });
        return;
    }
    let houseId = req.body.houseId;
    let review = {};
    try {
      review = await reviewData.getReviewById(req.params.id);
    } catch (e) {
     console.log(e);
    }
    try {
      await reviewData.removeReview(req.params.id);
    } catch (e) {
      console.log(e);
    }
    let comments = review.comments;
    for(let c of comments){
        console.log(c.text);
        try{
            await commentData.deleteComment(c._id);
        }catch (e) {
           console.log(e);
        }
    }

    let loginUser = {};
    try {
        try {
            loginUser = await userData.getUserById(req.session.user);
        } catch (error) {
            console.log(error);
        }
        let userReviewsId = [];
        if (loginUser["reviewIds"]) {
            userReviewsId = loginUser["reviewIds"];
        }
        for(r of userReviewsId){
            let index = userReviewsId.indexOf(r);
            if(r === req.params.id){
                let rr =loginUser["reviewIds"].splice(index, 1); 
                console.log(index+":"+rr);
                break;
            }
        }
        await userData.updateUser(req.session.user, loginUser);
    } catch (error) {
        console.log(error);
    }
    res.json({success: true});
  });

module.exports = router;
  