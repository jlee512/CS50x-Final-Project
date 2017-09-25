/**
 * Created by julia on 15/09/2017.
 */

$(document).ready(function () {

    //Add Walk Button Clicked - Reveal Form and Present Cancel Button
    $('.manage-trips-button.mdl-button--raised.toggle-add-walk-button').on('click', function () {
        if ($('.toggle-add-walk-button').attr('id') === 'add-walk-button') {
            $('#add-walk-form').append(form_template);
            $('#add-walk-button').text('CANCEL');
            $('#add-walk-button').css('background-color', '#994440');
            $('#add-walk-button').attr('id', 'cancel-walk-button');
            InitialiizeDatepicker();
        } else {
            //Cancel Walk Button Logic to Toggle Form Visibility
            $('#add-walk-form').empty();
            $('#cancel-walk-button').text('NEW TRIP');
            $('#cancel-walk-button').css('background-color', '#5BA1D2');
            $('#cancel-walk-button').attr('id', 'add-walk-button');
        }
        componentHandler.upgradeDom();
    });
});

//-------------------------------------ADD WALK FORM TEMPLATE--------------------------------------------

var form_template = '<div class="card-container">'
    + '<div class="mdl-card mdl-shadow--2dp">'
    + '<div id="new-walk-form-container">'
    + '<form action="/add_walk" method="POST">'
    + '<div class="trip-northisland-heading"><strong>North Island Walks</strong></div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-lake-waikaremoana">'
    + '<input type="radio" id="add-lake-waikaremoana" class="mdl-radio__button" name="walks-set" value="Lake Waikaremoana" checked>'
    + '<span class="mdl-radio__label">Lake Waikaremoana</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-tongariro">'
    + '<input type="radio" id="add-tongariro" class="mdl-radio__button" name="walks-set" value="Tongariro Northern Circuit">'
    + '<span class="mdl-radio__label">Tongariro Northern Circuit</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-whanganui">'
    + '<input type="radio" id="add-whanganui" class="mdl-radio__button" name="walks-set" value="Whanganui Journey">'
    + '<span class="mdl-radio__label">Whanganui Journey</span>'
    + '</label>'
    + '</div>'
    + '<div class="trip-southisland-heading"><strong>South Island Walks</strong></div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-abel">'
    + '<input type="radio" id="add-abel" class="mdl-radio__button" name="walks-set" value="Abel Tasman Coast Track">'
    + '<span class="mdl-radio__label">Abel Tasman Coast Track</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-heaphy">'
    + '<input type="radio" id="add-heaphy" class="mdl-radio__button" name="walks-set" value="Heaphy Track">'
    + '<span class="mdl-radio__label">Heaphy Track</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-paparoa">'
    + '<input type="radio" id="add-paparoa" class="mdl-radio__button" name="walks-set" value="Paparoa Track + Pike29 Memorial Track">'
    + '<span class="mdl-radio__label">Paparoa Track + Pike29 Memorial Track</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-routeburn">'
    + '<input type="radio" id="add-routeburn" class="mdl-radio__button" name="walks-set" value="Routeburn Track">'
    + '<span class="mdl-radio__label">Routeburn Track</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-kepler">'
    + '<input type="radio" id="add-kepler" class="mdl-radio__button" name="walks-set" value="Kepler Track">'
    + '<span class="mdl-radio__label">Kepler Track</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-milford">'
    + '<input type="radio" id="add-milford" class="mdl-radio__button" name="walks-set" value="Milford Track">'
    + '<span class="mdl-radio__label">Milford Track</span>'
    + '</label>'
    + '</div>'
    + '<div>'
    + '<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="add-rakiura">'
    + '<input type="radio" id="add-rakiura" class="mdl-radio__button" name="walks-set" value="Rakiura Track">'
    + '<span class="mdl-radio__label">Rakiura Track</span>'
    + '</label>'
    + '</div>'

    // -------------------------Date Started datepicker ------------------------

    + '<div class="datepicker-section date-started">'
    + '<span class="trip-island-heading date-started"><strong>Date Started</strong></span>'

    + '<div class="datepicker-container date-started">'
    + '<div class="datepicker col-1">'
    + '<div class="datepicker row-1">'
    + '<button type="button" id="increase-day" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">add</i></button>'
    + '</div>'
    + '<div class="datepicker row-2">'
    + '<input type="number" name="day" id="day" min="1" value="1" maxlength="9">'
    + '</div>'
    + '<div class="datepicker row-3">'
    + '<button type="button" id="reduce-day" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">remove</i></button>'
    + '</div>'
    + '</div>'

    + '<div class="datepicker col-2">'
    + '<div class="datepicker row-1">'
    + '<button type="button" id="increase-month" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">add</i></button>'
    + '</div>'
    + '<div class="datepicker row-2">'
    + '<input type="text" name="month" id="month" value="January">'
    + '</div>'
    + '<div class="datepicker row-3">'
    + '<button type="button" id="reduce-month" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">remove</i></button>'
    + '</div>'
    + '</div>'

    + '<div class="datepicker col-3">'
    + '<div class="datepicker row-1">'
    + '<button type="button" id="increase-year" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">add</i></button>'
    + '</div>'
    + '<div class="datepicker row-2">'
    + '<input type="number" name="year" id="year" max="2500" min="1900" value="2017">'
    + '</div>'
    + '<div class="datepicker row-3">'
    + '<button type="button" id="reduce-year" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">remove</i></button>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<input type="text" name="leap-year" id="leap-year" hidden>'
    + '</div>'

    // -------------------------Walk duration Selection ------------------------

    + '<div class="datepicker-section date-completed">'
    + '<span class="trip-island-heading date-completed"><strong>Walk Duration (Days)</strong></span>'

    + '<div class="durationpicker-container date-completed">'
    + '<div class="durationpicker col-1">'
    + '<div class="durationpicker row-3">'
    + '<button type="button" id="reduce-day" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">remove</i></button>'
    + '</div>'
    + '<div class="durationpicker row-2">'
    + '<input type="number" name="duration" id="day" min="1" value="1" maxlength="9">'
    + '</div>'

    + '<div class="durationpicker row-1">'
    + '<button type="button" id="increase-day" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">'
    + '<i class="material-icons">add</i></button>'

    + '</div>'
    + '</div>'

    + '</div>'
    + '</div>'

    // ----------------------------- Add Trip Button -----------------------------

    + '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect manage-trips-button" id="confirm-walk-button">Confirm New Trip</button>'
    + '</form>'
    + '</div>'

    + '</div>'
    + '</div>';