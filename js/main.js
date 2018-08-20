/*--------------------------------------------------
# main.js file for Launcher template.
# Author: Galacticlab
--------------------------------------------------*/

$(function($) {

    // For Scroll to top
    $(window).on("scroll resize", function() {
        if ($(window).scrollTop() >= 200) {
            $(".scroll-top").css("bottom", "15px");
        }
        if ($(window).scrollTop() < 200) {
            $(".scroll-top").css("bottom", "-52px");
        }
    });
    $(".scroll-top").on("click", function() {
        return $("html, body").animate({
            scrollTop: 0
        });
    });
    // END For Scroll to top

    // Disable Mouse Right-Click
        // var message = "NoRightClicking";

        // function defeatIE() { if (document.all) {
        //         (message); return false; } }

        // function defeatNS(e) {
        //     if (document.layers || (document.getElementById && !document.all)) {
        //         if (e.which == 2 || e.which == 3) {
        //             (message); return false; }
        //     }
        // }
        // if (document.layers) {
        //     document.captureEvents(Event.MOUSEDOWN);
        //     document.onmousedown = defeatNS;
        // } else {
        //     document.onmouseup = defeatNS;
        //     document.oncontextmenu = defeatIE;
        // }
        // document.oncontextmenu = new Function("return false")

    // END Disable Mouse Right-Click

    // Disable Mouse Scroll Zoom
     //    $(window).keydown(function(event) 
    	// {
    	//     if((event.keyCode == 107 && event.ctrlKey == true) || (event.keyCode == 109 && event.ctrlKey == true))
    	//     {
    	//         event.preventDefault(); 
    	//     }

    	//     $(window).bind('mousewheel DOMMouseScroll', function(event) 
    	//     {
    	//         if(event.ctrlKey == true)
    	//         {
    	//             event.preventDefault(); 
    	//         }
    	//     });
    	// });
	// Disable Mouse Scroll Zoom

});
