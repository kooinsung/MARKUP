
$(function() {            

	//gnb 오버시
	$('.gnb_left li').on('mouseenter focusin', function(){
		$(this).addClass('over');
		$(this).siblings().removeClass('over');
		$(this).siblings().addClass('active_type2');			
	});
	$('.gnb_left li').on('mouseleave focusout', function(){
		$(this).removeClass('over');	
		$(this).siblings().removeClass('active_type2');			
	});

	//gnb 서브
	$('.gnb_sub_layer li').on('mouseenter focusin', function(){
		$(this).addClass('active');		
	});
	$('.gnb_sub_layer li').on('mouseleave focusout', function(){
		$(this).removeClass('active');
	});

	$('.gnb_right li').on('mouseenter focusin', function () {
	$(this).addClass('over');
	});
	$('.gnb_right li').on('mouseleave focusout', function () {
	$(this).removeClass('over');
	});		


	//셀렉트박스 UI
	var optionSelect = $(".select_wrap select");    
	optionSelect.change(function(){
		var optionSelectName = $(this).children("option:selected").text();
		$(this).siblings("label").html(optionSelectName);
	});


	//val삭제 버튼 show/hide
	$(document).on('focus', '.reason_input input, .default_input input', function(){
		$(this).val('');
	});
	$(document).on('keyup', '.reason_input input, .default_input input', function(){
		if($(this).val().length > 0) {
			$(this).parent().find('button').show();
		} else {
			$(this).parent().find('button').hide();
		}
	});
	//input val 삭제
	$(document).on('click', '.btnValDel', function(){
		$(this).hide();
		$(this).parent().find('input').focus().val('');
	});

	$('.btn_more_brand').on('click', function () {
		$(this).hide();
		$('.etc_new_top .brand_list').css('margin-right','0');
		$('.btn_more_close').show();
		$('.brand_list_wrap').css('height','auto');
	});
	$('.btn_more_close').on('click', function () {
		$(this).hide();
		$('.etc_new_top .brand_list').css('margin-right','70px');
		$('.btn_more_brand').show();
		$('.brand_list_wrap').css('height','45px');
	});

//	$('.type_prd_list .tit a').on("click",function(e) {
//		e.preventDefault();
//		if($(this).parent().next('ul').length > 0){
//			var subNav = $(this).parent().next('ul');
//			if (subNav.is(':visible')){
//				subNav.slideUp()
//				$(this).find('em').removeClass('active');
//			}else{
//				$('.type_prd_list li ul').slideUp();
//				subNav.slideDown();
//				$(this).find('em').addClass('active');
//			}
//	   };
//	});

	$('.in_list').each(function(){
		$(this).find('li:gt(7)').hide();
	});
	$('.type_prd_list .tit a').on("click",function(e) {
		e.preventDefault();
		if($(this).data("show")=="no") {
			//닫힘
			$(this).find('em').removeClass('active');
			$(this).parent().parent().find('li:gt(7)').hide();
			$(this).data("show","yes");
		}else{
			//열림
			if($(this).parent().parent().find('li').length > "8"){
				$(this).find('em').addClass('active');
			}
			$(this).parent().parent().find('li:gt(7)').show();
			$(this).data("show","no");
		}
	});

	//리뷰
	$('.like').on("click",function(e) {
		e.preventDefault();
		if($(this).hasClass('like_off')){//좋아요
			$(this).removeClass('like_off').addClass('like_on');
		}else if($(this).hasClass('like_on')){//좋아요 취소
			$(this).removeClass('like_on').addClass('like_off');
		}
	});

	//상품 오버
	$('.best_style_rank > ul > li, .best_style_list > ul > li, .etc_new_lists .list li, .best_list .item > .in > ul > li').on('mouseenter', function () {
		$(this).find('.btns').stop().fadeIn('fast');
	}).mouseleave(function(){
		$(this).find('.btns').stop().hide();
	});

	//세일 탭
	$('.sales_top .tab a').on("click",function(e) {
		e.preventDefault();
		var num = $('.sales_top .tab a').index($(this));
		$('.sales_top .tab a').removeClass('active');
		$(this).addClass('active');
		$('.sales_top .tabConts, .thumbList li').hide();
		$('.thumbList li').eq(num).show();
		$($('.sales_top .tabConts')[num]).show();
	});

});




//modal open
var dim = 'dim';
function show_modal(modal_id) {
	var layer = "#" + modal_id;
	var layer_bg = $('<div id="' + dim + '" ></div>');
	$(layer).fadeIn('fast').center({});
	$(layer_bg).appendTo('body');
	$(layer_bg).css({'width': '100%', 'height': '100%', 'display': 'none', 	'background-color': '#000', 	'filter':'alpha(opacity=50)', 'position': 'fixed', 'top': 0, 'left': 0, 'z-index': 998});
	$(layer_bg).fadeTo('fast', 0.8);
	$(window).bind('resize', function() {
		$(layer).center({transition:10});
	});
}
//modal close
function hide_modal(modal_id) {
	$("#" + modal_id).fadeOut('fast');
	$("#" + dim).remove();
}
// modal center
(function($){
 $.fn.extend({
	center: function (options) {
		var options =  $.extend({
			inside:window,
			transition: 0,
			minX:0,
			minY:0,
			withScrolling:true,
			vertical:true,
			horizontal:true 
		}, options);
		return this.each(function() {
			var props = {position:'absolute'};
			if (options.vertical) {
				var top = ($(options.inside).height() - $(this).outerHeight()) / 2;
				if (options.withScrolling) top += $(options.inside).scrollTop() || 0;
				top = (top > options.minY ? top : options.minY);
				$.extend(props, {top: top+'px'});
			}
			if (options.horizontal) {
				var left = ($(options.inside).width() - $(this).outerWidth()) / 2;
				if (options.withScrolling) left += $(options.inside).scrollLeft() || 0;
				left = (left > options.minX ? left : options.minX);
				$.extend(props, {left: left+'px'});
			}
			if (options.transition > 0) $(this).animate(props, options.transition);
			else $(this).css(props);
			return $(this);
		});
	}
 });
})(jQuery);
