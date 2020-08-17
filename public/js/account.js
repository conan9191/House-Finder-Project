/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-16 19:07:15
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 20:10:59
 */
function deleteAccount(){
    
    let xhttp = new XMLHttpRequest();
    let method = "DELETE";
    let url = "/account";
  
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.send(JSON.stringify({ }));
  
    reloadAccount();
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
  