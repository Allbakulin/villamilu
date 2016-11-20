var siteLoaded = false;
var QueryString = function () {
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
	    var pair = vars[i].split("=");
	        // If first entry with this name
	    if (typeof query_string[pair[0]] === "undefined") {
	      query_string[pair[0]] = decodeURIComponent(pair[1]);
	        // If second entry with this name
	    } else if (typeof query_string[pair[0]] === "string") {
	      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
	      query_string[pair[0]] = arr;
	        // If third or later entry with this name
	    } else {
	      query_string[pair[0]].push(decodeURIComponent(pair[1]));
	    }
	  } 
	  return query_string;
	}();
function startPreloader(){
	jQuery("#preloader_overlay").addClass("animated");
	var itp = [];
	jQuery("*").filter(function(){
		var b = jQuery(this).css("background-image");
		if(b!="none"){
			itp.push(b.replace("url(","").replace(")","").
					replace('"',"").replace('"',"").
					replace("'","").replace("'",""));
		}
	});
	jQuery("img").filter(function(){
		itp.push(jQuery(this).attr("src"));
	});
	
	var n = itp.length;
	var prc = 0;
	var step = 100/n;
	for(var i=0; i<n; i++){
		var img = new Image;
		img.onload = function(){
			prc = prc + step;
			if(i==(n-1))prc=100;
			jQuery("#preloader_counter").text(parseInt(prc));
			if(Math.round(prc)==100)endLoadSite();
		}
		img.onerror = function(){
			prc = prc + step;
			if(i==(n-1))prc=100;
			jQuery("#preloader_counter").text(parseInt(prc));
			if(Math.round(prc)==100)endLoadSite();
		}
		img.src=itp[i];
	}
}
function endLoadSite(){
	if(siteLoaded==true){
		jQuery("#preloader_overlay").removeClass("animated");
		jQuery("body").animate({"top":0},310,function(){jQuery("#preloader_box").addClass("animated");});
		jQuery(".transition_blur, .transition_sx, .transition_dx, .transition_bg, .transition_box").addClass("opened");
		if(typeof QueryString.sc == "string"){
			setTimeout(function(){
				jQuery(window).scrollTo("#"+QueryString.sc,1400,{easing:"easeInOutExpo", offset: -1*jQuery("#sp1").height()});
			},400);
		}
	}
}
function load360(img, container){
	var div = document.getElementById(container);
	var PSV = new PhotoSphereViewer({
	    panorama: img,
	    container: div,
	    time_anim: 1,
	    anim_speed: "0.5rpm",
	    default_position:{long: Math.PI*1.4, lat: 0},
	    //reverse_anim: false,
	    navbar: false,
	    allow_scroll_to_zoom: false
	});
}
function elementInViewport2(el) {
	if(typeof el == "string") el = document.getElementById(el);
	var top = el.offsetTop+60;
	var left = el.offsetLeft;
	var width = el.offsetWidth;
	var height = el.offsetHeight;
	
	while(el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop+60;
		left += el.offsetLeft;
	}
	
	return (
		top < (window.pageYOffset + window.innerHeight) &&
		left < (window.pageXOffset + window.innerWidth) &&
		(top + height) > window.pageYOffset &&
		(left + width) > window.pageXOffset
	);
}
function isScrolledIntoView(id) {
	/*
	if(typeof id == "string"){
		var el = document.getElementById(id);
	}else{
		var el = id;
	}
	*/
	var el = document.getElementById(id);
	if(jQuery("#"+id).length > 0){
		var elemTop = el.getBoundingClientRect().top;
		var elemBottom = el.getBoundingClientRect().bottom;
		var isVisible = (elemTop >= 0) && ((elemBottom-200) <= window.innerHeight);
		return isVisible;
	}else{
		//console.log(id+" not found.");
	}
}
function closePreloader(){
	jQuery("#sp1,#sp2,#sp3,#sp4").addClass("closed");
}
function openPreloader(){
	jQuery("#sp1,#sp2,#sp3,#sp4").removeClass("closed");
}
function showElements(){
	if(isScrolledIntoView("first_block")){
		jQuery("#main_contents").addClass("main_contents_animated");
	}
	if(isScrolledIntoView("start_animation_block")){
		jQuery("#main_contents .first_block").addClass("block_animated");
		jQuery("#main_contents .second_block").addClass("block_animated");
		jQuery("#main_contents .third_block").addClass("block_animated");
		jQuery("#main_contents .frame").addClass("frame_animated");
		jQuery("#main_contents .main_contents_right").addClass("main_contents_right_animated");
	}
	if(isScrolledIntoView("garden_contents_1")){
		jQuery("#garden").addClass("main_contents_animated");
	}
	if(isScrolledIntoView("start_animation_block_garden")){
		jQuery("#garden .first_block").addClass("block_animated");
		jQuery("#garden .second_block").addClass("block_animated");
		jQuery("#garden .frame").addClass("frame_animated");
		jQuery("#garden .main_contents_right").addClass("main_contents_right_animated");
	}
	/*
	if(isScrolledIntoView("footer_starter")){
		jQuery(".footer_svg").addClass("frame_animated");
	}
	*/
	if(isScrolledIntoView("credits_starter")){
		jQuery(".credits").addClass("animated");
		jQuery(".footer_text").addClass("animated");
	}else{
		jQuery(".credits").removeClass("animated");
	}
	if(isScrolledIntoView("la_spa")){
		jQuery(".outdoor_left").addClass("outdoor_animated");
	}
	if(isScrolledIntoView("la_piscina")){
		jQuery(".outdoor_right").addClass("outdoor_animated");
	}
}
function adapt_size(id_ref, id_sub){
	jQuery("#"+id_sub).height(jQuery("#"+id_ref).height());
}
function sleep(miliseconds) {
	var currentTime = new Date().getTime();
	while (currentTime + miliseconds >= new Date().getTime()) {}
}
jQuery(window).load(function(){
	siteLoaded = true;
	endLoadSite();
	if(jQuery("#st_logo_home").length==0){
		jQuery(".menu_bar_logo_box img").addClass("animated");
	}else{
		jQuery(".menu_bar_logo_box img").addClass("noanimated");
	}
});
jQuery(window).bind('beforeunload', function(e){
	jQuery(".transition_blur, .transition_sx, .transition_dx, .transition_bg, .transition_box").removeClass("opened");
	jQuery(".transition_bg").animate({"background-color":"#ffffff"},4000);
});
jQuery(window).scroll(function(e){
	showElements();
	if(jQuery("#st_logo_home").length>0){
		if(isScrolledIntoView("st_logo_home")){
			jQuery(".menu_bar_logo_box img").removeClass("animated");
		}else{
			jQuery(".menu_bar_logo_box img").addClass("animated");
		}
	}
});
jQuery(window).resize(function(){
	//adapt_size("main_contents_1", "frame_box_1");
	//adapt_size("garden_contents_1", "garden_box_1");
});
function closeAllPanels(callback, time){
	jQuery("#open_language").removeClass("animated");
	jQuery("#open_menu").removeClass("animated");
	jQuery("#open_booking").removeClass("animated");
	jQuery(".navigation_box .nav.menu, .navigation_box .photomenu").stop().animate({opacity:0},300,function(){
		jQuery(".navigation_box").removeClass("navigation_box_opened");
		jQuery(".photomenu a").removeClass('lnk_animated');
		jQuery(".nav.menu li").removeClass('lnk_animated');
		jQuery(".navigation_box .nav.menu, .navigation_box .photomenu").delay(300).animate({opacity:1},300);
	});
	jQuery(".language_list").stop().animate({opacity:0},300,function(){
		jQuery(".language_box").removeClass("language_box_opened");
		jQuery(".language_list li").removeClass("animated");
		jQuery(".language_list").delay(300).animate({"opacity":1},300);
	});
	jQuery(".booking_block").stop().animate({opacity:0},300,function(){
		jQuery(".booking_box").removeClass("booking_box_opened");
		jQuery(".booking_block h1").removeClass("animated");
		jQuery(".booking_block p").removeClass("animated");
		jQuery(".booking_block .octobook").removeClass("animated");
		jQuery(".booking_block").delay(300).animate({"opacity":1},300);
	});
	
	if(typeof callback == "function"){
		if(typeof time == "undefined")time=700;
		jQuery("body").animate({left:0},time,callback);
	}
}
function openLanguage(){
	jQuery("#open_language").addClass("animated");
	jQuery(".language_box").addClass("language_box_opened");
	var time = 0;
	jQuery(".language_list li").each(function(){
		var obj = jQuery(this);
		setTimeout(function(){obj.addClass("animated")},time);
		time += 150;
	});
}
function openBooking(){
	jQuery("#open_booking").addClass("animated");
	jQuery(".booking_block h1").addClass("animated");
	jQuery(".booking_block p").addClass("animated");
	jQuery(".booking_block .octobook").addClass("animated");
	jQuery(".booking_box").addClass("booking_box_opened");
}
function openMenu(){
	jQuery("#open_menu").addClass("animated");
	jQuery(".navigation_box").addClass("navigation_box_opened");
	var time = 200;
	jQuery(".photomenu a").each(function(){
		var lnk = jQuery(this);
		setTimeout(function(){lnk.addClass('lnk_animated')},time);
		time+=200;
	});
	var time = 100;
	jQuery(".nav.menu li").each(function(){
		var lnk = jQuery(this);
		setTimeout(function(){lnk.addClass('lnk_animated')},time);
		time+=200;
	});
}
jQuery(document).ready(function(){
	//adapt_size("main_contents_1", "frame_box_1");
	jQuery(".continue_arrow").bind("click",function(){
		jQuery(window).scrollTo("#screen1",1400,{easing:"easeInOutExpo", offset: -1*jQuery("#sp1").height()});
	});
	jQuery("#open_language").bind("click",function(){
		if(jQuery(".language_box").hasClass("language_box_opened")){
			closeAllPanels();
		}else{
			if(
				jQuery(".language_box").hasClass("language_box_opened") ||
				jQuery(".navigation_box").hasClass("navigation_box_opened") ||
				jQuery(".booking_box").hasClass("booking_box_opened")
			){
				closeAllPanels(openLanguage);
			}else{
				openLanguage();
			}
		}
	});
	jQuery("#open_menu").bind("click",function(){
		if(jQuery(".navigation_box").hasClass("navigation_box_opened")){
			closeAllPanels();
		}else{
			if(
				jQuery(".language_box").hasClass("language_box_opened") ||
				jQuery(".navigation_box").hasClass("navigation_box_opened") ||
				jQuery(".booking_box").hasClass("booking_box_opened")
			){
				closeAllPanels(openMenu);
			}else{
				openMenu();
			}
		}
	});
	jQuery("#open_booking").bind("click",function(){
		if(jQuery(".booking_box").hasClass("booking_box_opened")){
			closeAllPanels();
		}else{
			if(
				jQuery(".language_box").hasClass("language_box_opened") ||
				jQuery(".navigation_box").hasClass("navigation_box_opened") ||
				jQuery(".booking_box").hasClass("booking_box_opened")
			){
				closeAllPanels(openBooking);
			}else{
				openBooking();
			}
		}
	});
	jQuery('body').bind("keydown", function(e){
	    if(e.which == 27) closeAllPanels();
	});
});

