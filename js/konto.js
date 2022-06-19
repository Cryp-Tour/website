(function ($) {
    "use strict";

    $(function(){
        setLoginButton();
        userDataObserver();
    });

    $( "#logout-link" ).on( "click", async function(event){
        event.preventDefault();
        await fetch(window.BASEURL+"/user/logout", {
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
                hideValidate(userDataInput[i]);
                switch($(userDataInput[i]).attr('name')) {
                    case 'username':
                        submitData.username = $(userDataInput[i]).val();
                        break;
                    case 'email':
                        submitData.email = $(userDataInput[i]).val();
                        break;
                    case 'firstname':
                        submitData.firstname = $(userDataInput[i]).val();
                        break;
                    case 'surname':
                        submitData.surname = $(userDataInput[i]).val();
                        break;
                    case 'walletid':
                        submitData["wallet-id"] = $(userDataInput[i]).val();
                        break;
                    default:
                }
            }
        }

        if(check == false){
            $('#general-data .alert-box').show();
            $('#general-data .alert-box').text("Alle rot markierten Felder sind ungültig");
        }
        
        if(check){
            fetch(window.BASEURL+"/user/", {
                method: 'PATCH',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(submitData)
            }).then(response => {
                if(!response.ok){
                    response.text().then(function (text) {
                        if(text != ""){
                            $('#general-data .alert-box').text(text);
                        } else {
                            $('#general-data .alert-box').text("Error");
                        }
                        $('#general-data .alert-box').show();
                      });
                } else {
                    for(var i=0; i<userDataInput.length; i++) {
                        hideValidate(userDataInput[i]);
                    }
                    $('#general-data .alert-box').hide();
                    $('#general-data .success-box').show();
                    return true;
                }
            });
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
                hideValidate(passwordInputs[i]);
                switch($(passwordInputs[i]).attr('name')){
                    case "pass":
                        pass1 = $(passwordInputs[i]).val();
                        submitData.password = $(passwordInputs[i]).val();
                        break;
                    case "pass2":
                        pass2 = $(passwordInputs[i]).val();
                        break;
                }
            }
        }

        if(check == false){
            $('#change-password .alert-box').show();
            $('#change-password .alert-box').text("Alle rot markierten Felder sind ungültig");
        }

        if (pass1 != pass2 && check){
            check = false;
            $('#change-password .alert-box').text("Passwörter sind nicht identisch");
            $('#change-password .alert-box').show();
        }

        if(check){
            fetch(window.BASEURL+"/user/updatePassword", {
                method: 'PATCH',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(submitData)
            }).then(response => {
                if(!response.ok){
                    response.text().then(function (text) {
                        if(text != ""){
                            $('#change-password .alert-box').text(text);
                        } else {
                            $('#change-password .alert-box').text("Error");
                        }
                        $('#change-password .alert-box').show();
                      });
                } else {
                    for(var i=0; i<passwordInputs.length; i++) {
                        hideValidate(passwordInputs[i]);
                    }
                    $('#general-data .alert-box').hide();
                    $('#general-data .success-box').show();
                    return true;
                }
            });
        }

    });

    function showValidate(input) {
        $(input).addClass('user-input-alert');
    }

    function hideValidate(input) {
        $(input).removeClass('user-input-alert');
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
        fetch(window.BASEURL+"/user/loggedin", {
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
                        fetch(window.BASEURL+"/user", {
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