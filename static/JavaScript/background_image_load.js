$(document).ready(function(){
    var image_num = Math.floor((Math.random() * 7) + 1);
    var background = new Image();
    background.src = "/static/Media/Photographs/Backgrounds/" + image_num + ".jpg";
    $(".under-construction-background").hide();
    $(background).on('load', function() {
        $(".under-construction-background").css({"background-image" : "url(" + $(this).attr("src") + ")",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "background-size": "cover"}).fadeIn(3000)

    });
});
