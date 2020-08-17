/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-16 15:22:12
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 23:25:58
 */

function imageOnClick(){
    document.getElementById('updatepicture').click();
}

function updateimage() {
    let img = document.getElementById('updatepicture').files[0].name;
    let requestConfig = {
    method: 'PATCH',
    url: '/account',
    contentType: 'application/json',
    data: JSON.stringify({
      profilePicture: img,
    })
    }
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