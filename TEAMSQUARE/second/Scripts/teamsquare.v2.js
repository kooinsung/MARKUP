var	teamSquare = (typeof teamSquare === 'undefined') ? {}	: console.log('......');

teamSquare	= {
	init:function(){
		var	h;
		h =	this;
		h.common.init();
	}
};

teamSquare.common	= {
	init:function(){
		var	common	= this;
		common.ui();
	},
	ui:function(){
		//말줄임
		$(".ellipsis").dotdotdot();
		
		//customer input
		$(":file").jfilestyle({input: false});

		//메뉴
		$('#btnMenu').on("click",function(e) {
			e.preventDefault();
			if($(this).data("show")=="no") {
				//닫힘
				$('.menuLayer').slideUp();
				$('.header, #btnMenu').removeClass('active');
				$('.menuLayer li').css('opacity','0');
				$(this).data("show","yes");
			}else{
				//열림
				$(this).addClass('active');
				$('.header').addClass('active');
				$('.srchLayer').hide();
				$('.hiddenItem').css('opacity','0');
				$('#btnSrch').removeClass('active');
				$('.menuLayer').slideDown(function(){
					var eT=0;
					$('.menuLayerIn li').each(function(index){
						$(this).delay(eT).animate({opacity: 1 }, 500 );
						eT += 70;
					});
					//$("html, body").animate({ scrollTop:0 }, "slow");
				});
				$(this).data("show","no");
				$('#btnSrch').data("show","yes");
			}
		});
		$('.btnLayerClose').click(function(){
			$(this).parent().parent().slideUp();
			$('.header, #btnMenu').removeClass('active');
			$('.menuLayer li').css('opacity','0');
			$('#btnMenu').data("show","yes");
		});

		//search
		nickname = $('#nickname').bxSlider({
			controls:false
		});
		$('#btnSrch').on("click",function(e) {
			e.preventDefault();
			if($(this).data("show")=="no") {
				//닫힘
				$('.srchLayer').slideUp();
				$('.header, #btnSrch').removeClass('active');
				$('.hiddenItem').css('opacity','0');
				$(this).data("show","yes");
				
			}else{
				//열림
//				var w = $(window).width();
//				var db = document.body;
//				var dde = document.documentElement;
//				var docHeight = Math.max(db.scrollHeight, dde.scrollHeight, db.offsetHeight, dde.offsetHeight, db.clientHeight, dde.clientHeight) + 120;
//				$('.srchLayer').height(docHeight);
				$(this).addClass('active');
				$('.header').addClass('active');
				$('#btnMenu').removeClass('active');
				$('.menuLayer').slideUp();
				$('.menuLayer li').css('opacity','0');
				$('.srchLayer').slideDown(function(){
					var eT=0;
					$('.hiddenItem').each(function(index){
						$(this).delay(eT).animate({opacity: 1 }, 500 );
						eT += 70;
					});
					//$("html, body").animate({ scrollTop:0 }, "slow");
					nickname.reloadSlider();
				});
				$(this).data("show","no");
				$('#btnMenu').data("show","yes");
			}
		});


//		$('#btnSrch').on("click",function(e) {
//			e.preventDefault();
//			//열림
////			var w = $(window).width();
////			var db = document.body;
////			var dde = document.documentElement;
////			var docHeight = Math.max(db.scrollHeight, dde.scrollHeight, db.offsetHeight, dde.offsetHeight, db.clientHeight, dde.clientHeight) + 120;
////			$('.srchLayer').height(docHeight);
//			$(this).addClass('active');
//			$('.header').addClass('active');
//			$('#btnMenu').removeClass('active');
//			$('.menuLayer').slideUp();
//			$('.menuLayer li').css('opacity','0');
//			$('.srchLayer').slideDown(function(){
//				var eT=0;
//				$('.hiddenItem').each(function(index){
//					$(this).delay(eT).animate({opacity: 1 }, 500 );
//					eT += 70;
//				});
//				//$("html, body").animate({ scrollTop:0 }, "slow");
//				nickname.reloadSlider();
//			});
//			$('#btnMenu').data("show","yes");
//		});
		$('.btnSrchLayerClose').click(function(){
			$(this).parent().parent().slideUp();
			$('.header, #btnSrch').removeClass('active');
			$('.hiddenItem').css('opacity','0');
			$('#btnSrch').data("show","yes");
			
			//0228 수정
			$('.menuLayer').show();
			$('.menuLayer li').css('opacity','1');
			//0228 수정
			
		});

		//search tab
		$('.srchTabs a').bind("click",function(){
			var num = $('.srchTabs a').index($(this));
			$('.srchTabs a').removeClass('active');
			$(this).addClass('active');
			$('.srchTabConts > div').hide();
			$($('.srchTabConts > div')[num]).show();	
			nickname.reloadSlider();
			return false;
		});

		//기대보상 tab
		$('.rewardTabs button').bind("click",function(){
			var num = $('.rewardTabs button').index($(this));
			$('.rewardTabs li').removeClass('active');
			$(this).parent().addClass('active');
			$('.rewardWrite > div').hide();
			$($('.rewardWrite > div')[num]).show();	
			return false;
		});

		//cateagory
		$('.btnViewCate').on("click",function(e) {
			e.preventDefault();
			if($(this).data("show")=="no") {
				//닫힘
				$(this).find('i').removeClass('active');
				$('.questCate div').slideUp();
				$('.questCate li').css('opacity','0');
				$(this).data("show","yes");
			}else{
				//열림
				$(this).find('i').addClass('active');
				$('.questCate div').slideDown(function(){
					var eT=0;
					$('.questCate li').each(function(index){
						$(this).delay(eT).animate({opacity: 1 }, 500 );
						eT += 70;
					});
				});
				
				$(this).data("show","no");
			}
		});

		//quest cate select
		$('#btnCateSel').on("click",function(e) {
			e.preventDefault();
			if($(this).data("show")=="no") {
				//닫힘
				$(this).find('i').removeClass('active');
				$(this).parent().parent().siblings('ul').slideUp('fast');
				$(this).data("show","yes");
			}else{
				//열림
				$(this).find('i').addClass('active');
				$(this).parent().parent().siblings('ul').slideDown('fast');
				$(this).data("show","no");
			}
		});
		$('input[name=cateSel]').click(function(){
			var cateName = $(this).siblings('label').text();
			$('.btnCateSel button').html(cateName + '<i class="icons iconArrow active"></i>');
		});

		//etc
		$('.keyWordList li:even a').css('margin-right','10px');
		$('.keyWordList li:odd a').css('margin-left','10px');


		//quest write
		$('#btnWrite').on("click",function(e) {
			e.preventDefault();
			var h = $(window).height();
			$('html, body').css({'overflow':'hidden','':'', 'height':h})
			$('.questWriteLayer').css('overflow-y','scroll');
			$('.questWriteLayer').fadeIn();
		});

		$('.btnFixWrite').on("click",function(e) {
			e.preventDefault();
			var h = $(window).height();
			$(this).fadeOut();
			$('html, body').css({'overflow':'hidden','':'', 'height':h})
			$('.questWriteLayer').css('overflow-y','scroll');
			$('.questWriteLayer').fadeIn();
		});

		$('.btnPageClose').on("click",function() {
			var w = $(window).width();

			if(w > 640) $('.btnFixWrite').fadeIn();
			else $('.btnFixWrite').fadeOut();

			$('html, body').css({'overflow':'visible', 'height':'auto'})
			$('.questWriteLayer, .questViewLayer').fadeOut();
		});

		//quest view
		$('.questList .lists li > a').on("click",function(e) {
			e.preventDefault();
			var h = $(window).height();
			$('html, body').css({'overflow':'hidden','':'', 'height':h})
			$('.questViewLayer').css({'overflow-y':'scroll'});
			$('.questViewLayer').fadeIn();
		});

		//teammate view
		$('.recomTeamMateList .lists li a').on("click",function(e) {
			e.preventDefault();
			var h = $(window).height();
			$('html, body').css({'overflow':'hidden','':'', 'height':h})
			$('.questViewLayer').css({'overflow-y':'scroll'});
			$('.questViewLayer').fadeIn();
		});

		//switch button
		$('.switch').on("click",function(e) {
			$(this).toggleClass("switchOn");
		});

		//accordion
		$('.faqList > li > a').on("click",function(e) {
			if($(this).next('div').length > 0){
				e.preventDefault();
				var subNav = $(this).next('div');
				if (subNav.is(':visible')){
					subNav.slideUp(400)
					$(this).removeClass('active');
					$(this).find('i').removeClass('active');
				}else{
					$('.faqList div').slideUp(400);
					subNav.slideDown(400);
					$('.faqList > li > a').removeClass('active');
					$('.iconLinkToggle').removeClass('active');
					$(this).addClass('active');
					$(this).find('i').addClass('active');
				}
			};
		});

		$('.addbtms button').on("click",function() {
			$('.addbtms button').removeClass('active');
			$(this).addClass('active');
		});
	}
};


$(window).on("orientationchange load resize", function () {
	var w = $(window).width();
	if($('.menuLayer').is(':visible')){
		if(w < 640){
			$('.header').removeClass('active');
		}else{
			$('.header').addClass('active');
		}
	}else if($('.srchLayer').is(':visible')){
		$('.header').addClass('active');
		if(w > 640){
			$('.menuLayer').hide();
			$('.menuLayer li').css('opacity','0');
		}else{
			$('.menuLayer').show();
			$('.menuLayer li').css('opacity','1');
		}
	}else{
		$('.header').removeClass('active');
	};

});

$(window).scroll(function() {
	var w = $(window).width();
	if(w < 640){
		if ($(this).scrollTop() > 1){  
			$('.timelineTop, .timelineTop2').addClass("scroll");
			$('.timelineTop').css('height','auto');
		}else{
			$('.timelineTop, .timelineTop2').removeClass("scroll");
			$('.timelineTop').css('height','235px');
		}
	}
});

$(function(){
	teamSquare.init();
});

//modal open
var dim = 'dim';
var handler = function(e) { e.preventDefault();}
function showModal(modalID) {
	var layer = "#" + modalID;
	var layer_bg = $('<div id="' + dim + '" ></div>');

	$(layer).css("top", Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px");
	$(layer).css("left", Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px");
	$(layer).fadeIn('fast');
	$(layer_bg).appendTo('body');
	$(layer_bg).css({'width': '100%', 'height': '100%', 'display': 'none', 	'background-color': '#000', 	'filter':'alpha(opacity=50)', 'position': 'fixed', 'top': 0, 'left': 0, 'z-index': 998});
	$(layer_bg).fadeTo('fast', 0.5);
	$(window).resize(function(){
		//$(layer).css("top", Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px");
		$(layer).css("left", Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px");
	});
	if($('#share').is(':visible')){
		//$('#detailMod').hide();
		//$('#dim').remove();
		//followList.reloadSlider();
	};
	if($('#sendReport').is(':visible')){
		$('#detailMod').hide();
		$('#commentSetting').hide();
		$('#dim').remove();
		followList.reloadSlider();
	};
	if($('.questViewLayer').is(':visible')){
		$('html, body').css({'overflow':'visible', 'height':'auto'});
		$('.questViewLayer').css({'overflow-y':'visible'});
	};

	$("#" + dim).click(function(){
		$(layer).hide();
		$(this).remove();
		$('body').unbind('touchmove', handler);
	});

	$('body').bind('touchmove', handler);

}

//modal close
function hideModal(modalID) {
	$("#" + modalID).fadeOut('fast');
	$("#" + dim).remove();
	$('body').unbind('touchmove', handler);
	//$('.addbtms button').removeClass('active');
}

