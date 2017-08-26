$(window).on('load', function () {

    var badges_static_db_json;
    var rank_static_db_json;
    $.getJSON("/static/JSON/Badges.json", function (json) {
        badges_static_db_json = json;
    });

    $.getJSON("/static/JSON/Rank.json", function (json) {
        rank_static_db_json = json;
    });

    load_user_badges();
    get_user_rank();

    var walks_loaded = false;
    var badges_loaded = false;
    var badges = [];

    function load_user_badges() {

        //AJAX call to go here, temporarily access subarrray of JSON array

        $.ajax({

            url: Flask.url_for("user_badges_query"),
            async: true,
            type: 'GET',

            success: function (data) {
                construct_tumbler(data)
            },

            error: failedArticleLoad
        });
    }

    function construct_tumbler(data) {
        var num_badge = data.length;

        for (var i = 0; i < num_badge; i++) {
            var badge_to_add = data[i];

            //Create badge object and populate template
            badges[i] = new Badge_Card(badge_to_add.badge_id, i);

            if (i == 0) {
                $('#tumble-temp').replaceWith(badges[i].output_template());
            } else {
                $('.badges-tumbler-container').append(badges[i].output_template());
            }

            badges[i].place_in_collection();

        }

        initiateTumbler(num_badge);
        badges_loaded = true;
    }

    function Badge_Card(badge_id, badge_num) {
        //Private instance variables
        this.badge_id = badge_id;

        // badges_static_db_json[badge_id - 1] returns a JSON object for a specific badge

        //Setup badge_img_template and badge_collection_template
        if (badge_num == 0) {
            this.badge_img_template = $('<div class="tumble-item tumble-active" id="tumble-' + badge_num + '" >'
                + '<img class="badge-img" src="' + badges_static_db_json[badge_id - 1].badge_img_path + '">'
                + '</div>');
        } else {
            this.badge_img_template = $('<div class="tumble-item" id="tumble-' + badge_num + '" >'
                + '<img class="badge-img" src="' + badges_static_db_json[badge_id - 1].badge_img_path + '">'
                + '</div>');
        }

        this.output_template = function () {
            return this.badge_img_template;
        }

        //Badge collection template
        this.badge_collection_template = '<img class="badge" id="gw-badge-' + this.badge_id + '" src="' + badges_static_db_json[badge_id - 1].badge_img_path + '">';

        this.place_in_collection = function () {
            $('#gw-badge-' + this.badge_id).replaceWith(this.badge_collection_template);
        }

        //Access rank and place corresponding rank image and information
    }

//Initiate tumbler animation once the badges are ready
    function initiateTumbler(num_badge) {
        //Developed by J. Lees, JS-Fiddle: https://jsfiddle.net/2Tokoeka/nkws2dfz/
        var num_items = num_badge;

        if (num_items > 1) {
            var hide_item_num = 0;
            var show_item_num = 1;
            var timer = setInterval(item_transition, 4000);
        } else {
            var hide_item_num = 0;
            var show_item_num = 0;
        }

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
            if (show_item_num > (num_items - 1)) {
                show_item_num = 0;
            }
        }

    }

    function get_user_rank() {

        //AJAX call to go here, temporarily access subarrray of JSON array

        $.ajax({

            url: Flask.url_for("get_rank"),
            async: true,
            type: 'GET',

            success: function (data) {
                updateRank(data);
            },

            error: failedArticleLoad
        });
    }

    function updateRank(data) {
//Update rank counter and image
        var rank = data.rank;
        $('#rank-img-placeholder').replaceWith('<img class="badge-img" id="rank-img-final" src="' + rank_static_db_json[rank - 1].rank_img_path + '">');
        $('.rank-text.placeholder').text(" " + rank_static_db_json[rank - 1].rank_name).css('color', '#273B76');
        $('.next-rank.placeholder').text(" " + rank_static_db_json[rank].rank_name).css('color', '#5BA1D2');
        $('.headline-text.rank-numeral.placeholder').text(rank_static_db_json[rank - 1].rank_numeral).css('color', '#273B76');
    }

    function calculateTotalDistance(walk_distances) {

    }

});

