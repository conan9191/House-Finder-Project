const express = require("express");
const router = express.Router();
const comment = require("../../data/commentAndReviewData");
const commentData = comment.commentsData;

router.get("/", async (req, res) => {
  try {
    let allComments = await commentData.getAllComments();
    res.json(allComments);
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
    res.json(comment);
  } catch (error) {
    res.status(404).json({ error: "Comment not found" });
  }
});

router.post("/", async (req, res) => {
  if (!req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }

  if (!req.body["userId"]) {
    res.status(404).json({ error: "Must supply user id fields." });
    return;
  }

  try {
    let newComment = await commentData.addNewComment(
      req.body["text"],
      req.body["userId"]
    );
    res.json(newComment);
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

  let paramBody = req.body;
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

  let newComment = req.body;
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
  if (newComment.userId && newComment.userId != oldComment.userId) {
    oldComment.userId = newComment.userId;
  }

  if (newComment.text && newComment.text != oldComment.text) {
    oldComment.text = newComment.text;
  }
  return oldComment;
}

module.exports = router;
