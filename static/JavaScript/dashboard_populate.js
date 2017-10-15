//Populate the statistics dashboard and passport page
var badges_loaded = false;
var badges = [];
var badges_static_db_json;
var rank_static_db_json;
var distance_sum = 0;
var north_walks_count = 0;
var south_walks_count = 0;

$(window).on('load', function () {

    load_user_badges();
    get_user_rank();

    function load_user_badges() {

        //AJAX call to go here, temporarily access subarrray of JSON array

        $.ajax({

            url: Flask.url_for("user_badges_query"),
            async: true,
            type: 'GET',

            success: function (data) {
                $.getJSON("/static/JSON/Badges.json", function (json) {
                    badges_static_db_json = json;
                    construct_tumbler(data);
                });
            },

            error: failedArticleLoad
        });
    }
});

function load_user_total_distance() {

    //AJAX call to go here, temporarily access subarrray of JSON array

        $.ajax({

            url: Flask.url_for("total_distance_query"),
            async: true,
            type: 'GET',

            success: function (data) {
                console.log(data);
            },

            error: failedArticleLoad
        });
}

//Based on data received from AJAX call, populate badge tumbler and badge collection
function construct_tumbler(data) {
    var num_badge = data.length;

    if (num_badge == 0) {
        badges[0] = new Badge_Card(11, num_badge);
        var img = new Image();
        img.src = badges[0].output_template();
        $('#tumble-temp').attr('id', 'tumble-0');
        img.onload = function () {
            $('#tumble-0 .badge-img').attr("src", img.src);
            badges[0].place_in_collection();
        }
    }
    else
        {
            for (var i = 0; i < num_badge; i++) {
                var badge_to_add = data[i];

                //Create badge object and populate template
                badges[i] = new Badge_Card(badge_to_add.badge_id, i);

                //Check whether North or South Island Walk and add one-way-distance to sum for countup animation
                distance_sum += badge_to_add.one_way_distance;
                load_user_total_distance();

                switch (badge_to_add.walk_id) {
                    case 2:
                    case 12:
                    case 22:
                        north_walks_count++;
                        break;
                    case 32:
                    case 42:
                    case 52:
                    case 62:
                    case 72:
                    case 82:
                    case 92:
                        south_walks_count++;
                        break;
                }

                //Replacement of placeholder for first badge (i.e. not 'appending' to the tumbler)
                if (i == 0) {
                    var img = new Image();
                    img.src = badges[i].output_template();
                    $('#tumble-temp').attr('id', 'tumble-0');
                    img.onload = function () {
                        $('#tumble-0 .badge-img').attr("src", img.src);
                    };
                //If not the first badge, the badge image <html> code should be appended to the badge tumbler
                } else {
                    $('.badges-tumbler-container').append(badges[i].output_template());
                }

                badges[i].place_in_collection();
            }
        }
        //Initiate the tumbler once data is available from ajax call
        initiateTumbler(num_badge);
        badges_loaded = true;

        //Initiate distance/walk counters
        $('.counter.total-distance').text(distance_sum.toFixed(1)).css('color', '#273B76');
        $('.counter.north-walks').text(north_walks_count).css('color', '#273B76');
        $('.counter.south-walks').text(south_walks_count).css('color', '#273B76');

        startCounter();
    }

//Badge class definition
    function Badge_Card(badge_id, badge_num) {
        //Private instance variables
        this.badge_id = badge_id;
        //Badge collection template
        // badges_static_db_json[badge_id - 1] returns a JSON object for a specific badge
        this.badge_collection_src = badges_static_db_json[badge_id - 1].badge_img_path;

        //Setup badge_img_template and badge_collection_template
        if (badge_num == 0) {
            this.badge_img_template = badges_static_db_json[badge_id - 1].badge_img_path;
        } else {
            this.badge_img_template = $('<div class="tumble-item" id="tumble-' + badge_num + '" >'
                + '<img class="badge-img" src="' + badges_static_db_json[badge_id - 1].badge_img_path + '">'
                + '</div>');
        }

        this.output_template = function () {
            return this.badge_img_template;
        };

        this.place_in_collection = function () {
            $('#gw-badge-' + this.badge_id).attr('src', '/static/Media/Loader/loader.svg');
            var img = new Image();
            img.src = this.badge_collection_src;
            img.onload = showBadgeImage(this.badge_id, img);
        };

        function showBadgeImage(badge_id, img) {
            $('#gw-badge-' + badge_id).attr('src', img.src);
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

                $.getJSON("/static/JSON/Rank.json", function (json) {
                    rank_static_db_json = json;
                    updateRank(data);
                });
            },

            error: failedArticleLoad
        });
    }

    function updateRank(data) {
//Update rank counter and image
        var rank = data.rank;

        var img = new Image();
        img.src = rank_static_db_json[rank - 1].rank_img_path;
        img.onload = function () {
            $('#rank-img-placeholder').attr("src", img.src);
        };

        $('.rank-text.placeholder').text(" " + rank_static_db_json[rank - 1].rank_name).css('color', '#273B76');
        $('.headline-text.rank-numeral.placeholder').text(rank_static_db_json[rank - 1].rank_numeral).css('color', '#273B76');
        if (rank < 13) {
            $('.next-rank.placeholder').text(" " + rank_static_db_json[rank].rank_name).css('color', '#5BA1D2');
        } else {
            $('.secondary-rank').hide();
        }

    }

//Counter function (JS-Fiddle credit: Dhiraj Bodicherla - https://jsfiddle.net/dhirajbodicherla/wmaftobx/13/)

    function startCounter() {
        $('.counter').each(function (index) {
            var size = $(this).text().split(".")[1] ? $(this).text().split(".")[1].length : 0;
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 1500,
                easing: 'linear',
                step: function (now) {
                    $(this).text(parseFloat(now).toFixed(size));
                }
            });
        });
    }
