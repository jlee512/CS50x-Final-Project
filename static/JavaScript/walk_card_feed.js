/*-------------------------------------------------------*/
/*This JavaScript file is used to display 'Great Walks' cards on the main content page, this is to be done via infinite scrollingy*/
/*-------------------------------------------------------*/

// Great Walks JSON Array
var great_walks = [{
    walk_id: 1,
    walk_name: "Lake Waikaremoana",
    class_name: "waikare-walk",
    background_image: "/static/Media/Photographs/Walks/lakewaikaremoana.jpg"
},
    {
        walk_id: 2,
        walk_name: "Tongariro Northern Circuit",
        class_name: "tongariro-walk",
        background_image: "/static/Media/Photographs/Walks/tongarironortherncircuit.jpg"
    },
    {
        walk_id: 3,
        walk_name: "Whanganui River Journey",
        class_name: "whanganui-walk",
        background_image: "/static/Media/Photographs/Walks/whanganuijourney.jpg"
    },
    {
        walk_id: 4,
        walk_name: "Abel Tasman Coastal Track",
        class_name: "abel-walk",
        background_image: "/static/Media/Photographs/Walks/abeltasmancoasttrack.jpg"
    },
    {
        walk_id: 5,
        walk_name: "Heaphy Track",
        class_name: "heaphy-walk",
        background_image: "/static/Media/Photographs/Walks/heaphytrack.jpg"
    },
    {
        walk_id: 6,
        walk_name: "Paparoa + Pike 29 Memorial Track (2019)",
        class_name: "paparoa-walk",
        background_image: "/static/Media/Photographs/Walks/paparoatrackpike29memorialtrack.jpg"
    },
    {
        walk_id: 7,
        walk_name: "Milford Track",
        class_name: "milford-walk",
        background_image: "/static/Media/Photographs/Walks/milfordtrack.jpg"
    },
    {
        walk_id: 8,
        walk_name: "Routeburn Track",
        class_name: "routeburn-walk",
        background_image: "/static/Media/Photographs/Walks/keplertrack.jpg"
    },
    {
        walk_id: 9,
        walk_name: "Kepler Track",
        class_name: "kepler-walk",
        background_image: "/static/Media/Photographs/Walks/keplertrack.jpg"
    },
    {
        walk_id: 10,
        walk_name: "Rakiura Track",
        class_name: "rakiura-walk",
        background_image: "/static/Media/Photographs/Walks/routeburntrack.jpg"
    }];

//Setup global variables to store the state of walk-feed loading on the page at a given point in time (searching/sorting mechanisms to be factored in at a later stage)
var from = 0;
var count = 3;
var more_walks = true;
var sort_by = "name";
var ordering = "DESC";
var search_term = "";
var scroll_registered = false;


//Default page functionality
$(document).ready(function () {
//    Loader implementation
//    Hide the 'fully-loaded' bar
    $('#loaded1, #loaded2, #loaded3, #loaded4').hide();

    var main_scroll = $('main').scrollTop();
    var main_height = $('main').height();
    var window_height = $(window).height();
    var map_height = $('#map').height();
    var card_feed_height = $('.walk-card-feed').height();

    //Add in infinite scrolling when the user reaches the bottom of the window
    $('main').scroll(function () {


        main_scroll = $('main').scrollTop();
        main_height = $('main').height();
        window_height = $(window).height();

        if ((main_height - 10) <= (window_height + main_scroll) && more_walks && !scroll_registered) {
            console.log("scroll registered");
            scroll_registered = true;
            load_walks_increment();
        }
    });

    //By default, on page loading, load the first walk-cards until the page is full
    load_walks_increment();
    if ((main_height - 10) > (map_height + card_feed_height)) {
        load_walks_increment();

    }
});

//AJAX call to be implemented, but initially loading from JSON object
function load_walks_increment() {
    /*When the next increment of articles is loaded, initially display the loader until the walks are loaded*/
    $('.walk-feed-loader').show();

    //AJAX call to go here, temporarily access subarrray of JSON array

    $.ajax({

        url: Flask.url_for("basic_walks_query"),
        async: true,
        type: 'GET',
        data: {from: from, count: count, sort_by: sort_by, ordering: ordering, search_term: search_term},

        success: function (data) {
            successful_walks_load(data);
        },

        error: failedArticleLoad
    });

    from += count;
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

    if (data.length == 0) {
        //    If the data length is zero, there are no more walks to load
        $('.walk-feed-loader').hide();
        $('#loaded1, #loaded2, #loaded3, #loaded4').show();
        more_walks = false;

    } else {

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
    //    Once the previous AJAX call has been completed, allow another scroll-bottom event to be registered
    scroll_registered = false;
}

function Walk_Card(walk_id, walk_name, class_name, background_image) {
    //Private instance variables (instance specific)
    this.walk_id = walk_id;
    this.walk_name = walk_name;
    this.class_name = class_name;
    this.background_image = background_image;
    this.insert_location = $('#loader');

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
            set_background.css('background','-o-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4)), url(\'' + background_image + '\') center / cover');
            set_background.css('background','-moz-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4)), url(\'' + background_image + '\') center / cover')
            set_background.css('background','linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4)), url(\'' + background_image + '\') center / cover');

            //If the length of the walk_name is longer than 26 characters, reduce the font size to 14px
            if (walk_name.length > 26) {
                set_background.css('font-size','14px');
                $('h2.card-title-text', walk_card_template).css('font-size', '14px;');
                // console.log($('.card-title-text', walk_card_template).css('font-size'));
                console.log(set_background.css('font-size'));

            }

            //Once the content has been loaded, append the walk card to the walk-card-feed\
            walk_card_template.insertBefore('#loader');
            $('.walk-feed-loader').hide();

        });
    }
}