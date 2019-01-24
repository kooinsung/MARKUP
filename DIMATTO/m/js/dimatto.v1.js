if (typeof dimattoUI !== 'object') {
    var dimattoUI = {};
}

dimattoUI = (function() {
	'use strict';

	var dimattoUI = {
			main: {
				init: function() {
					$('#dmt-keyVisual').owlCarousel({loop:true,  items:1, autoplay:true, smartSpeed:700, autoplayTimeout:3000, autoplayHoverPause:true});
				}
 
			},
			common: {
				init: function() {
					$(window).on("scroll", function () {
						var scroll = $(window).scrollTop();
						if (scroll > $(window).height()) $('.dmt-topMove').fadeIn();
						else $('.dmt-topMove').fadeOut();
					});

					$('.dmt-topMove button').click(function(){
						$("html, body").animate({ scrollTop: 0 }, "fast");
					});

					$('.dmt-checker').addClass("dmt-hidden").viewportChecker({
						classToAdd: 'dmt-visible animated fadeIn',
						offset: 100
					});

					$('.dmt-menuToggle').on("click", function () {
						var h = $(window).height();
						$('body').addClass('dmt-opened');
						$('.dmt-menus').addClass('dmt-openMenu').css({'height':h});
						$('.dmt-menusIn').css({'height':h});
						$('<div class="dmt-menuDim" ></div>').appendTo('body').fadeIn('fast');
						$('.dmt-menuDim').on('touchmove', function(e){e.preventDefault()});
					});
					$('.dmt-menuClose').on("click", function () {
						var h = $(window).height();
						$('body').removeClass('dmt-opened').css({'height':'auto'});
						$('.dmt-menus').removeClass('dmt-openMenu').css({'height':'auto'});
						$('.dmt-menusIn').css({'height':'auto'});
						$('.dmt-menuDim').remove();
						$('.dmt-menuDim').off('touchmove');
					});
				}
			},
			collection: {
				init: function() {
					$('#dmt-lookbook').owlCarousel({navRewind:false, items:1, loop:false, nav:true});
				}
			},
			details: {
				init: function() {
					$('.dmt-prdsPics').owlCarousel({navRewind:false, items:1})
				}
			},
			sns: {
				init: function() {
					$('.dmt-snsToggle').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$(this).next().slideUp('fast');
							$(this).data("show","yes");
						}else{
							$(this).next().slideDown('fast');
							$(this).data("show","no");
						}
					});
				}
			},
			now: {
				init: function() {
					var $dmtGrid = $('.dmt-grid').imagesLoaded( function() {
					  $dmtGrid.masonry({
						itemSelector: '.dmt-gridItem',
						percentPosition: true
					  });
					});

/*
					$('.dmt-gridItem').mouseenter(function(){
						$(this).addClass('active');
					}).mouseleave(function(){
						$(this).removeClass('active');
					});
*/
				}
			},
			layer: {
				open: function(popID) {
					var target = "#" + popID;
					var dim = $('<div class="dmt-dim" ></div>');

					$(target).css({
						'top':Math.max(0, (($(window).height() - $(target).height()) / 2) +  $(window).scrollTop()) + "px",
						'left':Math.max(0, (($(window).width() - $(target).width()) / 2) +  $(window).scrollLeft()) + "px"
					}).addClass('open');

					$(window).resize(function(){
						$(target).css({
							'top':Math.max(0, (($(window).height() - $(target).height()) / 2) +  $(window).scrollTop()) + "px",
							'left':Math.max(0, (($(window).width() - $(target).width()) / 2) +  $(window).scrollLeft()) + "px"
						});
					});

					$(dim).appendTo('body').fadeIn('fast');
					$('body').on('touchmove', function(e){e.preventDefault()});
				},
				close:function(popID){
					$('#' + popID).removeClass('open');
					$('.dmt-dim').remove();
					$('body').off('touchmove');
				}
 
			}
    };

    return dimattoUI;
}());

$(function(){
	dimattoUI.common.init();
});