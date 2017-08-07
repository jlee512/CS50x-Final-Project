/*Function which randomises background image and alters menu styling to bd complimentary*/

$(document).ready(function () {
    var image_num = Math.floor((Math.random() * 7) + 1);
    var background = new Image();
    background.src = "/static/Media/Photographs/Backgrounds/" + image_num + ".jpg";

    /*Show background color AND hide the background image until loading*/
    $(".fullpage-background").hide();
    $(background).on('load', function () {
        $(".fullpage-background").css({
            "background-image": "url(" + $(this).attr("src") + ")",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "background-size": "cover"
        }).fadeIn(200, function () {
            /*Remove temporary background colour*/
            $(".fullpage-background-temp").remove();

        });

        assign_form_colors(image_num);

    });

    //Switch tabs between login and registration seamlessly
    var login_form = '<form class="login-form" action="' + Flask.url_for("login") + '" method="POST">';
    /*Username Entry*/
    login_form += '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
    login_form += '<input class="mdl-textfield__input" type="text" id="username" name="username">';
    login_form += '<label class="mdl-textfield__label" for="username">Username</label>';
    login_form += '</div>';
    /*Password Entry*/
    login_form += '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
    login_form += '<input class="mdl-textfield__input" type="password" id="password" name="password">';
    login_form += '<label class="mdl-textfield__label" for="password">Password</label>';
    login_form += '</div>';
    login_form += '<div>';
    login_form += '<button id="action-button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" type="submit">LOGIN</button>';
    login_form += '</div></form>';

    var registration_form = '<form class="login-form" action="' + Flask.url_for("register") + '" method="POST">';
    // Username Entry
    registration_form += '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
    registration_form += '<input class="mdl-textfield__input" type="text" id="username" name="username">';
    registration_form += '<label class="mdl-textfield__label" for="username">Enter a Username</label>';
    registration_form += '</div>'
    // Email Entry
    registration_form += '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
    registration_form += '<input class="mdl-textfield__input" type="email" id="email" name="email">';
    registration_form += '<label class="mdl-textfield__label" for="email">Email</label>';
    registration_form += '</div>';
    //Password Entry
    registration_form += '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
    registration_form += '<input class="mdl-textfield__input" type="password" id="password" name="password">';
    registration_form += '<label class="mdl-textfield__label" for="password">Choose a Password</label>';
    registration_form += '</div>';
    registration_form += '<div>';
    registration_form += '<button id="action-button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" type="submit">Register</button>';
    registration_form += '</div></form>';


    /*Toggle of login/registration tab*/
    $('.login-tab').on("click", function () {
        $(this).removeClass("form-inactive").addClass("form-active");
        $('.register-tab').removeClass("form-active").addClass("form-inactive");
        $('.mdl-card__actions').empty().append(login_form);
        assign_form_header_colors(image_num);
        $("#action-button").css(image_button);
        $('#action-button').text("LOGIN");
        componentHandler.upgradeDom();
        input_is_blank();
        username_check();
        email_check();

    });

    $('.register-tab').on("click", function () {
        $(this).removeClass("form-inactive").addClass("form-active");
        $(".login-tab").removeClass("form-active").addClass("form-inactive");
        $('.mdl-card__actions').empty().append(registration_form);
        assign_form_header_colors(image_num);
        $("#action-button").css(image_button);
        $('#action-button').text("REGISTER");
        componentHandler.upgradeDom();
        input_is_blank();
        unique_username_check();
        email_check();
        password_strength_check();

    });

});

/*Form colours statically declared for different background picture selections*/
var image_title;
var image_button;
var image_inactive;

var all_image1 = {'background-color': 'rgba(82, 163, 105, 1)', 'color': 'white'};
var image1_inactive = {'background-color': 'rgba(82, 163, 105, 0.5)', 'color': 'white'};
var title_image2 = {'background-color': 'rgba(91, 162, 208, 1)', 'color': 'white'};
var button_image2 = {'background-color': 'rgba(131, 217, 66, 1)', 'color': 'white'};
var image2_inactive = {'background-color': 'rgba(91, 162, 208, 0.5)', 'color': 'white'};
var title_image3 = {'background-color': 'rgba(88, 158, 253, 1)', 'color': 'white'};
var button_image3 = {'background-color': 'rgba(103, 176, 209, 1)', 'color': 'white'};
var image3_inactive = {'background-color': 'rgba(88, 158, 253, 0.5)', 'color': 'white'};
var all_image4 = {'background-color': 'rgba(132, 153, 36, 1)', 'color': 'white'};
var image4_inactive = {'background-color': 'rgba(132, 153, 36, 0.5)', 'color': 'white'};
var all_image5 = {'background-color': 'rgba(131, 217, 66, 1)', 'color': 'black'};
var image5_inactive = {'background-color': 'rgba(131, 217, 66, 0.5)', 'color': 'black'};
var title_image6 = {'background-color': 'rgba(109, 167, 241, 1)', 'color': 'black'};
var button_image6 = {'background-color': 'rgba(248, 200, 38, 1)', 'color': 'black'};
var image6_inactive = {'background-color': 'rgba(109, 167, 241, 0.5)', 'color': 'black'};
var title_image7 = {'background-color': 'rgba(178, 240, 255, 1)', 'color': 'black'};
var button_image7 = {'background-color': 'rgba(103, 176, 209, 1)', 'color': 'black'};
var image7_inactive = {'background-color': 'rgba(178, 240, 255, 0.5)', 'color': 'black'};

/*Assigns modified form colours subject to user selection*/
function assign_form_header_colors(image_num) {
    $(".form-active").animate(image_title, 350);
    $(".form-inactive").animate(image_inactive, 350);
    $("#action-button").animate(image_button, 200);

}

/*Assigns default form colours prior to any user action*/
function assign_form_colors(image_num) {

    switch (image_num) {
        case 1:
            image_title = all_image1;
            image_button = image_title;
            image_inactive = image1_inactive;
            break;
        case 2:
            image_title = title_image2;
            image_button = button_image2;
            image_inactive = image2_inactive;
            break;
        case 3:
            image_title = title_image3;
            image_button = button_image3;
            image_inactive = image3_inactive;
            break;
        case 4:
            image_title = all_image4;
            image_button = image_title;
            image_inactive = image4_inactive;
            break;
        case 5:
            image_title = all_image5;
            image_button = image_title;
            image_inactive = image5_inactive;
            break;
        case 6:
            image_title = title_image6;
            image_button = button_image6;
            image_inactive = image6_inactive;
            break;
        case 7:
            image_title = title_image7;
            image_button = button_image7;
            image_inactive = image7_inactive;
    }

    $(".form-active").css(image_title);
    $(".form-inactive").css(image_inactive);
    $("#action-button").css(image_button);

}

