/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-14 06:21:43
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 23:28:51
 */
function deletereview(){
    let buttonId = event.srcElement.value;
    let id = buttonId;
    let houseId = $('input[name="houseId"]').val();
    let requestConfig = {
    method: 'DELETE',
    url: '/review/' + id,
    contentType: 'application/json',
    data: JSON.stringify({
        id: id,
        houseId: houseId
    })
    }
    $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage);
        reloadHouse();
    });
}

function reloadHouse() {
   
    let houseId = $('input[name="houseId"]').val();
    let xhttpget = new XMLHttpRequest();
    method = "GET";
    url = "/house/"+houseId;
  
    xhttpget.open(method, url, true);
    xhttpget.setRequestHeader("Content-type", "application/json");
    xhttpget.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttpget.send();
  
    location.reload();
  }