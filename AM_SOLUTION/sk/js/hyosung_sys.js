if (typeof hyosungUI !== 'object') {
    var hyosungUI = {};
}

hyosungUI = (function() {
	'use strict';

	var hyosungUI = {
			common: {
				init: function() {
					
					if($('body').hasClass('rwd')){
						//모바일 메뉴
						$('.rwd .header .row3, .rwd .header .row3 .gnb').css('height',$(window).height());
						$(window).resize(function(){
							$('.rwd .header .row3, .rwd .header .row3 .gnb').css('height',$(window).height());
						});

						$('.btnMobToggle').click(function(){
							var bg = $('<div class="lnbDim" style="width:100%;height:100%;position:fixed;top:0px;left:0px;z-index:10;opacity: 0.5;background:#000;"></div>');
							$(bg).appendTo('body').fadeIn('fast');
							$('.rwd .header .row3').animate({ left: 0 }, "fast");
						});

						$('.depth1').on('click',function(e) {
							if($(this).next('div').length > 0){
								e.preventDefault();
								var subNav = $(this).next('div');
								if (subNav.is(':visible')){
									 subNav.slideUp('fast')
									 $(this).removeClass('active'); 
								}else{
									 $('.gnbDepths').slideUp('fast');
									 subNav.slideDown('fast');
									 $('.depth1').removeClass('active');
									 $(this).addClass('active');
								}
						   };
						});

						$('.btnMobClose').click(function(){
							$('.rwd .header .row3').animate({ left: "-290px" }, "fast");
							$('.lnbDim').remove();

						});
					}else{
						//웹 메뉴
						var menuNum = $('.row2 .gnb > ul > li').length;
						var menuW = 100 / menuNum;
						$('.row2 .gnb > ul > li').css('width', menuW + "%");
						/*
						$('.depth1').on("mouseenter",function() {
							var bg = $('<div class="menuDim" ></div>');
							$('.gnbDepths').hide();
							$(this).next().slideDown('fast');
							$('.depth1').removeClass('active');
							$(this).addClass('active');
							$('.menuDim').remove();
							$(bg).appendTo('body').fadeIn('fast');
						});

						$('.depth2').on("mouseenter",function() {
							$('.depth2').removeClass('active');
							$(this).addClass('active');
						});

						$('.depth2List a').on("mouseenter",function() {
							$('.depth2List a').removeClass('active');
							$(this).addClass('active');
							$(this).parent().parent().parent().find('.depth2').addClass('active');
						}).mouseleave(function(){
							$('.depth2List a').removeClass('active');
							$('.depth2').removeClass('active');
						});

						$('.header, .gnbDepths').on("mouseleave",function() {
							$('.gnbDepths').hide();
							$('.depth1').removeClass('active');
							$('.menuDim').remove();
						});
						*/
					}


					//컨텐츠 높이 고정
					var wh = $(window).height(), fh = $('.footer').outerHeight(), hh = $('.header').height();
					var minH = wh - 253;
					$('.container').css('min-height',minH);
					$(window).resize(function(){
						var wh = $(window).height(), fh = $('.footer').outerHeight(), hh = $('.header').height();
						var minH = wh - 253;
						$('.container').css('min-height',minH);
					});
					
					//설비 레이어
					$('.lineCol .items li .dot').mouseenter(function(){
						$(this).next().fadeIn();
					}).mouseleave(function(){
						$(this).next().fadeOut();
					});
				}
			},
			layer: {
				open: function(modalID) {
					var layer = "#" + modalID;
					var bg = $('<div class="dim" ></div>');
					var popupMarginTop = $(layer).height() / 2;
					var popupMarginLeft = $(layer).width() / 2;

					$(layer).css({
						'left': '50%',
						'top': '50%',
						'margin-top': -popupMarginTop,
						'margin-left': -popupMarginLeft
					}).fadeIn('fast');

					$(bg).appendTo('body').fadeIn('fast');
					$(window).resize(function(){
						$(layer).css({
							'left': '50%',
							'top': '50%',
							'margin-top': -popupMarginTop,
							'margin-left': -popupMarginLeft
						});
					});
				},
				close: function(modalID) {
					$('#' + modalID).hide();
					$('.dim').remove();
				}
			}
    };

    return hyosungUI;
}());

$(function(){
	hyosungUI.common.init();
});