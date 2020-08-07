$('.clientsideLoginErrors').hide();
$('#loginForm').submit((event) => {
    event.preventDefault();
    let getEmail = $('#email').val().toLowerCase();
    let getPassword = $('#password').val();
    let regex = /[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if ((!getEmail || !getPassword || !regex.test(getEmail))) {
        if ($('.responseError').length) {
            $('.responseError').remove();
        }
        if ($('.second-row').length) {
            $('.second-row').remove();
        }
        if (!$('.missingInput').length) {
            $('.clientsideLoginErrors').append(`<p class="missingInput">You must provide a valid email address and password</p>`);
            $('.clientsideLoginErrors').show();
        }
    } else {
        let requestConfig = {
            method: 'POST',
            url: '/login/result',
            contentType: 'application/json',
            data: JSON.stringify({
                email: getEmail,
                password: getPassword
            })
        }
        $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage.error) {
                if ($('.missingInput').length) {
                    $('.missingInput').remove();
                }
                if ($('.second-row').length) {
                    $('.second-row').remove();
                }
                if (!$('.responseError').length){
                    $('.clientsideLoginErrors').append(`<p class="responseError">${responseMessage.error}</p>`)
                    $('.clientsideLoginErrors').show();
                }
            } else {
                window.location.replace("http://localhost:3000");
            }
        });
    }
});