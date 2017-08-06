$(document).ready(function () {

    input_is_blank();

});

var input_is_blank = function() {

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
