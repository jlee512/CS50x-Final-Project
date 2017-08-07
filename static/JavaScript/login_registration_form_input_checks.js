$(document).ready(function () {

    input_is_blank();
    if(window.location.pathname === '/register') {
        unique_username_check()

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

var unique_username_check = function() {

    $('#username').blur(function () {
        var username_input = $(this).val();

        $.ajax({
            type: 'POST',
            url: Flask.url_for("username_check"),
            data: JSON.stringify({username: username_input}),
            contentType: 'application/json;charset=UTF-8',
            success: function(response) {
                console.log(response)

            },
            error: function(response) {
                console.log(response);

            }
        });
    });
};

$('#password').blur({


});
