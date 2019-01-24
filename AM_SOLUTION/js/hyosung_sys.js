if (typeof hyosungUI !== 'object') {
    var hyosungUI = {};
}

hyosungUI = (function() {
	'use strict';

	var hyosungUI = {
			common: {
				init: function() {
					//메뉴 초기화
					resetMenu();

					var menuNum = $('.row2 .gnb > ul > li').length;
					if(menuNum == "6"){
						$('.row2 .gnb > ul > li').css('width','16.66%');
					}else if(menuNum == "7"){
						$('.row2 .gnb > ul > li').css('width','14.28%');
					}

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

					$('.row3 .depth1').on('click',function(e) {
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

					//웹 메뉴
					
					$('.row2 .depth1').on("mouseenter",function() {
						var bg = $('<div class="menuDim" ></div>');
						$('.row2 .gnbDepths').hide();
						$(this).next().slideDown('fast');
						$('.row2 .depth1').removeClass('active');
						$(this).addClass('active');
						$('.menuDim').remove();
						$(bg).appendTo('body').fadeIn('fast');
					});

					$('.row2 .depth2').on("mouseenter",function() {
						$('.row2 .depth2').removeClass('active');
						$(this).addClass('active');
					});

					$('.row2 .depth2List a').on("mouseenter",function() {
						$('.row2 .depth2List a').removeClass('active');
						$(this).addClass('active');
						$(this).parent().parent().parent().find('.depth2').addClass('active');
					}).mouseleave(function(){
						$('.row2 .depth2List a').removeClass('active');
						$('.row2 .depth2').removeClass('active');
					});

					$('.header, .row2 .gnbDepths').on("mouseleave",function() {
						$('.row2 .gnbDepths').hide();
						$('.row2 .depth1').removeClass('active');
						$('.menuDim').remove();
					});

					function resetMenu(){
						$('.row2 .gnbDepths').hide();
						$('.row2 .depth1').removeClass('active');
						$('.menuDim').remove();
					}

					//트리메뉴
					$('.trees li.has-sub > strong > a.arrow').on('click', function(e){
						e.preventDefault();
							var element = $(this).parent().parent('li');
							if (element.hasClass('open')) {
								element.removeClass('open');
								element.find('li').removeClass('open');
								element.find('ul').hide();
							}
							else {
								element.addClass('open');
								element.children('ul').show();
								element.siblings('li').children('ul').hide();
								element.siblings('li').removeClass('open');
								element.siblings('li').find('li').removeClass('open');
								element.siblings('li').find('ul').hide();
							}
							return false;
						});


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
					$('.lineCol .items li .dot, .main .row3 .items li .dot').mouseenter(function(){
						$(this).next().fadeIn();
					}).mouseleave(function(){
						$(this).next().fadeOut();
					});

					//토글
					$('.toggles > ul > li > a').on('click',function(e) {
						if($(this).next('div').length > 0){
							e.preventDefault();
							var subNav = $(this).next('div');
							if (subNav.is(':visible')){
								 subNav.slideUp('fast')
								 $(this).removeClass('active'); 
							}else{
								 $('.toggles .inner').slideUp('fast');
								 subNav.slideDown('fast');
								 $('.toggles > ul > li > a').removeClass('active');
								 $(this).addClass('active');
							}
					   };
					});

					//작업 스코프 선택
					$('#btnScopeSel').on('click',function() {
						$('.scope_sels').show();
						return false;
					});
					$('.scope_sels > ul > li > a').on('click',function(e) {
						if($(this).next('div').length > 0){
							e.preventDefault();
							var subNav = $(this).next('div');
							if (subNav.is(':visible')){
								 subNav.hide();
								 $(this).removeClass('active'); 
							}else{
								 $('.scope_sels_in').hide();
								 subNav.show();
								 $('.scope_sels > ul > li > a').removeClass('active');
								 $(this).addClass('active');
							}
					   };
					});

				}
			},
			layer: {
				open: function(modalID) {
					var layer = "#" + modalID;
					var bg = $('<div class="dim" ></div>');

					$(layer).css({
						'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
						'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
					}).fadeIn('fast');

					$(bg).appendTo('body').fadeIn('fast');
					$(window).resize(function(){
						var layer = "#" + modalID;
						$(layer).css({
							'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
							'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
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