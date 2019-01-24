var AbsoluteDefault = (typeof AbsoluteDefault === 'undefined') ? {}	: console.log('......');

AbsoluteDefault.details = {
	rolling:function(){
		$('#imgBigs').bxSlider();
	},
	scrolling:function(){
		var sections = $('.detailSection'), nav = $('.content.details .detailsTabs'), navHeight = nav.outerHeight() + 134;
		nav.find('a').on('click', function () {
		var $el = $(this), id = $el.attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 134
		}, 500);
		return false;
		});
		$(window).bind('scroll', function () {
			var currentPos = $(this).scrollTop();
		
			sections.each(function() {
			var top = $(this).offset().top - navHeight,
				bottom = top + $(this).outerHeight();
		 
			if(currentPos >= top && currentPos <= bottom) {
				nav.find('a').removeClass('active');
				sections.removeClass('active');
		 
				$(this).addClass('active');
				nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
			}
		  });
		});
	},
	fixed:function(){
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() > $('.detailsView').offset().top){
				$('.content.details .detailsTabs').addClass('fixed');
			}else {
				$('.content.details .detailsTabs').removeClass('fixed');
			} 
		});
	}
};

AbsoluteDefault.introduce = {
	init:function(){
		AbsoluteDefault.introduce.scrolling();
		AbsoluteDefault.introduce.fixed();
		AbsoluteDefault.introduce.map();
	},
	scrolling:function(){
		var sections = $('.sectionBox'), nav = $('.content.introduce .tabs1'), navHeight = nav.outerHeight() + 124;
		nav.find('a').on('click', function () {
		var $el = $(this), id = $el.attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 124
		}, 500);
		return false;
		});
		$(window).bind('scroll', function () {
			var currentPos = $(this).scrollTop();
		
			sections.each(function() {
			var top = $(this).offset().top - navHeight,
				bottom = top + $(this).outerHeight();
		 
			if(currentPos >= top && currentPos <= bottom) {
				nav.find('a').removeClass('active');
				sections.removeClass('active');
		 
				$(this).addClass('active');
				nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
			}
		  });
		});
	},
	fixed:function(){
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() > $('.content.introduce').offset().top){
				$('.content.introduce .tabs1').addClass('fixed');
			}else {
				$('.content.introduce .tabs1').removeClass('fixed');
			} 
		});
	},
	map:function(){
		$('.factoryList li a').bind("click",function(){
			var num = $('.factoryList li a').index($(this));
			$(this).addClass('acitve');
			$('.factoryView li').fadeOut();
			if($($('.factoryView li')[num]).is(':visible')){
				$('.factoryView li').fadeOut();
			}else{
				$($('.factoryView li')[num]).fadeIn();
			}
			return false;
		});
	}
};

AbsoluteDefault.brand = {
	init:function(){
		AbsoluteDefault.brand.scrolling();
		AbsoluteDefault.brand.fixed();
	},
	scrolling:function(){
		var sections = $('.sectionBox'), nav = $('.content.brandIntro .tabs1'), navHeight = nav.outerHeight() + 124;
		nav.find('a').on('click', function () {
		var $el = $(this), id = $el.attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 124
		}, 500);
		return false;
		});
		$(window).bind('scroll', function () {
			var currentPos = $(this).scrollTop();
		
			sections.each(function() {
			var top = $(this).offset().top - navHeight,
				bottom = top + $(this).outerHeight();
		 
			if(currentPos >= top && currentPos <= bottom) {
				nav.find('a').removeClass('active');
				sections.removeClass('active');
		 
				$(this).addClass('active');
				nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
			}
		  });
		});
	},
	fixed:function(){
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() > $('.content.brandIntro').offset().top){
				$('.content.brandIntro .tabs1').addClass('fixed');
			}else {
				$('.content.brandIntro .tabs1').removeClass('fixed');
			} 
		});
	}
};

AbsoluteDefault.lab = {
	mainFixed:function(){
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() > $('.content.labIntro').offset().top){
				$('.content.labIntro .tabs1').addClass('fixed');
			}else {
				$('.content.labIntro .tabs1').removeClass('fixed');
			} 
		});
	},
	subFixed:function(){
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() > $('.content.lab').offset().top){
				$('.content.lab .tabs1').addClass('fixed');
			}else {
				$('.content.lab .tabs1').removeClass('fixed');
			} 
		});
	}
};

AbsoluteDefault.event = {
	fixed:function(){
		$(window).bind('scroll', function () {
			if( $(window).scrollTop() > $('.content.event').offset().top){
				$('.content.event .tabs1').addClass('fixed');
			}else {
				$('.content.event .tabs1').removeClass('fixed');
			} 
		});
	}
};

AbsoluteDefault.radio = {
	check:function(){
		 $('.customerRadio button').bind('click', function(){
			 $(this).closest('ul').find('button').removeClass('active');
			 $(this).addClass('active');
			 $(this).siblings('input').prop('checked',true);
		 });

		 $('.customerCheck button').bind('click', function(){
			 if($(this).siblings('input').prop('checked')){
				 $(this).removeClass('active');
				 $(this).siblings('input').prop('checked',false);
			 }else{
				 $(this).addClass('active');
				 $(this).siblings('input').prop('checked',true);
			 };
		 });
	}
};

AbsoluteDefault.input = {
	keyup:function(){
		$('.customerInput input').bind('keyup', function(){
			if($(this).val().length > 0) {
				$(this).parent().parent().addClass('active');
			} else {
				$(this).parent().parent().removeClass('active');
			}
		});
		$('.customerInput input').each(function(){
			if($(this).val().length > 0) {
				$(this).parent().parent().addClass('active');
			} else {
				$(this).parent().parent().removeClass('active');
			}
		});

	}
};


$(function(){
	if ( $('.content.introduce').length != 0 ){
		AbsoluteDefault.introduce.init();
	}
	if ( $('.questions').length != 0 ){
		AbsoluteDefault.radio.check();
		AbsoluteDefault.input.keyup();
	}
	if ( $('.imgBigs').length != 0 ){
		AbsoluteDefault.details.rolling();
	}
	if ( $('.detailSection').length != 0 ){
		AbsoluteDefault.details.scrolling();
		AbsoluteDefault.details.fixed();
	}
	if ( $('.content.brandIntro').length != 0 ){
		AbsoluteDefault.brand.init();
	}
	if ( $('.content.labIntro').length != 0 ){
		AbsoluteDefault.lab.mainFixed();
	}
	if ( $('.content.lab').length != 0 ){
		AbsoluteDefault.lab.subFixed();
	}
	if ( $('.content.event').length != 0 ){
		AbsoluteDefault.event.fixed();
	}

		

	

});

