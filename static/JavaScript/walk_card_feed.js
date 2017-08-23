/*-------------------------------------------------------*/
/*This JavaScript file is used to display 'Great Walks' cards on the main content page*/
/*-------------------------------------------------------*/

//Setup global variables to store the state of walk-feed loading on the page at a given point in time (searching/sorting mechanisms to be factored in at a later stage)
var walk_num = 0;

//Default page functionality
$(window).on('load', function () {
    $('#loading-mask').delay(2000).fadeOut();
    $('#site-content').delay(2050).fadeIn('slow');


//    Loader implementation
    /*When the next increment of articles is loaded, initially display the loader until the walks are loaded*/
    $('.walk-feed-loader').show();
//    Hide the 'fully-loaded' bar
    $('#loaded1, #loaded2, #loaded3, #loaded4').hide();
    load_walks();

    $('#loading-mask').fadeOut(500, function () {
        $(this).remove();
    });

});

//AJAX call to be implemented, but initially loading from JSON object
function load_walks() {

    //AJAX call to go here, temporarily access subarrray of JSON array

    $.ajax({

        url: Flask.url_for("basic_walks_query"),
        async: true,
        type: 'GET',
        data: {from: 0, count: 10},

        success: function (data) {
            successful_walks_load(data);
        },

        error: failedArticleLoad
    });
}

/*-------------------------------------------------------*/
/*If the AJAX call is failed, output an error message to the console*/
function failedArticleLoad(jqXHR, textStatus, errorThrown) {

    console.log(jqXHR.status);
    console.log(textStatus);
    console.log(errorThrown);

}

/*If a successful AJAX call is made, this function is called to process the results and populate the walk_card_template and subsequently the walk-card-feed.*/
function successful_walks_load(data) {

    var walk_cards = [];

    for (var i = 0; i < data.length; i++) {
        var individual_walk = data[i];

        //Transfer individual walk data to Walk_Card object instance
        walk_cards[i] = new Walk_Card(individual_walk.walk_id, individual_walk.walk_name, individual_walk.class_name, individual_walk.background_image);

    }

    for (var i = 0; i < walk_cards.length; i++) {
        walk_cards[i].load();

    }
}

function Walk_Card(walk_id, walk_name, class_name, background_image) {
    //Private instance variables (instance specific)
    this.walk_id = walk_id;
    this.walk_name = walk_name;
    this.class_name = class_name;
    this.background_image = background_image;

    //Priviate variable (class specific)
    this.walk_card_template = $('<div class="card ' + this.class_name + '">'
        + '<h2 class="card-title-text">'
        + this.walk_name
        + '<span class="card-icon">'
        + '<button class="mdl-button mdl-button--icon mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
        + '<i class="material-icons walk-card-icon">directions_walk</i>'
        + '</button>'
        + '</span>'
        + '</h2>'
        + '</div>');

    this.load = function () {
        var bg_img = new Image();
        bg_img.src = this.background_image;
        var walk_card_template = this.walk_card_template;
        var background_image = this.background_image;
        var walk_name = this.walk_name;

        $(bg_img).on('load', function () {

            var set_background = walk_card_template.find('h2.card-title-text');
            set_background.css('background', 'white');
            set_background.css('background', '-webkit-linear-gradient(right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4)), url(\'' + background_image + '\') center / cover');
            set_background.css('background', '-o-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4)), url(\'' + background_image + '\') center / cover');
            set_background.css('background', '-moz-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4)), url(\'' + background_image + '\') center / cover')
            set_background.css('background', 'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4)), url(\'' + background_image + '\') center / cover');

            //If the length of the walk_name is longer than 26 characters, reduce the font size to 14px
            if (walk_name.length > 26) {
                set_background.css('font-size', '14px');
                $('h2.card-title-text', walk_card_template).css('font-size', '14px');

            }

            $('h2.card-title-text', walk_card_template).css('display', 'none');

            //Once the content has been loaded, append the walk card to the walk-card-feed\
            walk_card_template.insertBefore('#loader');
            walk_num++;

            //If the last walk has been loaded, show all walk cards
            if (walk_num == 10) {
                $('h2.card-title-text').fadeIn('slow');
                $('.walk-feed-loader').fadeOut('slow');
                $('#loaded1, #loaded2, #loaded3, #loaded4').show();

            }

        });
    }
}