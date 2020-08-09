let commentButton = document.getElementById("commentButton");
let commentlabel = document.getElementById("commentLabel");
let commentTextarea = document.getElementById("commentTextarea");
let commentDoneButton = document.getElementById("commentDoneButton");

commentButton.addEventListener("click", addComment);
commentDoneButton.addEventListener("click", submitComment);

function addComment() {
  commentTextarea.hidden = false;
  commentDoneButton.hidden = false;
}

function submitComment() {
  if (commentTextarea.value) {
    //Create an label type dynamically.
    let element = document.createElement("label");

    //Assign different attributes to the element.
    element.setAttribute("type", "label");
    element.setAttribute("name", "comment");
    element.setAttribute("value", commentTextarea.value);

    //Append the element in page (in span).
    commentlabel.appendChild(element);
    element.innerHTML = commentTextarea.value;

    //append br element to display comment d
    let brelement = document.createElement("br");
    commentlabel.appendChild(brelement);
  }
  commentTextarea.value = "";
  commentTextarea.hidden = true;
  commentDoneButton.hidden = true;
}
