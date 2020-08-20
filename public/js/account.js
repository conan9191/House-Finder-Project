/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-16 19:07:15
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-18 12:58:08
 */
function deleteAccount(){
    let requestConfig = {
    method: 'DELETE',
    url: '/account',
    contentType: 'application/json',
    data: JSON.stringify({
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
  
  
function updateInfo(){
    window.location.replace("http://localhost:3000/update");
}
