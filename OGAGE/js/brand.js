
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

	//view
	$('.view_type li button').on('click', function () {
		var num = $('.view_type li button').index($(this));
		
		$('.view_type li button').removeClass('active');
		$(this).addClass('active');
		$('.brand_sub_list ul').removeAttr('class');
		if(num == "0"){
			$('.brand_sub_list ul').addClass('two');
		}else if(num == "1"){
			$('.brand_sub_list ul').addClass('three');
		}else if(num == "2"){
			$('.brand_sub_list ul').addClass('four');
		}
	});



	//top
	$('#btn_top').on('click', function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
	});

	$('#btn_down').on('click', function () {
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
	});

	//상품 오버
	$('.brand_main_list > ul > li, .brand_sub_list > ul > li').on('mouseenter', function () {
		$(this).find('.btns').stop().fadeIn('fast');
	}).mouseleave(function(){
		$(this).find('.btns').stop().hide();
	});

	// 기획전보기 셀렉터
	$('.brand_util .btn_list').on('click',function(){
		$('.ex_location').toggleClass('open')
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
