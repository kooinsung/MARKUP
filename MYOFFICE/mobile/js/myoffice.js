if (typeof myofficeUI !== 'object') {
    var myofficeUI = {};
	var handler = function(e) { e.preventDefault();}
}

myofficeUI = (function() {
	'use strict';

	var myofficeUI = {
			/**
			 * 공통
			 */
			common: {
				init: function() {
					$('.more_toggle a').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$(this).closest('.feed_item').removeClass('active');
							$(this).data("show","yes");
							
						}else{
							$(this).closest('.feed_item').addClass('active');
							$(this).data("show","no");
						}
					});

					$('.bt_extend').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$(this).parent().removeClass('selected');
							$('.cate_dims').remove();
							$(this).data("show","yes");
							
						}else{
							$(this).parent().addClass('selected');
							$('.pc_lists, .feeds_lists, .employees').append('<div class="cate_dims"></div>');
							$(this).data("show","no");
						}
					});

					$('.detail_tabs .tabs_btn a').on("click",function(e) {
						e.preventDefault();
						var index = $(this).closest('.detail_tabs').find('.tabs_btn a').index($(this));
						$(this).closest('.detail_tabs').find('.tabs_btn a').removeClass('active');
						$(this).addClass('active');
						$(this).closest('.detail_tabs').find('.tabs_conts > div').hide();
						$($(this).closest('.detail_tabs').find('.tabs_conts > div').hide()[index]).show();	
					});


					$('.toggle_item > a').on("click",function(e) {
						if($(this).next().length > 0){
							e.preventDefault();
							var sub = $(this).next();
							if (sub.is(':visible')){
								sub.slideUp('fast')
								$(this).removeClass('active');
							}else{
								$('.detail_toggles .toggle_ins').slideUp('fast');
								$('.toggle_item > a').removeClass('active');
								$(this).addClass('active');
								sub.slideDown('fast');
							}
						};
					});

					$(window).scroll(function(){
					if ($(window).scrollTop() >= $(window).height()) {
						$('.bt_tops').show();
					}else {
						$('.bt_tops').hide();
						}
					});
					$('.bt_tops').click(function() {
						$("html, body").animate({ scrollTop: 0 }, "fast");
						return false;
					});

					$('#start, #end').datepicker({
						showOn: 'button',
						dateFormat: 'yy-mm-dd',
						prevText: '이전 달',
						nextText: '다음 달',
						monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
						monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
						dayNames: ['일','월','화','수','목','금','토'],
						dayNamesShort: ['일','월','화','수','목','금','토'],
						dayNamesMin: ['일','월','화','수','목','금','토'],
						showMonthAfterYear: true,
						yearSuffix: '년'
					});

					$('.pic_item .bt_open').on("click",function() {
						$('.pic_item .layers').hide();
						$(this).next().fadeIn();
						return false;
					});

					$('.bt_area').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$(this).removeClass('active');
							$('.area_lists').slideUp('fast');
							$(this).data("show","yes");
							
						}else{
							$(this).addClass('active');
							$('.area_lists').slideDown('fast');
							$(this).data("show","no");
						}
					});

					$('.th_toggle a').on("click",function(e) {
						$(this).addClass('active');
						$(this).parent().parent().next().find('.td_toggle_view').show();
						return false;
					});

					$('.td_toggle_view .close').on("click",function(e) {
						$(this).parent().hide();
						$(this).parent().parent().prev().find('a').removeClass('active');
						//$('.th_toggle a').removeClass('active');
					});


					$('.week_comments a').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$(this).removeClass('active');
							$(this).next().slideUp('fast');
							$(this).data("show","yes");
							
						}else{
							$(this).addClass('active');
							$(this).next().slideDown('fast');
							$(this).data("show","no");
						}
					});
					
					$('.day_select button').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$(this).parent().removeClass('active');
							$('.cal_list').slideUp('fast');
							$(this).data("show","yes");
							
						}else{
							$(this).parent().addClass('active');
							$('.cal_list').slideDown('fast');
							$(this).data("show","no");
						}
					});

					$('.week_lists .toggle').on("click",function(e) {
						if($(this).next().length > 0){
							e.preventDefault();
							var sub = $(this).next();
							if (sub.is(':visible')){
								sub.slideUp('fast')
							}else{
								$('.week_lists .in_box').slideUp('fast');
								$(this).addClass('active');
								sub.slideDown('fast');
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

    return myofficeUI;
}());

$(function(){
	myofficeUI.common.init();
});

