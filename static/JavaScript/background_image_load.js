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

});

function assign_form_colors(image_num) {

    var all_image1 = {'background-color': 'rgba(82, 163, 105, 1)', 'color': 'white'};
    var title_image2 = {'background-color': 'rgba(91, 162, 208, 1)', 'color': 'white'};
    var button_image2 = {'background-color': 'rgba(131, 217, 66, 1)', 'color': 'white'};
    var title_image3 = {'background-color': 'rgba(88, 158, 253, 1)', 'color': 'white'};
    var button_image3 = {'background-color': 'rgba(103, 176, 209, 1)', 'color': 'white'};
    var all_image4 = {'background-color': 'rgba(132, 153, 36, 1)', 'color': 'white'};
    var all_image5 = {'background-color': 'rgba(131, 217, 66, 1)', 'color': 'black'};
    var title_image6 = {'background-color': 'rgba(109, 167, 241, 1)', 'color': 'black'};
    var button_image6 = {'background-color': 'rgba(248, 200, 38, 1)', 'color': 'black'};
    var title_image7 = {'background-color': 'rgba(178, 240, 255, 1)', 'color': 'black'};
    var button_image7 = {'background-color': 'rgba(103, 176, 209, 1)', 'color': 'black'};

    var image_title;
    var image_button;

    switch (image_num) {
        case 1:
            image_title = all_image1;
            image_button = image_title;
            break;
        case 2:
            image_title = title_image2;
            image_button = button_image2;
            break;
        case 3:
            image_title = title_image3;
            image_button = button_image3;
            break;
        case 4:
            image_title = all_image4;
            image_button = image_title;
            break;
        case 5:
            image_title = all_image5;
            image_button = image_title;
            break;
        case 6:
            image_title = title_image6;
            image_button = button_image6;
            break;
        case 7:
            image_title = title_image7;
            image_button = button_image7;
    }

    $(".mdl-card__title").css(image_title);
    $("#login").css(image_button);

}