/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-08-16 15:22:12
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 23:25:58
 */

function imageOnClick() {
  document.getElementById("updatepicture").click();
}

function updateimage() {
  let file = document.getElementById("updatepicture").files[0];
  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {
    const img = new Image();
    // img.height = "100";
    // img.width = "100";
    img.src = evt.target.result;
    updateImageAPIcall(img.src);
    // profilePictureArray.push(img.src);
  });
  FR.readAsDataURL(file);
}

function updateImageAPIcall(imageSource) {
  let requestConfig = {
    method: "PATCH",
    url: "/account",
    contentType: "application/json",
    data: JSON.stringify({
      profilePicture: imageSource,
    }),
  };
  $.ajax(requestConfig).then(function (responseMessage) {
    console.log(responseMessage);
    reloadAccount();
  });
}

function reloadAccount() {
  let xhttpget = new XMLHttpRequest();
  method = "GET";
  url = "/account";

  xhttpget.open(method, url, true);
  xhttpget.setRequestHeader("Content-type", "application/json");
  xhttpget.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhttpget.send();

  location.reload();
}
