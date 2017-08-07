$(document).ready(function () {

    input_is_blank();
    email_check();
    if (window.location.pathname === '/register') {
        unique_username_check();
        password_strength_check();

    } else {
        username_check();

    }

});

var input_is_blank = function () {

    /* Check form input validity (first checking for blank input)*/
    $(".mdl-textfield__input").blur(function () {
        if (!this.value) {
            $(this).prop('required', true);
            $(this).parent().addClass('is-invalid');

        }
    });
    $(".mdl-button[type='submit']").click(function (event) {
        $(this).siblings(".mdl-textfield").addClass('is-invalid');
        $(this).siblings(".mdl-textfield").children(".mdl-textfield__input").prop('required', true);
    });
};

var unique_username_check = function () {

    $('#username').blur(function () {
        var username_input = $(this).val();
        var input_label = $(this).next();

        if (username_input.length > 5) {
            input_label.text("Checking username validity").css('color', '#EDC13A');

            $.ajax({
                type: 'POST',
                url: Flask.url_for("username_check"),
                data: JSON.stringify({username: username_input}),
                contentType: 'application/json;charset=UTF-8',
                success: function (response) {
                    if (response === "invalid") {
                        //Enhance user experience by informing them of validity of username (INVALID)
                        $('#username').parent().addClass("is-invalid");
                        input_label.text('Username unavailable, please enter a different username').css('color', '#D50000');

                    } else {
                        //(VALID)
                        input_label.text('Username valid').css('color', '#2196F3');
                    }
                },
                error: function (response) {
                    console.log(response);

                }
            });
        } else {
            input_label.text('Username must be at least 6 characters long').css('color', '#D50000');

        }
    });
};

//Check on password strength for registration
var password_strength_check = function () {

    $('#password').keyup(function () {
        var password_input = $(this).val();
        var password_label = $(this).next();

        //Initialise variables used to quantify password strength
        var password_strength = 0;

        if (password_input.length < 8) {
            password_label.text('Password - must be at least 8 characters long').css('color', '#D50000');

        } else {
            password_strength++;

            //If password contains a mix of upper and lower case letters, increment password strength
            if (password_input.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                password_strength++;

            }

            //If password has numbers and characters, increment password strength
            if (password_input.match(/([a-zA-Z])/) && password_input.match(/([0-9])/)) {
                password_strength++;

            }

            //If password has at least 1 special character, increment password strength
            if (password_input.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
                password_strength++;

            }

            //If password has two special characters, increment password strength
            if (password_input.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) {
                password_strength++;

            }

            //If password length is 12 characters long or longer, increment password strength
            if (password_input.length > 11) {
                password_strength++;

            }

            if (password_input.length > 13) {
                password_strength++;

            }

            if (password_strength < 2) {
                password_label.text('Password - Very weak').css('color', '#D50000');

            } else if (password_strength < 3) {
                password_label.text('Password - Weak').css('color', '#E7861F');

            } else if (password_strength < 4) {
                password_label.text('Password - Moderate').css('color', '#EDC13A');

            } else if (password_strength < 5) {
                password_label.text('Password - Strong').css('color', '#74AD3C');

            } else if (password_strength > 4) {
                password_label.text('Password - Very Strong').css('color', '#44A39D')

            }
        }
    });
};

//Used for login only (to verify username is not blank)
var username_check = function() {

    $('#username').blur(function () {
        var username_input = $(this).val();
        var username_label = $(this).next();

        if (username_input.length === 0) {
            username_label.text('Please enter a username').css('color', '#D50000');

        } else {
            username_label.text('Username').css('color', '#2196F3');

        }
    });
};

var email_check = function () {

    $('#email').blur(function () {
        var email_input = $(this).val();
        var email_label = $(this).next();

        if (email_input.length > 0 && $(this).parent().hasClass("is-invalid")) {
            email_label.text("Invalid email address").css('color', '#D50000');


        } else if (email_input.length === 0) {
            email_label.text('Email - must not be blank').css('color', '#D50000');

        } else {
            email_label.text('Email').css('color', '#2196F3');


        }
    });
};
