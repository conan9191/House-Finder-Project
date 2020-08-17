/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-16 19:07:15
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 23:32:24
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
  