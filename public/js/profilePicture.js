/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-16 15:22:12
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-16 16:04:11
 */

function imageOnClick(){
    document.getElementById('updatepicture').click();
}

function updateimage() {
    let img = document.getElementById('updatepicture').files[0].name;
    let requestConfig = {
    method: 'POST',
    url: '/account',
    contentType: 'application/json',
    data: JSON.stringify({
      profilePicture: img,
    })
    }
    $.ajax(requestConfig).then(function (responseMessage) {
        window.location.replace("http://localhost:3000/account");
    });
}
