if (typeof CONGUI !== 'object') {
    var CONGUI = {};
	var handler = function(e) { e.preventDefault();}
}

CONGUI = (function() {
	'use strict';

	var CONGUI = {
			/**
			 * 공통
			 */
			common: {
				init: function() {
					//os 분기
					var currentOS;
					var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));
					if (mobile) {
						var userAgent = navigator.userAgent.toLowerCase();
						if(userAgent.search("android") > -1){
							currentOS = "android";
						}else if((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)){
							currentOS = "ios";
						}else{
							currentOS = "";
						}
					} else {
						// 모바일이 아닐 때
						currentOS = "web";
						
					}
					$('html').addClass(currentOS);

					//textarea
					$('.textarea textarea').keydown(function(){
						$(this).parent().find('label').hide();
					});
				}
			},
			/**
			 * 모달 레이어
			 */
			layers: {
				open: function(modalID) {
					var layer = "#" + modalID;
					var bg = $('<div class="dim" ></div>'), bg_up = $('<div class="dim_up" ></div>');
					
					if($('.dim').length > 0){
						$('.dim').remove();
						$(bg_up).appendTo('body').fadeIn('fast');
						$(layer).addClass('up');
					}else{
						$(bg).appendTo('body').fadeIn('fast');
					}
					//중앙에 위치
					$(layer).css({
						'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
						'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
					}).fadeIn('fast');
				},
				close: function(modalID) {
					if($('.dim_up').length > 0){
						$('.dim_up').remove();
						$('<div class="dim" ></div>').appendTo('body').fadeIn('fast');
					}else{
						$('.dim').remove();
					}
					$('#' + modalID).removeClass('up').hide();
				}
			}
    };
    return CONGUI;
}());

$(function(){
	CONGUI.common.init();
});