/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-12 22:59:36
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-13 09:07:55
 */
const express = require("express");
const router = express.Router();
const review = require("../../data/commentAndReviewData");
const reviewData = review.reviewsDate;
const data = require("../../data/userData");
const userData = data.users;

const comment = require("../../data/commentAndReviewData");
const commentData = comment.commentsData;

router.post("/", async (req, res) => {
    let review = req.body;
    console.log(review);
    if (!review) {
        res.status(400).json({ error: "You must provide data to create a review" });
        return;
    }
    if (Object.keys(review).length === 0) {
        res.status(400).json({ error: "You must provide data without null body" });
        return;
    }
    let userId = req.session.user;
    if (!userId) {
        res.status(400).json({ error: "You must be a login User" });
        return;
    }
    if (!review.houseId) {
        res.status(400).json({ error: "You must provide a houseId" });
        return;
    }
    if (!review.rating) {
        res.status(400).json({ error: "You must provide a rating" });
        return;
    }
    if (!review.reviewText) {
        res.status(400).json({ error: "You must provide a reviewText" });
        return;
    }
    let newReviewId = {};
    try {
        const newReview = await reviewData.addReview(
            review.houseId,
            userId,
            Number(review.rating),
            review.reviewText
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
    res.redirect('http://localhost:3000/house/'+ review.houseId);

});

router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
      res.status(400).json({ error: "You must Supply and ID to delete" });
      return;
    }
    if (!req.body) {
        res.status(400).json({ error: "You must provide data to delete a review" });
        return;
    }
    let houseId = req.body.houseId;
    let review = {};
    try {
      review = await reviewData.getReviewById(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "review not found" });
      return;
    }
    try {
      await reviewData.removeReview(req.params.id);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
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
    res.redirect('http://localhost:3000/house/'+ houseId);

  });

module.exports = router;
  