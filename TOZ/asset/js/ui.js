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
					//통합 검색(공통)
					$('.srch .bt_srch-show').on( "click", function() {
						$('.srch_layer').fadeIn();
					});
					$('.srch .bt_close').on( "click", function() {
						$('.srch_layer').fadeOut();
					});

					//상단 패밀리 사이트(공통)
					$('.h_util .toggle').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							$(this).removeClass('on').next().slideUp('fast');
							$(this).data("show","yes");
						}else{
							$(this).addClass('on').next().slideDown('fast');
							$(this).data("show","no");
						}
					});

					//메뉴(공통)
					$('.gnb > ul > li').each(function(){
						if($(this).hasClass('active')){
							if($(this).find('.depths2').length > 0){
								$('.header').append('<div class="gnb_dim"></div>');
							}else{
								$('.gnb_dim').remove();
							}
						}
					});
					$('.depths1').on('mouseenter', function(){
						$('.depths2').hide();
						$('.gnb > ul > li').removeClass('active');
						$(this).parent().addClass('active');
						if($(this).next().length > 0){
							$('.header').append('<div class="gnb_dim"></div>');
						}else{
							$('.gnb_dim').remove();
						}
						$(this).next().fadeIn();
						return false;
					});
					$('.gnb').on('mouseleave', function(){
						$('.gnb > ul > li').removeClass('active');
						$('.gnb_dim').remove();
						$('.depths2').hide();
						return false;
					});

					//메인 비주얼(공통)
					if($('.main_rolling').length > 0){
						$('.main_rolling > ul').bxSlider({mode:'fade',auto:true, pause:5000});
					}

					//toz 메인 배너
					if($('.main_banners').length > 0){
						$('.main_banners > ul').bxSlider({mode:'fade',auto:true, pause:5000});
					}

					//moim 메인 이벤트 배너
					if($('.main_evt_banners').length > 0){
						$('.main_evt_banners').bxSlider({auto:true, pause:5000});
					}

					//study 메인 사람들 배너
					if($('.main_pp_banners').length > 0){
						$('.main_pp_banners').bxSlider({auto:true, pause:5000});
					}

					//인테리어
					if($('.interior').length > 0){
						$('#bigs').bxSlider({
							pagerCustom: '#smalls',
							infiniteLoop: false
						});
					}

					//study 서브 사람들
					if($('.pp_lists').length > 0){
						$('#pp_lists').bxSlider({
							infiniteLoop: false,
							slideWidth: 280,
							minSlides: 4,
							maxSlides: 4,
							moveSlides: 1,
							slideMargin: 20
						});
						$('.pp_lists .pp_item:first-child a').addClass('active');
						$('.pp_lists .pp_item a').click(function(){
							var num = $('.pp_lists .pp_item a').index($(this));
							$('.pp_lists .pp_item a').removeClass('active');
							$(this).addClass('active');
							$('.pp_lists .texts li').hide();
							$('.pp_lists .texts li').eq(num).fadeIn();
							return false;
						});
					}

					//공간정보
					$(".room_info .list a").click(function(e){
						e.preventDefault();
						$('html,body').animate({scrollTop:$(this.hash).offset().top - 70}, 500);
					});
					$('#studios_tabs a').on("click",function(e){
						e.preventDefault();
						var index = $('#studios_tabs a').index($(this));
						$('#studios_tabs a').removeClass('active');
						$(this).addClass('active');
						$('.studios li').hide();
						$($('.studios li')[index]).fadeIn('slow');	
					});

					//히스토리 탭
					$('.history .default_tabs2 a').on("click",function(){
						var num = $('.history .default_tabs2 a').index($(this));
						$('.history .default_tabs2 a').removeClass('active');
						$(this).addClass('active');
						$('.history .tab_conts').hide();
						$($('.history .tab_conts')[num]).fadeIn();	
						return false;
					});

					//홈오피스 롤링
					if($('.homeoffice_slider').length > 0){
						$('.homeoffice_slider > ul').bxSlider({auto:true, pause:5000});
					}

					//PR
					if($('.pr_slider').length > 0){
						var prSlider = $('.pr_slider > ul').bxSlider({});
					}
					$('.pr_lists a').on("click",function(){
						var num = $('.pr_lists a').index($(this));
						$('#pr_slider').css({
							'top':Math.max(0, (($(window).height() - $('#pr_slider').height()) / 2) +  $(window).scrollTop()) + "px",
							'left':Math.max(0, (($(window).width() - $('#pr_slider').width()) / 2) +  $(window).scrollLeft()) + "px"
						}).fadeIn('fast');
						$('<div class="dim" ></div>').appendTo('body').fadeIn('fast');
						prSlider.reloadSlider();
						prSlider.goToSlide(num);
						return false;
					});

					//지점 검색
					if($('.srching').length > 0){
						$('#srching_date').datepicker({
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
								//달력 무조건 인풋 밑으로
								var i_offset= $(input).offset(); 
								setTimeout(function(){
								   $('#ui-datepicker-div').css({'top':i_offset.top, 'bottom':'', 'margin-top':'65px'}); 
								})

								//지점 상세 달력 위치 재조정
								if($('.details .side_cols').length > 0){
									$('.srching_layer.date').fadeIn().append($('#ui-datepicker-div'));
									setTimeout(function(){
									   $('#ui-datepicker-div').css({'position':'absolute','top':'0', 'left':'0', 'bottom':'', 'margin-top':'53px', 'margin-left':'0', 'display':'block'}); 
									})
								}
							},
							onSelect: function(dateText, inst) {
								$('.srching_layer').fadeOut();
							}
						});

						$('.srching_input input').on('focusin', function(){
							$(this).on('keyup change', function(){
								 var value = $(this).val();
								if(value && value.length > 0) {
									$(this).parent().find('.val_del').show();
								} else {
									$(this).parent().find('.val_del').hide();
								}
							});
							$('.srching_layer').stop().fadeOut('fast');
							$(this).closest('.srching_input').next().fadeIn();
						})

						$(document).on('click', function (e) {
							if($(e.target).parents(".srching .opts").length === 0  && $(e.target).parents(".details .srching").length === 0) {
								$('.srching_layer').fadeOut('fast');
							}
						});	

						$('.val_del').click(function(){
							$(this).hide();
							$(this).parent().find('input').val('');
						});

						$('.srching_drops .target').on('click', function(){
							 $('.srching_layer').stop().fadeOut('fast');
							 $(this).closest('.srching_drops').next().fadeIn();
						});
					}

					//달력
					$('#reservation_date, #start_date, #end_date').datepicker({
						dateFormat: 'yy.mm.dd',
						prevText: '이전 달',
						nextText: '다음 달',
						monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
						monthNamesShort: ['01','02','03','04','05','0','07','08','09','10','11','12'],
						dayNames: ['SUN','MON','TUE','WED','THU','FRI','SAT'],
						dayNamesShort: ['SUN', 'MON','TUE','WED','THU','FRI','SAT'],
						dayNamesMin: ['SUN', 'MON','TUE','WED','THU','FRI','SAT'],
						showMonthAfterYear: true,
						yearSuffix: '년'
					});

					//맵으로 이동
					$('.bt_map').on('click', function(){
						$('html, body').animate({ scrollTop: $('#detail_map').offset().top - 100 }, "fast");
					});

					//툴팁
					$('.bt_tooltip').mouseenter(function(){
						$(this).next().addClass('active');
					}).mouseleave(function(){
						$(this).next().removeClass('active');
					});

					//상세 사이드바 픽스
					if($('.details .side_cols').length > 0){
						$('.wrap').css('position','static'); 
						$('.side_cols').scrollToFixed({
							marginTop: $('.header').outerHeight(true) + 10,
							limit: $('.footer').offset().top - $('.side_cols').outerHeight(true) - 150,
							zIndex: 50,
							preFixed: function() {  $('.details .type2').css('position','relative');},
							preAbsolute: function() { $('.details .type2').css('position','static'); },
							postFixed: function() { },
							postAbsolute: function() {  $('.details .type2').css('position','relative'); }
						});
					}

					//footer
					if($('.footer').length > 0){
						$(window).on('scroll load', function(){
							var el, topBtn;
							var footerTop, scrollTop, winH, docuH, scrollChk, topPosiChk, footerH;
							topBtn = $('#footer').find('.bt_top');
							footerTop = $('#footer').offset().top;
							footerH = $('#footer').height();
							winH = window.innerHeight || $(window).height();
							docuH = document.innerHeight || $(document).height();
							scrollChk = winH <= docuH;
							topPosiChk = docuH - winH - footerH;
							scrollTop = $(document).scrollTop();
							if( scrollTop > 0 && topPosiChk > scrollTop){
								topBtn.css({
									'position' : 'fixed',
									'top' : 'auto',
									'bottom' : '20px'
								});
							} else {
								topBtn.attr('style',true);
							};
						});
						$('.bt_top').on('click', function(e){
							e.preventDefault();
							 $("html, body").animate({ scrollTop: 0 }, "fast");
						});
					}
				}
			},
			/**
			 * 모달 레이어
			   .layer_type1 : 작은 레이어 (공유하기, 문의하기 등등)
			   .layer_type2 : 기본 모달 레이어
			   .layer_type3 : 기본 모달 레이어 + 이미지 슬라이더
			 */
			layers: {
				open: function(modalID) {
					var layer = "#" + modalID;
					var bg = $('<div class="dim" ></div>');
					var layerType = $(layer).attr('class');
					
					if($(layer).hasClass('layer_type1')){
						$(layer).fadeIn('fast');
					}else if($(layer).hasClass('layer_type2')){
						$(layer).css({
							'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
							'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
						}).fadeIn('fast');
						$(bg).appendTo('body').fadeIn('fast');

						//레이어 높이가 화면보다 클경우
						if($(layer).height() > $(window).height()){
							$(layer).css({'top':'50px'});
						};
					}else if($(layer).hasClass('layer_type3')){
						$(layer).css({
							'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
							'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
						}).fadeIn('fast');
						$(bg).appendTo('body').fadeIn('fast');
						var layerSlider = $('.layer_slider > ul').bxSlider({
							onSlideAfter: function(){
								$('.slide_num .current_num').text(layerSlider.getCurrentSlide()+1);   
							}
						});
						$('.slide_num .current_num').text(1);   
						$('.slide_num .total_num').text(layerSlider.getSlideCount());
					}
				},
				close: function(modalID) {
					$('#' + modalID).hide();
					$('.dim').remove();
				}
			}
    };

    return TOZUI;
}());

$(function(){
	 TOZUI.common.init();
});