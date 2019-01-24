if (typeof TOZUI !== 'object') {
    var TOZUI = {};
	var handler = function(e) { e.preventDefault();}
}

TOZUI = (function() {
	'use strict';

	var TOZUI = {
			/**
			 * 공통
			 */
			common: {
				init: function() {
					//패밀리사이트
					$('.bt_familysite').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$('.dim').remove();
							$('.layer_familysite').removeClass('down');
							$(this).data("show","yes");
						}else{
							$('.layer_familysite').addClass('down');
							$('<div class="dim" ></div>').appendTo('body').fadeIn('slow');
							$(this).data("show","no");
						}
					});

					//메뉴
					$('.bt_menu-show').on("click",function(e) {
						$('<div class="dim2" ></div>').appendTo('body').fadeIn('slow');
						$('.side_menu').addClass('show');
					});
					$('.side_menu .close').on("click",function(e) {
						$('.dim2').remove();
						$('.side_menu').removeClass('show');
					});
					$('.side_menu .depth1.sub').on("click",function(e) {
						if($(this).next('div').length > 0){
							e.preventDefault();
							var subNav = $(this).next('div');
							if (subNav.is(':visible')){
								subNav.slideUp(400)
								$(this).removeClass('active');
							}else{
								$('.side_menu .depth2').slideUp(400);
								subNav.slideDown(400);
								$('.side_menu .depth1.sub').removeClass('active');
								$(this).addClass('active');
							}
						};
					});

					//검색
					$('.bt_srch-show').on("click",function(e) {
						$('.layer_srch').addClass('show');
					});
					$('.layer_srch .close').on("click",function(e) {
						$('.layer_srch').removeClass('show');
					});

					//메인 비주얼
					if($('#main_visual').length > 0){
						var keyVisual = new Swiper('.main_visual .swiper-container', {
							observer: true,
							observeParents: true,
							autoplay: 5000,
							autoplayDisableOnInteraction: false,
							pagination:'.main_visual .slider_pagination'
						});	
					}

					//메인 배너
					if($('#main_banner').length > 0){
						var keyBanner = new Swiper('.main_banner .swiper-container', {
							observer: true,
							observeParents: true,
							autoplay: 5000,
							autoplayDisableOnInteraction: false,
							pagination:'.main_banner .slider_pagination'
						});	
					}

					//메인 이벤트
					if($('#main_evt').length > 0){
						var keyEvt = new Swiper('.main_evt .swiper-container', {
							observer: true,
							observeParents: true,
							autoplay: 5000,
							autoplayDisableOnInteraction: false,
							pagination:'.main_evt .slider_pagination'
						});	
					}

					//메인 사람들
					if($('#main_pps').length > 0){
						var keyPps = new Swiper('.main_pps .swiper-container', {
							observer: true,
							observeParents: true,
							autoplay: 5000,
							autoplayDisableOnInteraction: false,
							pagination:'.main_pps .slider_pagination'
						});	
					}

					//검색 달력
					$('#reservation_date').datepicker({
						dateFormat: 'yy.mm.dd',
						prevText: '이전 달',
						nextText: '다음 달',
						monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
						monthNamesShort: ['01','02','03','04','05','0','07','08','09','10','11','12'],
						dayNames: ['SUN','MON','TUE','WED','THU','FRI','SAT'],
						dayNamesShort: ['SUN', 'MON','TUE','WED','THU','FRI','SAT'],
						dayNamesMin: ['SUN', 'MON','TUE','WED','THU','FRI','SAT'],
						showMonthAfterYear: true,
						yearSuffix: '년',
						beforeShow: function(input) {
							var i_offset= $(input).offset(); //클릭된 input의 위치값 체크
							setTimeout(function(){
							   $('#ui-datepicker-div').css({'top':i_offset.top, 'bottom':'', 'margin-top':'45px'}); 
							})
						} 
					});

					//지점 검색
					$('.current_inputs input').on('click', function(){
						$(this).blur();
						if($(this).data("show")=="no") {
							$('.drop_dims').remove();
							$(this).closest('.list_srching').removeClass('active');
							$('#srching').slideUp('fast');
							$(this).data("show","yes");
						}else{
							$('<div class="drop_dims" ></div>').appendTo('.room_srching').fadeIn('fast');
							$(this).closest('.list_srching').addClass('active');
							$('#srching').slideDown('fast');
							$(this).data("show","no");
						}
					});
					$('.srch_inputs input, .filter_input input').on('click', function(){
						$(this).blur();
						$('.layer_srching').hide();
						$(this).closest('.srching ').addClass('active');
						$(this).parent().next().fadeIn();
					});
					$('.layer_srching .close').on("click",function(e) {
						$('.layer_srching').hide();
						$('.srching').removeClass('active');
					});
					
					//마이토즈 기간조회 달력
					if($('.period_cals').length > 0){
						$('#start_date, #end_date').datepicker({
							dateFormat: 'yy.mm.dd',
							prevText: '이전 달',
							nextText: '다음 달',
							monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
							monthNamesShort: ['01','02','03','04','05','0','07','08','09','10','11','12'],
							dayNames: ['SUN','MON','TUE','WED','THU','FRI','SAT'],
							dayNamesShort: ['SUN', 'MON','TUE','WED','THU','FRI','SAT'],
							dayNamesMin: ['SUN', 'MON','TUE','WED','THU','FRI','SAT'],
							showMonthAfterYear: true,
							yearSuffix: '년',
							beforeShow: function(input) {
								var i_offset= $(input).offset(); //클릭된 input의 위치값 체크
								setTimeout(function(){
								   $('#ui-datepicker-div').css({'top':i_offset.top, 'bottom':'', 'margin-top':'45px'}); 
								})
							} 
						});
					}

					//지점상세 비주얼
					if($('.detail_visual').length > 0){
						var detailVisual = new Swiper('.detail_visual .swiper-container', {
							observer: true,
							observeParents: true,
							autoplay: 5000,
							autoplayDisableOnInteraction: false,
							pagination:'.detail_visual .slider_pagination'
						});	
					}

					//지점혜택 비주얼
					if($('.detail_benefit').length > 0){
						var benefitVisual = new Swiper('.detail_benefit .swiper-container', {
							observer: true,
							observeParents: true,
							autoplay: 5000,
							autoplayDisableOnInteraction: false,
							pagination:'.detail_benefit .slider_pagination'
						});	
					}

					//요금안내
					$('.study_use .money select').change(function(){
						var index = this.selectedIndex;
						var tbs = $(this).parent().parent().find('.money_tbs .money_tb');
						$(tbs).hide();
						$(tbs).eq(index).fadeIn('slow');	
					});

					//히스토리
					$('#history_sels').change(function(){
						var index = this.selectedIndex;
						$('.history_list > div').hide();
						$($('.history_list > div')[index]).fadeIn('slow');	
					});

					//공간안내
					$('.room_info #choice_studio').change(function(){
						var index = this.selectedIndex;
						$('.room_info .studios li').hide();
						$($('.room_info .studios li')[index]).fadeIn('slow');	
					});

					//맵으로 이동
					$('.bt_map').on('click', function(){
						$('html, body').animate({ scrollTop: $('#detail_map').offset().top - 100 }, "fast");
					});

					//툴팁
					$('.bt_tooltip').on('click', function(){
						if($(this).data("show")=="no") {
							$(this).next().removeClass('active');
							$(this).data("show","yes");
						}else{
							$(this).next().addClass('active');
							$(this).data("show","no");
						}
					});

					//예약 버튼
					if($('.fix_bts').length > 0){
						$(document).scroll(function() {
							if($('.fix_bts').offset().top + $('.fix_bts').height() >= $('.footer').offset().top - 10)
								$('.fix_bts').addClass('out');
							if($(document).scrollTop() + window.innerHeight < $('.footer').offset().top)
								$('.fix_bts').removeClass('out');
						});
					}

					//히스토리
					$('#history_sels').change(function(){
						var index = this.selectedIndex;
						$('.history_list > div').hide();
						$($('.history_list > div')[index]).fadeIn('slow');	
					});

					//footer
					if($('.footer').length > 0){
						$(window).on('scroll load', function(){
							var scrollTop = $(document).scrollTop(), topBtn = $('#footer').find('.bt_top');
							if( scrollTop > $(window).height() / 2){
								topBtn.show();
							} else {
								topBtn.hide();
							};
						});
						$('.bt_top').on('click', function(e){
							e.preventDefault();
							 $("html, body").animate({ scrollTop: 0 }, "fast");
						});
					}
				},
				//메뉴 위치 이동
				moveMenu: function() {
					var $menu = $('.sub_menu .inner');
					var $element = $('.sub_menu a.active');
					var elOffset = $element.offset().left;
					var elWidth = $element.outerWidth(true);
					var menuScrollLeft = $menu.scrollLeft();
					var menuWidth = $menu.width();
					var myScrollPos = elOffset + (elWidth / 2) + menuScrollLeft - (menuWidth / 2);
					$menu.scrollLeft(myScrollPos);
				}
			},
			/**
			 * 모달 레이어
			   .layer_type1 : 기본 모달 레이어
			 */
			layers: {
				open: function(modalID) {
					var layer = "#" + modalID;
					var bg = $('<div class="dim2" ></div>');
					var layerType = $(layer).attr('class');

					$(layer).css({
						'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
						'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
					}).fadeIn('fast');
					$(bg).appendTo('body').fadeIn('fast');
				},
				close: function(modalID) {
					$('#' + modalID).hide();
					$('.dim2').remove();
				}
			}
    };

    return TOZUI;
}());

$(function(){
	 TOZUI.common.init();

	if($('.sub_menu').length > 0){
		 TOZUI.common.moveMenu();
	}
});