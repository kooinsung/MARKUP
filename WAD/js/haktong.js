if (typeof haktongUI !== 'object') {
    var haktongUI = {};
	var handler = function(e) { e.preventDefault();}
}

haktongUI = (function() {
	'use strict';

	var haktongUI = {
			/**
			 * 공통
			 */
			common: {
				init: function() {
					//기기체크
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
					
					//스크롤하면 보이기
					$('.checker').addClass("hidden").viewportChecker({
						classToAdd: 'visible animated fadeInDown',
						offset: 100
					});
					
					//메뉴
					$('.bt_menu').on("click", function () {
						$('.lnb').addClass('show');
					});

					$('.bt_menu-close').on("click", function () {
						$('.lnb').removeClass('show');
					});					
					
					var myElement = document.getElementById('wrap');
					
					// create a simple instance
					// by default, it only adds horizontal recognizers
					var mc = new Hammer(myElement);
					
					// listen to events...
					mc.on("swipeleft", function(ev) {
					$('.lnb').addClass('show');
					});
					
					mc.on("swiperight", function(ev) {
					$('.lnb').removeClass('show');
					});

					//공지사항
				  $('.bt_nts').on('click',function(e) {
						if($(this).next().length > 0){
							e.preventDefault();
							var subNav = $(this).next();
							if (subNav.is(':visible')){
								 subNav.slideUp('fast')
								 $(this).removeClass('active'); 
							}else{
								 $('.notices .inner').slideUp('fast');
								 subNav.slideDown('fast');
								 $('.bt_nts').removeClass('active');
								 $(this).addClass('active');
							}
					   };
				  });
				}
			}
    };
    return haktongUI;
}());

$(function(){
	haktongUI.common.init();
});