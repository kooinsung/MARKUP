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
					//메인 리스트
					var $feeds_items = $('#feeds_items').masonry({
						itemSelector: '.item',
						isFitWidth: true,
						columnWidth: 440,
						gutter: 20
					});

					//메인 썸네일 롤링
					var slider_array = new Array();
				    $('.thumb_rolling ul').each(function(i){
				        slider_array[i] = $(this).bxSlider({controls:false,slideWidth: 220,minSlides:2,maxSlides:2,slideMargin:0});
				    });
				    
				    $('.feeds_items .bxslider-controls a').bind('click', function(e) {
				      e.preventDefault();
				      if($(this).hasClass('pull-left')) {
				        $.each(slider_array, function(i,elem){
				          elem.goToPrevSlide();  
				        });
				    
				      } else if($(this).hasClass('pull-right')) {
				        $.each(slider_array, function(i,elem){
				          elem.goToNextSlide();  
				        });
				      }
				    
				    });

					//말줄임
					$(".ellipsis").dotdotdot();

					//유틸메뉴
					$('.bt_my, .bt_conts, .bt_memo').on('click',function(e) {
						if($(this).next().length > 0){
							e.preventDefault();
							var layerIn = $(this).next();
							if (layerIn.is(':visible')){
								layerIn.hide();
							}else{
								$('.util_bar .in_layer').hide();
								layerIn.show();
							}
							$('.memos .ellipsis').trigger("update");
						};
					});

					//서브 메인 메뉴
					var $sub_main_lists = $('#sub_main_lists').masonry({
						itemSelector: '.item',
						isFitWidth: true,
						columnWidth: 290,
						gutter: 15
					});

					//초대하기
					$('.my_menus .bt_invite a').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							//닫힘
							$(this).parent().removeClass('active')
							$(this).next().slideUp('fast');
							$(this).data("show","yes");
						}else{
							//열림
							$(this).parent().addClass('active')
							$(this).next().slideDown('fast');
							$(this).data("show","no");
			
						}
					});
					
					//리스트 편집 메뉴
					$('.default_lists .bt_edit').on("click",function(e) {
						e.preventDefault();
						$('.default_lists .edit_layer').hide();
						$(this).next().fadeIn('fast');
					});
					var $greeting_lists = $('#default_lists').masonry({
						itemSelector: '.item',
						isFitWidth: true,
						columnWidth: 290,
						gutter: 15
					});
					
					//이용안내
					$('.bt_use-info').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							//닫힘
							$(this).removeClass('active');
							$('.use_infos').slideUp('fast');
							$(this).data("show","yes");
						}else{
							//열림
							$(this).addClass('active');
							$('.use_infos').slideDown('fast');
							$(this).data("show","no");
						}
					});
					$('.use_infos .tabs a').on("click",function(){
						var num = $('.use_infos .tabs a').index($(this));
						$('.use_infos .tabs li').removeClass('on');
						$(this).parent().addClass('on');
						$('.use_infos .tabs_conts > div').hide();
						$($('.use_infos .tabs_conts > div')[num]).fadeIn();	
						return false;
					});
					$('.faq .question').on('click',function(e) {
						if($(this).next().length > 0){
							e.preventDefault();
							var layerIn = $(this).next();
							if (layerIn.is(':visible')){
								$('.question').removeClass('on');
								layerIn.hide();
							}else{
								$('.answer').hide();
								layerIn.show();
								$('.question').removeClass('on');
								$(this).addClass('on');
							}
						};
					});

					//위임날짜
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

					//옵션선택
					$('td.opts .tabs a').on("click",function(e){
						var num = $('td.opts .tabs a').index($(this));
						$('td.opts .tabs li').removeClass('on');
						$(this).parent().addClass('on');
						$('.pic_reg_tab_conts .opt_lists > div').hide();
						$($('.pic_reg_tab_conts .opt_lists > div')[num]).fadeIn();	
						e.preventDefault();
					});

					//검색옵션
					$('.bt_srch-opt').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							//닫힘
							$(this).removeClass('active');
							$('.depths3 .opts').hide();
							$(this).data("show","yes");
						}else{
							//열림
							$(this).addClass('active');
							$('.depths3 .opts').show();
							$(this).data("show","no");
						}
					});

					//셀렉트 메뉴
					$('.select_menu .target').on('click',function(e) {
						if($(this).next().length > 0){
							e.preventDefault();
							var layerIn = $(this).next();
							if (layerIn.is(':visible')){
								$('.select_menu .target').removeClass('active');
								layerIn.slideUp('fast');
							}else{
								$('.select_menu .ins').hide();
								layerIn.slideDown('fast');
								$('.select_menu .target').removeClass('active');
								$(this).addClass('active');
							}
						};
					});

					//숫자 카운터
					  $('.totals .num').data('countToOptions', {
						formatter: function (value, options) {
						  return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
						}
					  });
					  
					  // start all the timers
					  $('.totals .num').each(count);  
					  function count(options) {
						var $this = $(this);
						options = $.extend({}, options || {}, $this.data('countToOptions') || {});
						$this.countTo(options);
					  }

					//상세 롤링
					var realSlider= $("#img_bigs").bxSlider({
						  pager:false,
						  controls:false,
						  infiniteLoop:false,
						  hideControlOnEnd:true,
						  onSlideBefore:function($slideElement, oldIndex, newIndex){
							changeRealThumb(realThumbSlider,newIndex);
						  }
						});
						
					var realThumbSlider=$("#img_thumbs").bxSlider({
					  minSlides: 4,
					  maxSlides: 4,
					  slideWidth: 100,
					  slideMargin: 10,
					  moveSlides: 1,
					  pager:false,
					  infiniteLoop:false,
					  hideControlOnEnd:true,
					  onSlideBefore:function($slideElement, oldIndex, newIndex){
					  }
					});
						
					linkRealSliders(realSlider,realThumbSlider);
					if($("#img_thumbs li").length<5){
					  $(".img_thumbs .bx-next").hide();
					}
					function linkRealSliders(bigS,thumbS){
					  $("#img_thumbs").on("click","a",function(event){
						event.preventDefault();
						var newIndex=$(this).parent().attr("data-slideIndex");
							bigS.goToSlide(newIndex);
					  });
					}

					function changeRealThumb(slider,newIndex){
					  var $thumbS=$("#img_thumbs");
					  $thumbS.find('.active').removeClass("active");
					  $thumbS.find('li[data-slideIndex="'+newIndex+'"]').addClass("active");
					  
					  if(slider.getSlideCount()-newIndex>=4)slider.goToSlide(newIndex);
					  else slider.goToSlide(slider.getSlideCount()-4);

					}


					//인사말
					var $greeting_lists = $('#greeting_lists').masonry({
						itemSelector: '.item',
						isFitWidth: true,
						columnWidth: 440,
						gutter: 20
					});

					$('.bt_more-view').on("click",function(e) {
						e.preventDefault();
						if($(this).data("show")=="no") {
							//닫힘
							$(this).removeClass('active');
							$(this).parent().find('.sns').hide();
							$(this).parent().find('.summery').removeClass('selected').dotdotdot();
							$greeting_lists.masonry('layout');
							$(this).data("show","yes");
						}else{
							//열림
							$(this).addClass('active');
							$(this).parent().find('.sns').show();
							$(this).parent().find('.summery').addClass('selected').trigger("destroy");
							$greeting_lists.masonry('layout');
							$(this).data("show","no");
						}
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
