/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-14 06:21:43
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-14 06:23:22
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
        window.location.replace("http://localhost:3000/house/"+houseId);
    });
}