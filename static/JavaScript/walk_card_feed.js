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
var scroll_registered =false;

$(document).ready(function() {

//    Loader implementation


});

