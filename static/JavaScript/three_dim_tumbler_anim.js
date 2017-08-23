//Initiate tumbler animation once the document is ready
function initiateTumbler(){
    //Developed by J. Lees, JS-Fiddle: https://jsfiddle.net/2Tokoeka/nkws2dfz/

    var timer = setInterval(item_transition, 4000);
    var hide_item_num = 1;
    var show_item_num = 2;
    var num_items = 2;

    function item_transition() {
        var item_id = "tumble-";
        var item_hide_id = item_id + hide_item_num;
        var item_show_id = item_id + show_item_num;

        var hide_element = $('#' + item_hide_id);
        var show_element = $('#' + item_show_id);

        hide_element.on('animationend webkitAnimationEnd oAnimationEnd', function () {
            hide_element.removeClass('rotate-out');
            hide_element.removeClass('tumble-active');

        });

        show_element.on('animationend webkitAnimationEnd oAnimationEnd', function () {
            show_element.removeClass('rotate-in');
            show_element.addClass('tumble-active');
        });

        hide_element.addClass('rotate-out');
        show_element.addClass('rotate-in');

        hide_item_num = show_item_num;
        show_item_num++;
        if (show_item_num > num_items) {
            show_item_num = 1;
        }
    }

}

$(document).ready(function(){
   initiateTumbler()
});