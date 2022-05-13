(function ($) {
    "use strict";

    $(function(){
        setLoginButton();
        userDataObserver();
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

    var userDataInput = $('#general-data .user-input');
    var passwordInputs = $('#change-password .user-input');

    $('#general-data').on('submit',function(event){
        event.preventDefault();
        let check = true;
        let submitData = {};

        for(var i=0; i<userDataInput.length; i++) {
            if(validate(userDataInput[i]) == false){
                showValidate(userDataInput[i]);
                check=false;
            } else {
                
            }
        }

        if(check == false){
            $('#general-data .alert-box').show();
            $('#general-data .alert-box').text("Alle rotmarkierten Felder sind ungültig");
        }
        
        if(check){
            console.log("Daten absenden");
        }

    });

    $('#change-password').on('submit',function(event){
        event.preventDefault();
        var check = true;
        let submitData = {};
        var pass1, pass2;

        for(var i=0; i<passwordInputs.length; i++) {
            if(validate(passwordInputs[i]) == false){
                showValidate(passwordInputs[i]);
                check=false;
            } else {
                switch($(passwordInputs[i]).attr('name')){
                    case "pass-old":
                        submitData.passOld = $(passwordInputs[i]).val();
                        break;
                    case "pass":
                        pass1 = $(passwordInputs[i]).val();
                        submitData.passNew = $(passwordInputs[i]).val();
                        break;
                    case "pass2":
                        pass2 = $(passwordInputs[i]).val();
                        break;
                }
            }
        }

        if(check == false){
            $('#change-password .alert-box').show();
            $('#change-password .alert-box').text("Alle rotmarkierten Felder sind ungültig");
        }

        if (pass1 != pass2 && check){
            check = false;
            $('#change-password .alert-box').text("Passwörter sind nicht identisch");
            $('#change-password .alert-box').show();
        }

        if(check){
            console.log("Daten absenden");
        }

    });

    function showValidate(input) {
        $(input).addClass('user-input-alert');
    }

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else if ($(input).attr('name') == 'walletid'){
            return true;
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function setLoginButton () {
        fetch("https://backend.cryptour.dullmer.de/user/loggedin", {
            method: 'get',
            credentials: 'include',
        }).then(response => {
            if(!response.ok && response.status == 401){
                $('#loggedIn-wrapper').hide();
                $('#loggedOut-wrapper').show();
            } else {
                $('#loggedIn-wrapper').show();
                $('#loggedOut-wrapper').hide();
            }
        });
    }

    function userDataObserver(){
        const observer = new MutationObserver(function(mutationsList, _){
            for(let i = 0; i < mutationsList.length; i++){
                if (mutationsList[i].type === "attributes" && mutationsList[i].attributeName === "style"){
                    if($('#userdata')[0].style.display == "block"){
                        fetch("https://backend.cryptour.dullmer.de/user", {
                            method: 'get',
                            credentials: 'include',
                        }).then(response =>{
                            if(response.ok){
                                response.json().then(function (json) {
                                    for(let j=0; j < userDataInput.length; j++){
                                        switch($(userDataInput[j]).attr('name')){
                                            case "firstname":
                                                $(userDataInput[j]).val(json.firstName);
                                                break;
                                            case "surname":
                                                $(userDataInput[j]).val(json.surname);
                                                break;
                                            case "username":
                                                $(userDataInput[j]).val(json.username);
                                                break;
                                            case "email":
                                                $(userDataInput[j]).val(json.email);
                                                break;
                                            case "walletid":
                                                $(userDataInput[j]).val(json.walletId);
                                                break;
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
        observer.observe($('#userdata')[0],{attributes : true});
    }

})(jQuery);