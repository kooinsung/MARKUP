if (typeof UI !== 'object') {
    var UI = {};
}

UI = (function() {
	'use strict';

	var UI = {
			common: {
				init: function() {
					var currentOS;
					var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));
					if(mobile) {
						var userAgent = navigator.userAgent.toLowerCase();
						if(userAgent.search("android") > -1) {
							currentOS = "android";
						} else if((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) {
							currentOS = "ios";
						} else {
							currentOS = "";
						}
					} else {
						currentOS = "web";
					}
					$('html').addClass(currentOS);

					//가로세로 체크
					$(window).on("orientationchange load", function () {
					   if (orientation == 0 || orientation == 180 ) {  
						alert ('세로모드는 지원하지 않습니다.');  
						$('.wrap').hide();
					   }  
					   else if (orientation == 90 || orientation == -90 ) {  
						 $('.wrap').show();
					   }  
					});
				}
			},
			layer: {
				open: function(popID) {
					var target = "#" + popID;
					$(target).fadeIn();
				},
				close:function(popID){
					$('#' + popID).fadeOut();
				}
 
			}
    };

    return UI;
}());

$(function(){
	UI.common.init();
});