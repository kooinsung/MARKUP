var Absolute = (typeof Absolute === 'undefined') ? {}	: console.log('......');

Absolute.menu = {
	init:function(){
		Absolute.menu.hover();
		Absolute.menu.out();
		Absolute.menu.fixed();
	},
	hover:function(){
		$('.depth1 h2 a').mouseenter(function(){
			var num = $('.depth1 h2 a').index($(this));
			$('.depth1 h2 a, .depth2 .menus > li').removeClass('active');
			$(this).addClass('active');
			if(num == 2){
				$('.depth2, .menus').hide();
				$('.depth2, .prds').show();
			}else{
				$('.depth2, .prds').hide();
				$('.depth2, .menus').show();
			}
			$('.depth2 .menus > li').eq(num).addClass('active');
		});
		
		$('.depth2 .menus > li').mouseenter(function(){
			var num = $('.depth2 .menus > li').index($(this));
			$('.depth1 h2 a, .depth2 .menus > li').removeClass('active');
			$(this).addClass('active');
			
			$('.depth1 h2 a').eq(num).addClass('active');
		});
	},
	out:function(){
		$('.header .outer').mouseleave(function(){
			$('.depth1 h2 a, .depth2 .menus > li').removeClass('active');
			$('.depth2, .menus, .prds').hide();
		});
	},
	fixed:function(){
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() > $('.header').offset().top){
				$('.header .outer').addClass('fixed');
			}else {
				$('.header .outer').removeClass('fixed');
			} 
		});
	}
};

Absolute.family = {
	init:function(){
		Absolute.family.toggle();
		Absolute.family.link();
	},
	toggle:function(){
		$('.familySite .target a').toggle(function() { 
			$(this).closest('.familySite').find('.sites').slideDown('fast');
		}, function() {
			$(this).closest('.familySite').find('.sites').slideUp('fast');
		});
	},
	link:function(){
		$('.familySite .sites a').click(function(e){
			var href=$(this).attr('href');
			$('.familySite .sites').hide();
			window.open(href, "_blank");
			e.preventDefault();
		})
	}
};

Absolute.topBanner = {
	close:function(){
		$('.topBanner button').click(function(){
			$('.topBanner').slideUp();
		});
	}
};

Absolute.move = {
	top:function(){
		$(window).bind('scroll', function () {
			if($(window).scrollTop() < 500){
				$('.btnTop').fadeOut();
			}else{
				$('.btnTop').fadeIn();
			}
		});
		$('.btnTop a').click(function(){
			$("html, body").animate({ scrollTop: 0 }, "fast");
			return false;
		});
	}
};

Absolute.layer = {
	open:function(modalID){
		var dim = 'dim';
		var layer = "#" + modalID;
		var bg = $('<div class="' + dim + '" ></div>');
		var popupMarginTop = $(layer).height() / 2;
		var popupMarginLeft = $(layer).width() / 2;

	$(layer).css({
		'left': '50%',
		'top': '50%',
		'margin-top': -popupMarginTop,
		'margin-left': -popupMarginLeft
	}).fadeIn('fast');


/*
		if($('.layerResult.long').is(':visible')){
			$("html, body").animate({ scrollTop: Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop())}, "slow");
		}
*/
		if($('.layerAuthentic').is(':visible')){
			$('#layerRolling').bxSlider();
		}

		$(bg).appendTo('body').fadeIn('fast');
		$('body, html').css({
			'height': $(window).height(),
			'overflow': 'hidden'
		})
		$(window).resize(function(){
			$(layer).css({
				'left': '50%',
				'top': '50%',
				'margin-top': -popupMarginTop,
				'margin-left': -popupMarginLeft
			});
		});
	},
	hide:function(modalID){
		$('#' + modalID).hide();
		$('.dim').remove();
		$('body, html').css({
			'height': $(window).height(),
			'overflow': ''
		})
	},
	aco:function(){
		$('.aco .target').bind("click",function(e) {
			if($(this).next('div').length > 0){
				e.preventDefault();
				var depth = $(this).next('div');
				if (depth.is(':visible')){
					depth.slideUp(400)
					$(this).removeClass('active');
				}else{
					$('.aco .depth').slideUp(400);
					depth.slideDown(400);
					$('.aco .target').removeClass('active');
					$(this).addClass('active');
				}
			};
		});
	}
};

$(function(){
	Absolute.move.top();
	Absolute.menu.init();
	Absolute.family.init();
	Absolute.layer.aco();
	Absolute.topBanner.close();
});


