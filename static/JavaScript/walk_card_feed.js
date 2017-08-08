/*-------------------------------------------------------*/
/*This JavaScript file is used to display 'Great Walks' cards on the main content page, this is to be done via infinite scrollingy*/
/*-------------------------------------------------------*/

// Great Walks JSON Array
var great_walks = [{walk_id: 1, walk_name: "Lake Waikaremoana", class_name: "waikare-walk"},
    {walk_id: 2, walk_name: "Tongariro Northern Circuit", class_name: "tongariro-walk"},
    {walk_id: 3, walk_name: "Whanganui River Journey", class_name: "whanganui-walk"},
    {walk_id: 4, walk_name: "Abel Tasman Coastal Track", class_name: "abel-walk"},
    {walk_id: 5, walk_name: "Heaphy Track", class_name: "heaphy-walk"},
    {walk_id: 6, walk_name: "Paparoa + Pike 29 Memorial Track (2019)", class_name: "paparoa-walk"},
    {walk_id: 7, walk_name: "Milford Track", class_name: "milford-walk"},
    {walk_id: 8, walk_name: "Routeburn Track", class_name: "routeburn-walk"},
    {walk_id: 9, walk_name: "Kepler Track", class_name: "kepler-walk"},
    {walk_id: 10, walk_name: "Rakiura Track", class_name: "rakiura-walk"}];

var walk_card_template = '<div class="card">'
    + '<h2 class="card-title-text">'
    + '<span class="card-icon">'
    + '<button class="mdl-button mdl-button--icon mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons walk-card-icon">directions_walk</i>'
    + '</button>'
    + '</span>'
    + '</h2>'
    + '</div>';

//Setup global variables to store the state of walk-feed loading on the page at a given point in time (searching/sorting mechanisms to be factored in at a later stage)
var from = 0;
var count = 3;
var more_walks = true;
var sort_by = "name";
var ordering = "DESC";
var serach_term = "";
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

        console.log("Scroll: " + main_scroll);
        console.log("Window: " + window_height);
        console.log("Main " + main_height);
        console.log("Section 1 " + $('.mdl-layout__header-row').height());
        console.log("Section 2: " + $('.mdl-layout__tab.is-active').height());
        console.log("Section 3: " + $('#map').height());
        console.log("Walk card feed: " + $('.walk-card-feed').height());
        console.log("More walks: " + more_walks);
        console.log("scroll reg: " + scroll_registered);

        if ((main_height - 10) <= (window_height + main_scroll) && more_walks && !scroll_registered) {
            console.log("scroll registered");
            scroll_registered = true;
            load_walks_increment();
        }
        //
        // if (!more_walks) {
        //     $('#loaded1, #loaded2, #loaded3, #loaded4').show();
        //
        // }
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

    data = great_walks.slice(from, (from + count));

    successful_walks_load(data);

    from += count;

}

/*If a successful AJAX call is made, this function is called to process the results and populate the walk_card_template and subsequently the walk-card-feed.*/
function successful_walks_load(data) {

    //Access the card container where loaded cards are to be appended
    var walk_card_insert_location = $('#loader');

    if (data.length == 0) {
        //    If the data length is zero, there are no more walks to load
        $('.walk-feed-loader').hide();
        $('#loaded1, #loaded2, #loaded3, #loaded4').show();
        more_walks = false;

    } else {
        for (var i = 0; i < data.length; i++) {
            var individual_walk = data[i];
            var walk_template_to_populate = $(walk_card_template);

            //    Add href attribute at a later stage to link to more detailed walk information
            walk_template_to_populate.addClass(individual_walk.class_name);
            walk_template_to_populate.find('.card-title-text').prepend(individual_walk.walk_name);

            //Once the content has been loaded, hide the loader and append the walk card to the walk-card-feed
            $('.walk-feed-loader').hide();
            walk_template_to_populate.insertBefore(walk_card_insert_location);

            //    If the message length is less than the requested count, hide the loader and set 'more_walks' to false as the end of the walks list has been reached
            if (data.length < count) {
                $('.walk-feed-loader').hide();
                $('#loaded1, #loaded2, #loaded3, #loaded4').show();
                more_walks = false;

            }
        }
    }
//    Once the previous AJAX call has been completed, allow another scroll-bottom event to be registered
    scroll_registered = false;
}
