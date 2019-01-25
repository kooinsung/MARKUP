var	shodoc = (typeof shodoc === 'undefined') ? {}	: console.log('......');

shodoc	= {
	init:function(){
		var	h;
		h =	this;
		h.common.init();
		h.headerFixed.init();
	}
};
shodoc.common	= {
	init:function(){
		var	common	= this;
		common.ui();
	},
	ui:function(){
		var handler = function(e) { e.preventDefault();}
		$('.join, .member, .srchDetail').css('min-height',$(window).height() - ($('footer').height() + $('.headerSub').height() + 16))
		$('.cateTips .bg').bind('touchmove', handler);

		//좌측메뉴
		$('#btnMenu').on("click",function() {
			
			$('html,body').css({'overflow':'hidden','width':$(window).width(),'height':$(window).height()})
			$('.sideWrap').css({'display':'block','overflow':'hidden','height': $(window).height()});
			$('.depth2').show();
			$('.depth2List').css({'height': $(window).height()});
			$('.headerWrap').css({'position': 'relative'});
			$('.container').css({'margin-top': '0'});
			$('#mWrap').animate({ left: "268px"}, 300, "easeOutExpo").append('<div id="dim" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; z-index: 998; opacity: 0.1; background:#fff;"></div>');
			$('.btnUserSetting').hide();
			$('#dim').bind('touchmove', handler);
			$('#dim').click(function(){
				$('#dim').unbind('touchmove', handler);
				$('.headerWrap').css({'position': 'fixed'});
				$('.container').css({'margin-top': '84px'});
				$('#mWrap').animate({ left: "0"}, 300, "easeOutExpo");
				$('html,body').css({'overflow':'visible','width':'auto','height':'auto'});
				$('.sideWrap').css({'overflow':'visible','height':'auto'});
				$('.depth2').hide().animate({left: "300px"}, 300, "easeOutExpo");
				$('.depth2List').css({'height': 'auto'});
				$('.btnUserSetting').show();
				$('#dim').remove();
			});
			return false;
		});
		$(window).resize(function(){

			$('.visual .swiper-slide').width($(window).width());
			$('#mWrap').animate({ left: "0"}, 300, "easeOutExpo");
			$('html,body').css({'overflow':'visible','width':'auto','height':'auto'});
			$('.sideWrap').css({'display':'none','overflow':'visible','height':'auto'});
			$('.depth2').hide().animate({left: "268px"}, 300, "easeOutExpo");
			$('.depth2List').css({'height': 'auto'});
			$('#dim').remove();
		});

		/* 20160218 수정 */
		$('.depth1 li a').on("click",function() {
			console.log("1");
			var cate_id = $(this).attr('data-cate');
			$('.depth2').animate({left: "0"}, 300, "easeOutExpo");
			$("#"+cate_id).show();
			return false;
		});
		$('#btnSubClose').click(function(){
			console.log("2");
			$('.depth2').animate({left: "268px"}, 300, "easeOutExpo");
			$('.depth2 .sub').hide();
			return false;
		});
		/* //20160218 수정 */

		// footer 버튼
		$("#ftrBtn").find("dt > a").on("click",function() {
			if($(this).parent().parent().hasClass("on") == true){
				$(this).parent().parent().removeClass("on");
			} else {
				$("#ftrBtn").find("dl").removeClass("on");
				$(this).parent().parent().addClass("on");
			};
			return false;
		});

		//위로
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() < 100) $('.btnTop').hide();
			else $('.btnTop').show();
		});
		$('.btnTop').on("click",function() {
			$('html,body').animate({scrollTop: 0},600);
		});

		//공지사항
		$('.noticeList li a').on("click",function(e) {
			if($(this).next('div').length > 0){
				e.preventDefault();
				var subNav = $(this).next('div');
				if (subNav.is(':visible')){
					 subNav.slideUp(400)
					 $(this).removeClass('active');
				}else{
					 $('.noticeList div').slideUp(400);
					 subNav.slideDown(400);
					 $('.noticeList li a').removeClass('active');
					 $(this).addClass('active');
				}
			};
		});

		//switch button
		$('.switch').on("click",function(e) {
			$(this).toggleClass("switchOn");
			$(this).parent().find('em').hide();
			if($(this).parent().find('input').is(":checked")){
				$(this).parent().find('.no').show();
			}else{
				$(this).parent().find('.ok').show();
			}
		});



	}
};

shodoc.headerFixed	= {
	init:function(){
		var	headerFixed	= this;
		headerFixed.ui();
	},
	ui:function(){
		var didScroll;
		var lastScrollTop = 0;
		var delta = 5;
		var navbarHeight = $('.headerWrap').outerHeight();

		$(window).scroll(function(event){
			didScroll = true;
		});

		setInterval(function() {
			if (didScroll) {
				hasScrolled();
				didScroll = false;
			}
		}, 250);

		function hasScrolled() {
			var st = $(this).scrollTop();
			
			if(Math.abs(lastScrollTop - st) <= delta)
				return;
			
			if (st > lastScrollTop && st > navbarHeight){
				// Scroll Down
				$('.headerWrap').removeClass('down').addClass('up');
				$('.titList').hide();
				$('.cateNames .target').data("show","yes");
			} else {
				// Scroll Up
				if(st + $(window).height() < $(document).height()) {
					$('.headerWrap').removeClass('up').addClass('down');
					$('.titList').hide();
					$('.cateNames .target').data("show","yes");
				}
			}
			
			lastScrollTop = st;
		}


	}
};
$(function(){
	shodoc.init();
});


//layer open
var layerDim = 'layerDim';
var layerHandler = function(e) { e.preventDefault();}
function showModal(modalID) {
	var layer = "#" + modalID;
	var layer_bg = $('<div id="' + layerDim + '" ></div>');

	$('.layer .scrollIn').css({'max-height':$(window).height() - 180});
	$('.layer .scrollIn2').css({'max-height':$(window).height() - 50});
	$(layer).addClass('open');
	$(layer).css('z-index','9999');
	$(layer).css("top", Math.max(0, (($(window).height() - $(layer).height()) / 2) ) + "px");
	$(layer).css("left", Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px");
	$(layer_bg).css({'overflow':'hidden','width':$(window).width(),'height':$(window).height()});
	if(layer == "#addDown"){
		$(layer_bg).appendTo('body').css({'width': '100%', 'height': '100%', 'display': 'none', 'background-color': '#000', 'filter':'alpha(opacity=60)', 'position': 'fixed', 'top': 0, 'left': 0, 'z-index': 998}).fadeTo('fast', 0.6);
	}else{
		$(layer_bg).appendTo('body').css({'width': '100%', 'height': '100%', 'display': 'none', 'background-color': '#000', 'filter':'alpha(opacity=30)', 'position': 'fixed', 'top': 0, 'left': 0, 'z-index': 998}).fadeTo('fast', 0.3);
	};

	if(layer == "#zzimMore"){
	}else{
		$('html,body').css({'overflow':'hidden','width':$(window).width(),'height':$(window).height()});
	}
	$(window).resize(function(){
		$('.layer .scrollIn').css({'max-height':$(window).height() - 180});
		$('.layer .scrollIn2').css({'max-height':$(window).height() - 100});
		$(layer).css("top", Math.max(0, (($(window).height() - $(layer).height()) / 2)) + "px");
		$(layer).css("left", Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px");
	});

	/* 20160302수정 */
//	$("#" + layerDim).click(function(){
//		$(layer).hide();
//		$(this).remove();
//		$(layer).removeClass('open');
//		$('html,body').css({'overflow':'','width':'','height':''});
//	});
	/* //20160302수정 */
}

//layer close
function hideModal(modalID) {
	$('html,body').css({'overflow':'','width':'','height':''});
	$("#" + modalID).removeClass('open');
	$("#" + layerDim).remove();
}



