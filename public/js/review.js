/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-13 09:34:05
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-13 10:33:47
 */
$(document).ready(function(){
    let id = $('#deleteBtn').val();
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
    $('#deleteBtn').click(function () {
        $.ajax(requestConfig).then(function (responseMessage) {
            window.location.replace("http://localhost:3000/house/"+houseId);
        });
    });

});
