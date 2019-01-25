if (typeof ktaUI !== 'object') {
    var ktaUI = {};
	var handler = function(e) { e.preventDefault();}
}

ktaUI = (function() {
	'use strict';

	var ktaUI = {
			/**
			 * 공통
			 */
			common: {
				init: function() {
					//메뉴
					$('.gnbs > ul > li > a').mouseenter(function(){
						var num = $('.gnbs > ul > li > a').index($(this));
						$('.depths').show();
						$('.gnbs > ul > li, .depths > ul > li').removeClass('active');
						$(this).parent().addClass('active');
						$('.depths > ul > li').eq(num).addClass('active');
					});
					$('.depths > ul > li').mouseenter(function(){
						var num = $('.depths > ul > li').index($(this));
						$('.gnbs > ul > li, .depths > ul > li').removeClass('active');
						$('.depths > ul > li').eq(num).addClass('active');
					});
					$('.depths').mouseleave(function(){
						$('.depths').hide();
						$('.gnbs > ul > li, .depths > ul > li').removeClass('active');
					});

					//테이블 픽스
					var tb_clone = $('.scroll table').clone();
					$('.scroll').each(function(){
						$(this).scroll(function(){
							var scrollPos = $(this).scrollTop(), tbH = $('.scroll table thead').outerHeight();

							$('.clone_tb').remove();
							if(scrollPos >= tbH){
								$(this).append('<div class="clone_tb" style="overflow:hidden;height:50px;position:absolute;left:0;width:100%;border-bottom:1px solid #646569;"></div>');
								$('.clone_tb').css({'top':scrollPos + "px",'height':tbH-2}).append(tb_clone);
							}else{
								$('.clone_tb').remove();
							}
						});
					});

					//달력
					$('.start, .end').datepicker({
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

					//푸터 고정
					var h = $(window).height() - ($('.header').outerHeight() + $('.footer').outerHeight()) 
					$('.content').css('min-height',h);
					$(window).resize(function(){
						var h = $(window).height() - ($('.header').outerHeight() + $('.footer').outerHeight()) 
						$('.content').css('min-height',h);
					});

					//로그인 타입
					$('input:radio[name="login_type"]').each(function(i){
						var loginForm = $('.login_form');
						$(this).change(function(){
							$(loginForm).hide().eq(i).fadeIn();
						});
					});

					//테이블 체크
					$('.check.solo').each(function(){
						$(this).find('input').change(function(){
							if(this.checked) {
								$(this).closest('tr').addClass("active");
							}else{
								$(this).closest('tr').removeClass("active");
							}
						});
						
					});

				}
			}
    };

    return ktaUI;
}());

$(function(){
	ktaUI.common.init();
});
