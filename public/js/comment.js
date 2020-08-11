/*
 * @Description:
   defines client js method to update UI based on user action.
 * @Author: Syed Mahvish
 *
 *
 */

let commentButton = document.getElementById("commentButton");
let commentTextarea = document.getElementById("commentTextarea");
let commentDoneButton = document.getElementById("commentDoneButton");
let errorMessage = document.getElementById("error");

commentButton.addEventListener("click", addComment);
commentDoneButton.addEventListener("click", submitComment);

let isEdit = false;
let commentId = "";

/**
 * When "Add comment" button is tap, textarea and done button become visible and
 * allow user to add comment in textarea.
 */
function addComment() {
  errorMessage.hidden = true;
  commentTextarea.hidden = false;
  commentDoneButton.hidden = false;
}

/**
 * When user add comment, tap on "Done" button,
 * it will hide textarea and done button
 * Calls "Post" method to add comment in Comments Database.
 * Reloads all comments.
 */
function submitComment() {
  errorMessage.hidden = true;
  let commentText = "";
  commentText = validComment(commentTextarea.value);
  if (commentText) {
    hideCommentTextArea(true);
  } else {
    hideCommentTextArea(false);
    return;
  }

  let xhttp = new XMLHttpRequest();
  let method = "POST";
  let url = "/comment";

  if (isEdit && commentId) {
    method = "PATCH";
    url = url + "/" + commentId;
  }
  isEdit = false;

  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhttp.send(JSON.stringify({ text: commentText }));

  if (xhttp.responseText) {
    console.log(xhttp.responseText);
  }
  reloadComments();
}

function validComment(commentText) {
  if (
    !commentText ||
    typeof commentText != "string" ||
    commentText.trim().length === 0
  ) {
    errorMessage.hidden = false;
    return;
  }
  return commentText;
}

function hideCommentTextArea(isHidden) {
  commentTextarea.value = "";
  commentTextarea.hidden = isHidden;
  commentDoneButton.hidden = isHidden;
}

/**
 * If comment added user is same as login user, it allow to edit comment.
 * When "Edit" button tap,
 * "PATCH" method calls and update comment in Comments Database,
 *  reloads all comments
 */
function editcomment() {
  let buttonId = event.srcElement.value;
  if (!buttonId) {
    throw `Cannot edit comment. Invalid comment Id`;
  }

  commentTextarea.hidden = false;
  commentDoneButton.hidden = false;

  commentTextarea.value = document.getElementById(buttonId).innerHTML;

  isEdit = true;

  commentId = buttonId;
}

/**
 * If comment added user is same as login user, it allow to DELETE comment.
 * When "DELETE" button tap,
 * "DELETE" method calls and DELETE comment in Comments Database,
 *  reloads all comments
 */
function deletecomment() {
  let buttonId = event.srcElement.value;
  if (!buttonId) {
    throw `Cannot delete comment. Invalid comment Id`;
  }

  let xhttp = new XMLHttpRequest();
  let method = "DELETE";
  let url = "/comment";
  url = url + "/" + buttonId;

  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhttp.send(JSON.stringify({ id: buttonId }));

  reloadComments();
}

/**
 * This method calls "GET" method  and get all comments from Comments Database,
 * and refresh window
 */
function reloadComments() {
  let xhttpget = new XMLHttpRequest();
  method = "GET";
  url = "/comment";

  xhttpget.open(method, url, true);
  xhttpget.setRequestHeader("Content-type", "application/json");
  xhttpget.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhttpget.send();

  location.reload();
}