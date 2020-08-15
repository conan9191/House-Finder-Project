const express = require("express");
const router = express.Router();
const comment = require("../../data/commentAndReviewData");
const commentData = comment.commentsData;

const user = require("../../data/userData");
const userData = user.users;

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

router.post("/", async (req, res) => {
  if (!req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }

  if (!req.session || !req.session.user) {
    res
      .status(404)
      .json({ error: "Must login with valid user to add comment" });
    return;
  }

  let userID = req.session.user;

  try {
    let newComment = await commentData.addNewComment(req.body["text"], userID);
    //res.json(newComment);
    // res.render("pages/comments", {
    //   commentsList: allcommentsList,
    // });
  } catch (error) {
    res.status(404).json({ error: "Cannot add comment" });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "Must supply fav comment Id." });
    return;
  }

  //check if comment id exsist
  try {
    await commentData.getCommentById(req.params.id);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete comment." });
    return;
  }
  //delete comment
  try {
    await commentData.deleteComment(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete comment." });
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
    res.status(404).json({ error: "Cannot update comment." });
  }

  try {
    let updatedComment = await commentData.updateComment(commentId, paramBody);
    res.json(updatedComment);
  } catch (error) {
    res.status(404).json({ error: "Cannot update comment." });
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

  let oldComment = "";
  try {
    oldComment = await commentData.getCommentById(req.params.id);
    oldComment = checkAndUpdate(newComment, oldComment);
  } catch (error) {
    res.status(404).json({ error: "Cannot update comment." });
  }

  try {
    let updatedComment = await commentData.updateComment(
      req.params.id,
      oldComment
    );
    res.json(updatedComment);
  } catch (error) {
    res.status(404).json({ error: "Cannot update comment." });
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
