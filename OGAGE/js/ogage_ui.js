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

	//업체정보 레이어
	$('.btn_business_layer').on('click', function () {
		$(this).siblings('.business_info').fadeIn('fast');
		$('.btn_business_close').click(function(){
			$(this).parent().fadeOut('fast');
		});
	});

	$('.btn_star_toggle').on("click",function(e) {
		e.preventDefault();
		if($(this).data("show")=="no") {
			$(this).removeClass('active');
			$('.star_layer').hide();
			$(this).data("show","yes");
		}
		else{
			$(this).addClass('active');
			$('.star_layer').show();
			$(this).data("show","no");
		}
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
