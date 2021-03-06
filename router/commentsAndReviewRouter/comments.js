const express = require("express");
const router = express.Router();
const comment = require("../../data/commentAndReviewData");
const commentData = comment.commentsData;

const review = require("../../data/commentAndReviewData");
const reviewData = review.reviewsDate;

const user = require("../../data/userData");
const userData = user.users;
const xss = require("xss");

let allComments = "";

router.get("/", async (req, res) => {
  try {
    allComments = await commentData.getAllComments();
    //res.json(allComments);
    // console.log(allComments);
    let currentUser = req.session.user ? req.session.user : "";

    let allcommentsList = await configureAllcommentList(currentUser);
    res.render("pages/comments", {
      commentsList: allcommentsList,
    });
  } catch (error) {
    res.status(404).json({ error: "Comments not found" });
    
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "Comments Id missing" });
    return;
  }

  try {
    let comment = await commentData.getCommentById(req.params.id);
    // res.json(comment);
    // res.render("pages/comments", {
    //   commentsList: allcommentsList,
    // });
  } catch (error) {
    res.status(404).json({ error: "Comment not found" });
  }
});

router.post("/:id", async (req, res) => {
  if (!req.body || !req.params.id) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }
  let rid = xss(req.params.id);
  if (!req.session || !req.session.user) {
    res
      .status(404)
      .json({ error: "Must login with valid user to add comment" });
    return;
  }
  let text = xss(req.body["text"]);
  //add comment in review
  let userID = req.session.user;
  let newComment = {};
  let updateComment = {}
  let updateReview = {};
  try {
    newComment = await commentData.addNewComment(text, userID);
    //res.json(newComment);
    // res.render("pages/comments", {
    //   commentsList: allcommentsList,
    // });
  } catch (error) {
    console.log(error);
  }
  try {
    updateReview = await reviewData.getReviewById(rid.toString());
  } catch (error) {
    console.log(error);
  }
  updateComment._id = newComment._id;
  updateComment.userId = newComment.userId;
  updateComment.text = newComment.text;
  updateReview.comments.push(updateComment);
  try {
    await reviewData.updateReview(rid.toString(), updateReview);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Must supply fav comment Id." , 
      hasLogin: req.session.user
    });
    return;
  }

  //check if comment id exsist
  try {
    await commentData.getCommentById(req.params.id);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Must supply fav comment Id." , 
      hasLogin: req.session.user
    });
    return;
  }
  //delete comment
  try {
    await commentData.deleteComment(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Must supply fav comment Id." , 
      hasLogin: req.session.user
    });
    return;
  }
  //delete comment in review
  let review = {};
  try {
    review = await reviewData.getReviewByCommentId((req.params.id))
  } catch (error) {
    console.log(error);
  }
  let comments = review.comments;
  for(let c of comments){
    let index = comments.indexOf(c);
    if (c._id === req.params.id){
      let cc =comments.splice(index, 1); 
      console.log(index+":"+cc);
      break;
    }
  }
  try {
    await reviewData.updateReview((review._id).toString(), review);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  if (!req.params.id || !req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }

  let paramBody = "";
  if (!req.session || !req.session.user) {
    throw `Must login with valid user to update comment`;
  }
  paramBody["userId"] = req.session.user;
  paramBody["text"] = req.body["text"];

  let commentId = req.params.id;

  try {
    await commentData.getCommentById(commentId);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Cannot update comment." , 
      hasLogin: req.session.user
    });
  }

  try {
    let updatedComment = await commentData.updateComment(commentId, paramBody);
    res.json(updatedComment);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Cannot update comment." , 
      hasLogin: req.session.user
    });
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.params.id || !req.body || Object.keys(req.body).length === 0) {
    res.status(404).json({
      error: "Must provide atleast one field in request body.",
    });
    return;
  }

  let newComment = {};
  if (!req.session || !req.session.user) {
    throw `Must login with valid user to update comment`;
  }
  newComment["userId"] = req.session.user;
  newComment["text"] = req.body["text"];
  console.log(newComment["text"]);

  let oldComment = "";
  try {
    oldComment = await commentData.getCommentById(req.params.id);
    oldComment = checkAndUpdate(newComment, oldComment);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Cannot update comment." , 
      hasLogin: req.session.user
    });
    
  }
  let updatedComment = {};
  try {
      updatedComment = await commentData.updateComment(
      req.params.id,
      oldComment
    );
    res.json(updatedComment);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Cannot update comment." , 
      hasLogin: req.session.user
    });
  }
  //update comment in review
  let updateReview = {};
  try {
    updateReview = await reviewData.getReviewByCommentId(updatedComment._id);
  } catch (error) {
    console.log(error);
  }
  let index = -1;
  for(let c of updateReview.comments){
    if(c._id === updatedComment._id){
      index = updateReview.comments.indexOf(c);
      updateReview.comments[index].text = updatedComment.text;
      console.log(updateReview.comments[index].text);
      console.log(updatedComment.text);
      break;
    }
  }
  try {
    await reviewData.updateReview((updateReview._id).toString(), updateReview);
  } catch (error) {
    console.log(error);
  }


});

function checkAndUpdate(newComment, oldComment) {
  if (newComment["userId"] && newComment["userId"] != oldComment["userId"]) {
    oldComment["userId"] = newComment["userId"];
  }

  if (newComment["text"] && newComment["text"] != oldComment["text"]) {
    oldComment["text"] = newComment["text"];
  }
  return oldComment;
}

async function configureAllcommentList(currentUser) {
  console.log("currentUser = " + currentUser);
  let allcommentsList = [];
  if (allComments) {
    for (let i = 0; i < allComments.length; i++) {
      try {
        let comment = allComments[i];
        let commentSchema = {
          _id: "",
          text: "",
          userId: "",
          userName: "",
          canUpdate: "",
        };

        //comment id
        commentSchema._id = comment["_id"];

        //user id
        let userId = comment["userId"];
        if (userId) {
          commentSchema.userId = userId;
          //to hide edit and delete button. If current user is same as added comment user
          //then show edit and delete button, else hide
          if (userId === currentUser) {
            commentSchema.canUpdate = "inline-block";
          } else {
            commentSchema.canUpdate = "none";
          }
        }

        //user name
        let user = await userData.getUserById(userId);
        if (user && (user["firstName"] || user["lastName"])) {
          let name = "";
          name += user["firstName"] ? user["firstName"] : "";
          name += user["lastName"] ? user["lastName"] : "";
          commentSchema.userName = name;
        }

        //comment text
        if (comment["text"]) {
          commentSchema.text = comment["text"];
        }

        allcommentsList.push(commentSchema);
        console.log(allcommentsList);
      } catch (error) {
        console.log("error in configure list" + error);
      }
    }
    return allcommentsList;
  } else {
    throw `Empty comment list`;
  }
}

module.exports = router;
