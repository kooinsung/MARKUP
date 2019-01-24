if (typeof dimattoUI !== 'object') {
    var dimattoUI = {};
}

dimattoUI = (function() {
	'use strict';
	var dimattoUI = {
			main: {
				init: function() {
					var h = $(window).height() - 88,  outer = $('.dmt-main'), ele = $('.dmt-mainRecommend');
					$('.dmt-main, .dmt-mainRecommend').css({'height':h});
					
					$('.dmt-scroll').nanoScroller();

					var keyVisual = $('#dmt-keyVisual');
					keyVisual.owlCarousel({items:1, loop:true, lazyLoad:true, autoplay:true, smartSpeed:700, autoplayTimeout:3000, autoplayHoverPause:true});
					keyVisual.on('mousewheel', '.owl-stage', function (e) {
						if (e.deltaY>0) {
								keyVisual.trigger('prev.owl');
						} else {
								keyVisual.trigger('next.owl');
						}
						e.preventDefault();
					});

					$('.dmt-prdItem').mouseenter(function(){
						$(this).find('.dmt-prdInfo').stop().fadeIn('fast');
					}).mouseleave(function(){
						$(this).find('.dmt-prdInfo').stop().fadeOut('fast');
					});
				}
 
			},
			common: {
				init: function() {
					$('.dmt-checker').addClass("hidden").viewportChecker({
						classToAdd: 'visible animated fadeInDown',
						offset: 100
					});

					$(window).scroll(function(){
						if($(this).scrollTop() > 88) {
								$(".dmt-header").addClass('fixed');
						} else {
							$(".dmt-header").removeClass('fixed');
						}
					});
				}
			},
			lookbooks: {
				init: function() {
					$('.dmt-lookbook').owlCarousel({navRewind:false, items:1, loop:false, nav:true, smartSpeed:1000})
				}
			},
			details: {
				init: function() {


					$(".dmt-detailViews .owl-carousel").owlCarousel({items: 1});

					$('.dmt-detailViews .owl-dot').each(function(i) {
						 i = i + 1
						$( this ).addClass( 'dotnumber' + i);
						$( this ).attr('data-info', i);
						i=i+1;
					});

					$('.dmt-detailViews .owl-item').not('.cloned').each(function(i) {
						 i = i + 1
						$( this ).addClass( 'slidenumber' + i);
						i=i+1;
					});
					$('.dmt-detailViews .owl-dot').each(function(i) {
						i = i + 1
						var grab = $(this).data('info');
						var slidegrab = $('.slidenumber'+ i +' img').attr('src');
						$(this).css("background-image", "url("+slidegrab+")");  
					});

					var wh = $(window).height() - 88;
					var totalh = wh - 65;

					var imgw = $('.dmt-detailViews img').width();
					var imgh = $('.dmt-detailViews img').height();
					//console.log(imgw + "/" + imgh);

					$('.dmt-detailViews img').css({'height':totalh, 'width':'auto'});


					imgw = $('.dmt-detailViews img').width();
					imgh = $('.dmt-detailViews img').height();

					$('.dmt-detailViews .owl-stage-outer').css({'width':imgw});
					$('.dmt-detailViews .dmt-prdsTit').css({'left':imgw + 90});

					$('.dmt-detailViews .owl-carousel .owl-dot').css({'width':imgw/3, 'height':imgh/3});
					$('.dmt-detailViews .owl-carousel .owl-dot.active').css({'width':imgw/3, 'height':imgh/3});
					$('.dmt-detailViews .owl-carousel .owl-dot img').css({'width':imgw/3, 'height':imgh/3});

					$('.dmt-detailViews .owl-dots').css({'width':$('.dmt-detailViews .owl-carousel .owl-dot').outerWidth() * 2.3, 'left':imgw + 60});

					$('.dmt-detailViews').css({'width':$('.dmt-detailViews .owl-stage-outer').width() + $('.dmt-detailViews .owl-dots').width() + 30});

				}
			},
			now: {
				init: function() {
					var $dmtGrid = $('.dmt-grid').imagesLoaded( function() {
					  $dmtGrid.masonry({
						itemSelector: '.dmt-gridItem',
						columnWidth: 200,
						gutter: 16
					  });
					});

					$('.dmt-gridItem').mouseenter(function(){
						$(this).addClass('active');
					}).mouseleave(function(){
						$(this).removeClass('active');
					});

				}
			}
		};

    return dimattoUI;
}());

$(function(){
	dimattoUI.common.init();
});