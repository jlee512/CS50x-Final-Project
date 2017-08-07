$(document).ready(function () {

    input_is_blank();
    email_check();
    if (window.location.pathname === '/register') {
        unique_username_check();

    } else {
        console.log("test")
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

        if (username_input.length > 0) {
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
            input_label.text('Username must not be blank').css('color', '#D50000');

        }
    });
};

//Used for login only (to verify username is not blank)
var username_check = function() {

    $('#username').blur(function () {
        var username_input = $(this).val();
        var username_label = $(this).next();

        if (username_input.length === 0) {
            username_label.text('Username - must not be blank').css('color', '#D50000');

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
