if (typeof pagodastarUI !== 'object') {
    var pagodastarUI = {};
	var handler = function(e) { e.preventDefault();}
}

pagodastarUI = (function() {
	'use strict';

	var pagodastarUI = {
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
					$('html').addClass("pgds-" + currentOS);


					//header높이만큼 
					var headerH = $('.pgds-header').height();
					$('.pgds-content').css('margin-top', headerH);


					if($('#pgds-header').length > 0){
						//스크롤  위,아래
						$('#pgds-header').headroom({
							offset:headerH,
							tolerance : {
								up : 0,
								down : 0
							},
							//scroll up
							onPin : function() {
								//console.log("onPin");
								$('.pgds-footer .move_top, .move_top_solo .move_top').removeClass('fixed');
							},
							//scroll down
							onUnpin : function() {
								//console.log("onUnpin");
								$('.pgds-footer .move_top, .move_top_solo .move_top').addClass('fixed');
							},
							//scroll bottom
							onBottom : function() {
								//console.log("onBottom");
								$('.pgds-footer .move_top').removeClass('fixed');
							},
							//scroll not bottom
							onNotBottom : function() {
								//console.log("onNotBottom");
							}
						});	
					}
					
					//알림 숫자 체크
					$('.num').each(function(){
						var numCheck = $(this).text();
						if(numCheck >= 10){
							$(this).addClass('num_over');
						}else{
							$(this).removeClass('num_over');
						}
					});

					//위로 이동
					$('#move_top').click(function() {
					  $('html, body').animate({ scrollTop: 0 }, 'fast');
					  return false;
					});
				}
			},

			/**
			 * 메인
			 */
			main: {
				init: function() {
					//키 비주얼
					var keyVisual = new Swiper('.key_visual .swiper-container', {
						observer: true,
						observeParents: true,
						nextButton: '.key_visual .swiper-next',
						prevButton: '.key_visual .swiper-prev',
						//autoplay: 5000,
						autoplayDisableOnInteraction: false,
						pagination:'.key_visual .slider_pagination'

					});	
					var totalSlides = $('.key_visual .slider_pagination span').length;
					$('.key_visual .number_pager .total').html(totalSlides);
					keyVisual.on('slideChangeEnd', function(instance) {
						var currentCount = (instance.activeIndex) % (totalSlides) + 1;
						if(currentCount === 0) {
								$('.key_visual .number_pager .current').html(totalSlides);
						} else {
								$('.key_visual .number_pager .current').html(currentCount);
						}
					});


					//카테고리 메뉴
					var nav = $('.main_cate_menus .card_tabs'), cateMenuTop = $(nav).offset().top, sections = $('.card_section');

					$(nav).find('a').on('click', function () {
						var $el = $(this), id = $el.attr('href');
						var index = $(nav.find('a')).index($(this));
						$('html, body').animate({
							scrollTop: $(id).offset().top - 60
						}, 'fast');
	
						return false;
					});

					//스크롤시
					$(document).on('scroll ', function () {
						var currentPos = $(this).scrollTop(),  cateMenuBtm= $('.main_cate_menus').outerHeight() + cateMenuTop;

						if(currentPos >= cateMenuTop && currentPos < cateMenuBtm){
							$(nav).addClass('fixed');
							$('.gnbs').hide();
						}else{
							$(nav).removeClass('fixed');
							$('.gnbs').show();
						}

						$(sections).each(function(i) {
							var top = $(this).offset().top - 60,
								bottom = top + $(this).outerHeight();
							if(currentPos >= top && currentPos <= bottom) {
								$(nav).find('a').removeClass('active');
								$(sections).removeClass('active');
								$(this).addClass('active');
								$(nav).find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
							}
						});
					});


					//무료특강
					var freeLecture = new Swiper('.main_free_lecture .swiper-container', {
						observer: true,
						observeParents: true,
						nextButton: '.main_free_lecture .swiper-next',
						prevButton: '.main_free_lecture .swiper-prev',
						pagination:'.main_free_lecture .slider_pagination',
						paginationClickable: true,
						slidesPerView: 'auto'
					});	
				}
			},

			/**
			 * 전체보기 레이어
			 */
			all_layer: {
				open: function(allID) {
					var target = "#" + allID;
					var children = $(target).find('.swiper-wrapper a').clone();
					var allLayer = "";
					allLayer += "<div class='all'>";
					allLayer += "<strong class='tit'>전체보기</strong>";
					allLayer += "<div class='inner'>";
					allLayer += "</div>";
					allLayer += "<button type='button' class='all_close' onclick=pagodastarUI.all_layer.close();>close</button>";
					allLayer += "</div>";
					$(allLayer).appendTo('body');
					$('html, body').scrollTop(0);
					$('body').css('overflow','visible');
					$('.pgds-wrap').hide();
					$(".all .inner").prepend(children);  
				},
				close:function(){
					$('.all, .all .inner').remove();
					$('html, body').scrollTop(0);
					$('body').css('overflow','hidden');
					$('.pgds-wrap').show();
				}
			},

			/**
			 * 레이어
			 */
			layer: {
				open: function(layerID) {
					var target = "#" + layerID;
					$(target).show();
					$('body').css('overflow','visible');
					$('.pgds-wrap').hide();
				},
				open2: function(layerID) {
					var target = "#" + layerID, 
						bg = $('<div class="layer_dim" ></div>'), 
						calH = $(window).height() / 3,
						half3 = calH*2;
					$('.ui-mobile').css({'height':$(window).height,'overflow':'hidden'});
					$(target).addClass('open');
					if(layerID == "layer_apply" || layerID == "layer_cart" || layerID == "layer_interest"){
						half3 = half3 - 50;
						if($(target).find('.delivery_noti').length > 0){
							$(target).find('.layer_inner').css({'height':half3 - 78}).scrollTop(0);	
						}else{
							$(target).find('.layer_inner').css({'height':half3}).scrollTop(0);	
						}
					}else{
						var targetH = $(target).find('.layer_inner');
						if($(targetH).height() > half3){						
							$(targetH).addClass('scroll').css({'height':half3});	
							$(targetH).unbind('touchmove', handler);
						}else{
							$(targetH).bind('touchmove', handler);
						}
						$(target).css("top", Math.max(0, (($(window).height() - $(target).height()) / 2) +  $(window).scrollTop()) + "px");
					}
					$(target).find('.layer_inner').scrollTop(0);
					$(target).find('.tit').bind('touchmove', handler);
					$(bg).appendTo('body').bind('touchmove', handler);
				},
				close:function(layerID){
					$('#' + layerID).hide();
					$('body').css('overflow','hidden');
					$('.pgds-wrap').show();
					$('.layer_dim').remove();
				},
				close2:function(layerID){
					$('#' + layerID).removeClass('open');
					$('.ui-mobile').css({'height':'auto','overflow':'visible'});
					$('.pgds-layer2 .layer_inner').removeClass('scroll').css({'height':'auto'});	
					$('.layer_dim').remove();
				}
 
			},

			/**
			 * 전체메뉴
			 */
			allMenu: {
				init: function() {
					pagodastarUI.allMenu.subTabs();
					pagodastarUI.allMenu.aco();
				},
				aco: function() {
					$('.depth1 > li > a').on('click',function(e) {
						if($(this).next('div').length > 0){
							e.preventDefault();
							$('.depth2 > ul > li').removeClass('active');
							var subs = $(this).next('div') , parentObj = $(this).parent();
							if (subs.is(':visible')){
								subs.slideUp('fast')
								$(parentObj).removeClass('active'); 
							}else{
								$('.depth3').hide();
								$('.depth1 .subs').slideUp('fast');
								subs.slideDown('fast');
								if($(parentObj).find('.depth2').length > 0){
									$(parentObj).find('.depth2 > ul > li:first-child > a').click();
								}
								$('.depth1 > li').removeClass('active');
								$(parentObj).addClass('active');

							}
						}
					});
				},
				subTabs: function() {
					$('.depth2 > ul > li > a').on('click',function(e){
						e.preventDefault();
						var num = $('.depth2 > ul > li > a').index($(this));
						$('.depth3').show();
						$('.depth2 > ul > li').removeClass('active');
						$(this).parent().addClass('active');
						$('.depth3 > ul').hide();
						$($('.depth3 > ul')[num]).show();	
					});
				}
			},

			/**
			 * 서브
			 */
			subs: {
				init: function() {
					//기획전/이벤트
					if($('#lect_banners').length > 0){
						var bannerSwiper = new Swiper('#lect_banners .swiper-container', {
							observer: true,
							observeParents: true,
							autoplay: 5000,
							autoplayDisableOnInteraction: false,
							pagination:'#lect_banners .slider_pagination'

						});	
						var totalSlides = $('#lect_banners .slider_pagination span').length;
						$('#lect_banners .number_pager .total').html(totalSlides);
						bannerSwiper.on('slideChangeEnd', function(instance) {
							var currentCount = (instance.activeIndex) % (totalSlides) + 1;
							if(currentCount === 0) {
									$('#lect_banners .number_pager .current').html(totalSlides);
							} else {
									$('#lect_banners .number_pager .current').html(currentCount);
							}
						});
					}	

					//강사 정보
					if($('.teacher_views').length > 0){
						var numCheck = $('.teacher_views > li').size();
						if(numCheck <= 1){
							$('.teacher_views').addClass('solo');
						}else{
							$('.teacher_views').removeClass('solo');
						}

						$('.teacher_views .thumbs button').on('click',function(){
							$('.teacher_views .thumbs button').show();
							$(this).hide();
							$('.teacher_views .view_links').removeClass('show');
							$(this).parent().next().addClass('show');
						});
						$('.teacher_views .view_links button').on('click',function(){
							$('.teacher_views .thumbs button').show();
							$(this).parent().removeClass('show');
						});
					}

					//수강 후기
					if($('#toggle_review').length > 0){
						$('.review_more').on('click',function(){
							if($(this).closest('li').hasClass('active')){
								$(this).closest('li').removeClass('active');
							}else{
								$('#toggle_review > ul > li').removeClass('active');
								$(this).closest('li').addClass('active');
							}
						});
					}

					//강의 상세 탭
					if($('.details_tabs').length > 0){
						var tabNum = $('.details_tabs li').size(), tabTarget = $('.details_tabs ul');
						
						if(tabNum == 1){
							$(tabTarget).addClass('one');
						}else if(tabNum == 2){
							$(tabTarget).addClass('two');
						}else if(tabNum == 3){
							$(tabTarget).addClass('three');
						}else if(tabNum == 4){
							$(tabTarget).addClass('four');
						}


						var dTab = $('.details_tabs'), offsetT = $(dTab).offset().top - 5, sections = $('.details_views_box');

						$(dTab).find('a').on('click', function () {
							var $el = $(this), id = $el.attr('href');
							var index = $(dTab.find('a')).index($(this));
							$('html, body').animate({
								scrollTop: $(id).offset().top - 50
							}, 'fast');
		
							return false;
						});

						$(document).on('scroll ', function () {
							var currentPos = $(this).scrollTop(),  detaileBtm= $('.detail_row4').outerHeight() + offsetT;

							if(currentPos >= offsetT && currentPos < detaileBtm){
								$(dTab).addClass('fixed');
								$('.gnbs').hide();
							}else{
								$(dTab).removeClass('fixed');
								$('.gnbs').show();
							}

							$(sections).each(function(i) {
								var top = $(this).offset().top - 50,
									bottom = top + $(this).outerHeight();
								if(currentPos >= top && currentPos <= bottom) {
									$(dTab).find('li').removeClass('active');
									$(sections).removeClass('active');
									$(this).addClass('active');
									$(dTab).find('a[href="#'+$(this).attr('id')+'"]').parent().addClass('active');
								}
							});
						});
					}


					//구성강의
					if($('.in_list').length > 0){
						var leftP = $('.in_list .inner li.active').offset().left, bg = $('<div class="dim" ></div>');

						$('.in_list .inner').animate({ scrollLeft: leftP }, 'fast');
						$('.in_list button').on('click',function(){
							if($(this).parent().hasClass('scroll')){
								$(this).parent().removeClass('scroll');
								$('.in_list .inner').css('height','auto');
								$(bg).remove();
							}else{
								$(bg).appendTo('.details_views');
								$('.in_list').removeClass('scroll');
								$(this).parent().addClass('scroll');
								var sh = ($('.in_list li').outerHeight() * 6) + 5;
								$('.in_list.scroll .inner').css('height',sh);
							}
							$('.in_list .inner').animate({ scrollLeft: leftP, scrollTop:0 }, 'fast');
						});
					}

				}
			}
    };

    return pagodastarUI;
}());

$(function(){
	pagodastarUI.common.init();
});