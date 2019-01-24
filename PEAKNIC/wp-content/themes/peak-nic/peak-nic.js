if (typeof peaknicUI !== 'object') {
    var peaknicUI = {};
}

peaknicUI = (function() {
	'use strict';
	var peaknicUI = {
			userAgentCheck: {
				init: function() {

					//기기체크
					var currentOS;
					var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));
					if (mobile) {
						/*
						var userAgent = navigator.userAgent.toLowerCase();
						if(userAgent.search("android") > -1){
							currentOS = "android";
						}else if((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)){
							currentOS = "ios";
						}else{
							currentOS = "";
						}
						*/
						currentOS = "mweb";
						
					} else {
						// 모바일이 아닐 때
						currentOS = "web";
					}
					$('html').addClass(currentOS);
				}
			},
			project: {
				init: function() {
					var $projectLists = $(".project_lists"), $projectviews = $(".project_views"), w = $(window).width();
					$('.project_views img').removeAttr('width').removeAttr('height');
					$('.project_views, .project_views img').css('height',$(window).height() - ($('.header').height() + $('.footer').height()));
					$projectLists.mCustomScrollbar({
						axis:"x",
								autoHideScrollbar:true,
						advanced:{autoExpandHorizontalScroll:true},
						mouseWheel:{
							enable:true,
							scrollAmount: 600 
						}
					});

					$projectviews.mCustomScrollbar({
						axis:"x",
								autoHideScrollbar:true,
						advanced:{autoExpandHorizontalScroll:true},
						mouseWheel:{
							enable:true,
							scrollAmount: 300 
						}
					});

					$(window).on("orientationchange load resize", function () {
						var $projectLists = $(".project_lists"), $projectviews = $(".project_views"), w = $(window).width();

						if(w < 750){
							$('.project_views, .project_views img').css('height','auto');
							$projectLists.mCustomScrollbar("destroy");
							$projectviews.mCustomScrollbar("destroy");
							$("body").mCustomScrollbar({
								contentTouchScroll:10,
								mouseWheel:{
									enable:true
								}
							});

						}else{
							$('.project_views, .project_views img').css('height',$(window).height() - ($('.header').height() + $('.footer').height()));
							$projectLists.mCustomScrollbar({
								axis:"x",
								autoHideScrollbar:true,
								advanced:{autoExpandHorizontalScroll:true},
								mouseWheel:{
									enable:true,
									scrollAmount: 600 
								},
								callbacks:{
									whileScrolling:function(){

									}
								}
							});

							$projectviews.mCustomScrollbar({
								axis:"x",
								autoHideScrollbar:true,
								advanced:{autoExpandHorizontalScroll:true},
								mouseWheel:{
									enable:true,
									scrollAmount: 300 
								}
							});
						}
					});
				}
			},
			common: {
				init: function() {
					/*
					$(document).scroll(function() {
						console.log("a");
					  if ($(this).scrollTop() > $(window).height()) {
						$('.top_move').fadeIn();
					  } else {
						$('.top_move').fadeOut();
					  }
					});
					*/
					$('.top_move').on('click', function(){
					 	 $("html, body").animate({ scrollTop: 0 }, "fast");
						$('body').mCustomScrollbar("scrollTo",0);
					  return false;
					});
					$('.btn_menu').on('click', function(){
						$('.menus').addClass('show-overlay');
						$('.menu-menu-container li, .menus .sns').addClass('active');
						return false;
					});
					$('.menus .close').on('click', function(){
						$('.menus').removeClass('show-overlay');
						$('.menu-menu-container li, .menus .sns').removeClass('active');
					});

					$('.bt_mbs').click(function(){
						var w = 480,	h = 800, l = (screen.availWidth - w) / 2, t       = (screen.availHeight - h) / 2, popPage = '.popup';
						window.open(this.href,"window","width= "+ w + ",height=" + h + ",left=" + l + ",top=" + t + ", scrollbars = yes, location = no, toolbar = no, menubar = no, status = no");
						return false;
					});


				}
			},
			about: {
				init: function() {
					$("body").mCustomScrollbar({
						contentTouchScroll:10,
						mouseWheel:{
							enable:true
						}
					});
					$('#fullpage').fullpage({
						loopHorizontal: false,
						autoScrolling: false,
						css3: true,
						fitToSection: false,
						afterLoad: function(anchorLink, index){
							$('.custom_bts a.next').show();
							$('.custom_bts a.prev').hide();
						},
						afterSlideLoad: function( anchorLink, index, slideAnchor, slideIndex){
							if(slideIndex == 0){
								$('.custom_bts a.next').show();
								$('.custom_bts a.prev').hide();
							}else if(slideIndex == 2){
								$('.custom_bts a.next').hide();
								$('.custom_bts a.prev').show();
							}
						},
						onSlideLeave: function( anchorLink, index, slideIndex, direction, nextSlideIndex){
						}
					});
					//$('.about-us .about_section').css('min-height',$(window).height());

					//$('.about-us').mCustomScrollbar();

					$('.steps').mCustomScrollbar({
						axis:"x",
								autoHideScrollbar:true,
						advanced:{autoExpandHorizontalScroll:true},
						mouseWheel:{
							enable:true
						}
					});

					  $('#fullpage').mousewheel(function(event, delta, deltaX, deltaY) {
						if (delta > 0) {
						  $.fn.fullpage.moveSlideLeft();
						}
						if (deltaY < 0){
						 $.fn.fullpage.moveSlideRight();
						}
						//event.stopPropagation();
						//event.preventDefault();
					  });

					  $('.custom_bts a.next').on("click", function () {
						 $.fn.fullpage.moveSlideRight();
						 return false;
					  });
					  $('.custom_bts a.prev').on("click", function () {
						$.fn.fullpage.moveSlideLeft();
						 return false;
					  });

					$(window).on("orientationchange load resize", function () {
						var w = $(window).width();
						if(w < 750){
							$.fn.fullpage.destroy('all');
							$('.steps').mCustomScrollbar("destroy");
							//$('.about-us .about_section').css('min-height',$(window).height());
						}else{
							$('#fullpage').fullpage({
								loopHorizontal: false,
								autoScrolling: false,
								css3: true,
								fitToSection: false
							});

							$('.steps').mCustomScrollbar({
								axis:"x",
										autoHideScrollbar:true,
								advanced:{autoExpandHorizontalScroll:true},
								mouseWheel:{
									enable:true
								}
							});
						}
						$("body").mCustomScrollbar({
							contentTouchScroll:10,
							mouseWheel:{
								enable:true
							}
						});
					});

				}
			},
			contact: {
				init: function() {
					//$('.contact_section').css('height',$(window).height() - $('.header').height());
					$('.maps').css('min-height','300px');
					$('.maps').css('height',$(window).height() - $('.contact_row1').height());
					$(window).on("orientationchange load resize", function () {
						var w = $(window).width();
							$('.maps').css('min-height','300px');
					$('.maps').css('height',$(window).height() - $('.contact_row1').height());
						if(w < 750){
							$('.contact_section').css('height','auto');
						}else{
							//$('.contact_section').css('height',$(window).height() - $('.header').height());
						}
					});

				}
			}
    };

    return peaknicUI;
}());

$(function(){
	peaknicUI.userAgentCheck.init();
	peaknicUI.common.init();
	peaknicUI.project.init();
	if($('#about-us-pc').length > 0){
		peaknicUI.about.init();
	}
	peaknicUI.contact.init();
});

