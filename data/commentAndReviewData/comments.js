/*
 * @Descripttion:
   defines collection method to get, add, delete and update comments.
   Collection name : Comments 
   Stores data : _id : commentid , text : comment text , userId : userid who posted comment.
 * @Author: Syed Mahvish
 *
 *
 */

const dbCollections = require("../../settings/collections");

const commentCollectionObj = dbCollections.comments;

const { v1: uuidv4 } = require("uuid");

let commentData = {
  _id: "",
  userId: "",
  houseId: "",
};

/**
 * Find comment by given comment id
 * @param {} id : comment id
 * Return : If comment for given id is not found , error is thrown. Else return comment object with complete data.
 */
async function getCommentById(id) {
  id = getValidId(id);
  let commentObj = await commentCollectionObj();

  let data = await commentObj.findOne({ _id: id });

  if (data === null) {
    throw `Error :Cannot find comment with given id : ${id} into database`;
  }

  return data;
}

/**
 * Return all comments stored in database House.
 */
async function getAllComments() {
  let commentObj = await commentCollectionObj();
  const alldata = await commentObj.find().toArray();

  if (alldata === null) {
    throw `No favourite house found in database`;
  }
  return alldata;
}

/**
 * Add new comment into database.
 * firstly, Validate user id information pass from post router.
 * If invalid info is found an array of error is thrown.
 * Secondly, Create schema with new comment info.
 *
 * @param {*} userId : user id who added comment
 * @param {*} commentText : comment added by user
 * Return : New comment added in database.
 */
async function addNewComment(commentText, userId) {
  if (!userId) {
    throw `Must provide user id to add comment in database`;
  }

  commentData.userId = getValidId(userId);
  commentData.text = getValidComment(commentText);

  let schema = {
    _id: uuidv4(),
    userId: commentData.userId,
    text: commentData.text,
  };

  let commentObj = await commentCollectionObj();

  let newComment = await commentObj.insertOne(schema);

  if (newComment.insertedCount === 0) {
    throw `Error : Unable to add comment into database`;
  }

  return await this.getCommentById(newComment.insertedId);
}

/**
 * Delete comment from database.
 *
 * @param {*} id : comment id that contains req.param.id from Delete router.
 * Return : true if deleted successfully else error will be thrown.
 */
async function deleteComment(id) {
  id = getValidId(id);

  let commentObj = await commentCollectionObj();

  let removedComment = await commentObj.removeOne({ _id: id });

  if (removedComment.deletedCount === 0) {
    throw `Error : Unable to delete comment id : ${id} from database`;
  }

  return true;
}

/**
 * Return comment for given user id.
 * @param {*} userId : return comments made by given user.
 */
async function getCommentByUserId(userId) {
  userId = getValidId(userId);

  let commentObj = await commentCollectionObj();

  let comments = await commentObj.find({ userId: userId }).toArray;

  if (comments === null) {
    throw `Error :Cannot find comments with given user id : ${id} into database`;
  }

  return comments;
}

/**
 * Update comment info into database.
 * firstly, Validate comment information pass from Put/Patch router.
 * If invalid info is found an array of error is thrown.
 * Secondly, Create schema with updated comment info.
 *
 * @param {*} updateComment : comment object that contains req.body from Put/Patch router.
 * @param {*} commentId : comment id that contains req.param.id from Put/Patch router.
 * Return : Updated comment data from database.
 */
async function updateComment(commentId, updateComment) {
  if (!updateComment || !updateComment["userId"] || !updateComment["text"]) {
    throw `Provide userid and comment text to update info`;
  }

  commentData.id = getValidId(commentId);
  commentData.userId = getValidId(updateComment["userId"]);
  commentData.text = getValidComment(updateComment["text"]);

  let schema = {
    userId: commentData.userId,
    text: commentData.text,
  };
  let commentObj = await commentCollectionObj();
  let updatedComment = await commentObj.updateOne(
    { _id: commentId },
    { $set: schema }
  );
  if (!updatedComment.modifiedCount && !updatedComment.matchedCount) {
    throw `Error : Unable to update comment with id : ${commentId} into database`;
  }
  return await this.getCommentById(commentId);
}

/**
 * Check and validate ID .
 * @param {} id : ID to be validate
 */
function getValidId(id) {
  if (!id) {
    throw "Given  id is invalid";
  }

  if (typeof id != "object" && typeof id != "string") {
    throw "Provide  id of type object or string ";
  }

  return id;
}

function getValidComment(commentText) {
  if (
    !commentText ||
    typeof commentText != "string" ||
    commentText.trim().length === 0
  ) {
    throw `Please enter valid comment.`;
  }
  return commentText;
}

module.exports = {
  getCommentById,
  getAllComments,
  getCommentByUserId,
  addNewComment,
  deleteComment,
  updateComment,
};
