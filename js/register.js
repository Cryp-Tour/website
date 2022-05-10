
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(event){
        event.preventDefault();
        var check = true;
        let registerData = {};
        let password, password2;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            } else {
                switch($(input[i]).attr('name')) {
                    case 'username':
                        registerData.username = $(input[i]).val();
                        break;
                    case 'pass':
                        registerData.password = $(input[i]).val();
                        password = $(input[i]).val();
                        break;
                    case 'pass2':
                        password2 = $(input[i]).val();
                        break;
                    case 'email':
                        registerData.email = $(input[i]).val();
                        break;
                    case 'firstname':
                        registerData.firstname = $(input[i]).val();
                        break;
                    case 'surname':
                        registerData.surname = $(input[i]).val();
                        break;
                    default:
                }
            }
        }

        if (password != password2){
            check=false;
            $('.alert-text').text("passwords not identical");
            $('.alert-text').css('visibility', 'visible');
        }

        if(check){
            fetch("https://backend.cryptour.dullmer.de/user", {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(registerData)
            }).then(response => {
                if(!response.ok){
                    response.text().then(function (text) {
                        $('.alert-text').text(text);
                        $('.alert-text').css('visibility', 'visible');
                      });
                } else {
                    window.location.href = "/konto.html";
                    return true;
                }
            });
        }
        return false;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });


})(jQuery);