
(function ($) {
    "use strict";

    $(function(){
        setLoginButton();
    });

    $( "#logout-link" ).on( "click", async function(event){
        event.preventDefault();
        await fetch("https://backend.cryptour.dullmer.de/user/logout", {
            method: 'post',
            credentials: 'include',
        }).then(response => {
            if(!response.ok && response.status == 401){
            } else {
                setLoginButton();
            }
        });
    });

    function setLoginButton () {
        fetch("https://backend.cryptour.dullmer.de/user/loggedin", {
            method: 'get',
            credentials: 'include',
        }).then(response => {
            if(!response.ok && response.status == 401){
                $('#logout-wrapper').hide();
                $('#login-wrapper').show();
                $('#register-wrapper').show();
            } else {
                $('#logout-wrapper').show();
                $('#login-wrapper').hide();
                $('#register-wrapper').hide();
            }
        });
    }

})(jQuery);