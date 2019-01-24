var Absolute = (typeof Absolute === 'undefined') ? {}	: console.log('......');

Absolute.menu = {
	init:function(){
		Absolute.menu.show();
		Absolute.menu.hide();
		Absolute.menu.aco();
	},
	show:function(){
		var menuDim = 'menuDim';
		var bg = $('<div class="' + menuDim + '" ></div>');
		$('.btnMenuToggle').on('click',function() {
			$('.menu').fadeIn();
			$("html, body").animate({ scrollTop:0}, "fast");
			$(bg).appendTo('body').fadeIn('fast');
		});
	},
	hide:function(){
		$('.btnMenuClose').on('click',function() {
			$('.menu').fadeOut();
			$('.menuDim').remove();
		});
	},
	aco:function(){
	  $('.menuList > ul > li > a').on('click',function(e) {
			if($(this).next('div').length > 0){
				e.preventDefault();
				var subNav = $(this).next('div');
				if (subNav.is(':visible')){
					 subNav.slideUp('fast')
					 $(this).removeClass('active'); 
				}else{
					 $('.menuList .sub').slideUp('fast');
					 subNav.slideDown('fast');
					 $('.menuList > ul > li > a').removeClass('active');
					 $(this).addClass('active');
				}
		   };
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

Absolute.loca = {
	menu:function(){
	  $('.customerSel .target a').on('click',function(e) {
			if($(this).parent().next('ul').length > 0){
				e.preventDefault();
				var subNav = $(this).parent().next('ul');
				if (subNav.is(':visible')){
					 subNav.slideUp('fast')
				}else{
					 $('.customerSel ul').slideUp('fast');
					 subNav.slideDown('fast');
				}
		   };
	  });

	}
};

Absolute.family = {
	link:function(){
	  $('#familySite').on('change', function () {
		var url = $(this).val();
		if (url) {
			window.open(url, 'site', 'site');
		}
		return false;
	  });
	}
};

Absolute.input = {
	keyup:function(){
		$('.customerInput input').bind('keyup', function(){
			if($(this).val().length > 0) {
				$(this).parent().addClass('active');
			} else {
				$(this).parent().removeClass('active');
			}
		});
		$('.customerInput input').each(function(){
			if($(this).val().length > 0) {
				$(this).parent().addClass('active');
			} else {
				$(this).parent().removeClass('active');
			}
		});

	}
};


Absolute.layer = {
	open:function(modalID){
		var dim = 'dim';
		var layer = "#" + modalID;
		var bg = $('<div class="' + dim + '" ></div>');

		$(layer).css({
			'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
			'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
		}).fadeIn('fast');

		$("html, body").animate({ scrollTop: Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop())}, "fast");

		$(bg).appendTo('body').fadeIn('fast');
		$(window).resize(function(){
			$(layer).css({
				'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
				'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
			});
		});
	},
	hide:function(modalID){
		$('#' + modalID).hide();
		$('.dim').remove();
	}
};
$(function(){
	Absolute.menu.init();
	Absolute.move.top();	
	Absolute.family.link();
	Absolute.loca.menu();
	Absolute.input.keyup();
});


