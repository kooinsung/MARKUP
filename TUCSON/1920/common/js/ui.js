$(function(){

	$('.safetyRolling').bxSlider({
		mode:'fade',
		infiniteLoop: false,
		pagerCustom: '#bx-pager'
	});

	$('.cycleMenu li a').bind("click",function(){
		var current = $(this).attr("rel");

		$('.thumbs li a img').each(function(){
			$(this).attr("src", $(this).attr("src").replace("_on.png", "_off.png"));
		});
//		//$('.thumbs li:first-child').find("img").attr("src", $('.thumbs li:first-child').find("img").attr("src").replace("_off.png", "_on.png"));

		$('.thumbs li:first-child a img').each(function(){
			$(this).attr("src", $(this).attr("src").replace("_off.png", "_on.png"));
		});
		$('.bigs > ul > li:first-child').show();
		$('.views').hide();
		$('.cycleMenu li').removeClass('active');
		$(this).parent().addClass('active');
		$("#" + current).fadeIn();
		return false;
	});

	$('.thumbs > ul > li > a').bind("mouseenter",function(){
		var num = $('.thumbs li a').index($(this));

		$('.thumbs li a img').each(function(){
			$(this).attr("src", $(this).attr("src").replace("_on.png", "_off.png"));
		});

		$(this).find("img").attr("src", $(this).find("img").attr("src").replace("_off.png", "_on.png"));

		$('.thumbs > ul > li').removeClass('active');
		$(this).parent().addClass('active');
		$('.bigs > ul > li').hide();
		$($(".bigs > ul > li")[num]).stop().fadeIn(2500);
		return false;
	});

	$('#btnOpen').bind("click",function(){
		var layer_bg = $('<div id="dim" ></div>');
			$(layer_bg).appendTo('body');
			$(layer_bg).css({'width': '100%', 'height': '100%', 'display': 'none', 	'background-color': '#000', 	'filter':'alpha(opacity=50)', 'position': 'fixed', 'top': 0, 'left': 0, 'z-index':4});
			$(layer_bg).fadeTo('fast', 0.5);

		$('.before').animate({
			left: '-252px',
			opacity:0,
		}, 'fast', function() {
			$('.after').animate({left:0,opacity:1}, 'fast');
		});
	});
	$('#btnClose').bind("click",function(){
		$('#dim').remove();
		$('.before').animate({left:'0',opacity:1}, 'fast');
		$('.after').animate({left:'-550px',opacity:0}, 'fast');
	});
});