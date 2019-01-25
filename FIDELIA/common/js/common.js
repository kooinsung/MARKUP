$(document).ready(function(){

	// 이미지 롤오버
	$('img.rollover').each(function() {
	 $(this).mouseover(function() {
	  if ($(this).attr('src').match('_off')) {
	   $(this).css('cursor', 'pointer');
	   $(this).attr('src', $(this).attr('src').replace('_off', '_on'));
	   $(this).mouseout(function() {
		$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
	   });
	  }
	 });
	});


	// GNB
	$('.gnb>ul>li>a').each(function(){
		$(this).mouseenter(function(){
			$('.gnb ul li').css({'height':'40px'});

			$(this).parent().find('div').css({'display':'block'});
			$('.gnb>ul>li>a>img').each(function(){
				$(this).attr('src', $(this).attr('src').replace('_on.png', '_off.png'));
			});
			$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_off.png', '_on.png'));
		});
	});
	$('.gnb>ul>li').mouseleave(function(){
		$('.gnb ul>li').css({'height':'40px'});
		$(this).parent().find('div').css({'display':'none'});
		$('.gnb>ul>li>a>img').each(function(){
			$(this).attr('src', $(this).attr('src').replace('_on.png', '_off.png'));
		});
	});


	// media
	$('.UpMenus > li').children('ol:first').animate({height:'280px'},400);
	$('.UpMenus > li:first').addClass('active');
	$('#media01').fadeIn();
	/*
	$('.UpMenus > li').click(function(){
		var ol = $(this).children('ol');
		var h = ol.height()?0:ol.children('li').length*280;
		var d = 0;
		ol.parent().parent().children('li').each(function(){
			if (d) {
				$(this).children('ol').animate({height:'0px'},400,function(){$(this).removeClass('Up');});
				$(this).animate({top:'0px'},400);
				$(this).removeClass('active');
			} else if (!$(this).is(ol.parent())) {
				$(this).children('ol').animate({height:'0px'},400,function(){$(this).removeClass('Up');});
				$(this).animate({top:(h?-h:'0')+'px'},400);
				$(this).removeClass('active');
			} else {
				ol.animate({height:h+'px'},400);
				$(this).animate({top:'0px'},400,function(){if(!h){ol.removeClass('Up')}});
				d = 1;
				$(this).addClass('active');
			}
		});
	});

	$('#mediaList01').click(function(){
			$('#media01').show();
			$('#media02,#media03,#media04,#media05,#media06').hide();
			$('#media01 .tabMenu li a:first').click();
	});
	$('#mediaList02').click(function(){
			$('#media02').show();
			$('#media01,#media03,#media04,#media05,#media06').hide();
			$('#media02 .tabMenu li a:first').click();
	});
	$('#mediaList03').click(function(){
			$('#media03').show();
			$('#media02,#media01,#media04,#media05,#media06').hide();
			$('#media03 .tabMenu li a:first').click();
	});
	$('#mediaList04').click(function(){
			$('#media04').show();
			$('#media02,#media03,#media01,#media05,#media06').hide();
			$('#media04 .tabMenu li a:first').click();
	});
	$('#mediaList05').click(function(){
			$('#media05').show();
			$('#media02,#media03,#media04,#media01,#media06').hide();
			$('#media04 .tabMenu li a:first').click();
	});
	$('#mediaList06').click(function(){
			$('#media06').show();
			$('#media02,#media03,#media04,#media05,#media01').hide();
			$('#media05 .tabMenu li a:first').click();
	});
2014-05-22 42~95라인 주석처리*/
	//product
/*
	$(window).load(function(){
		var lastId,
			topMenu = $("#top-menu"),
			topMenuHeight = topMenu.outerHeight()+15,
			menuItems = topMenu.find("a"),
			scrollItems = menuItems.map(function(){
				var item = $($(this).attr("href"));
				if (item.length) { return item; }
			});
		menuItems.click(function(e){
			var href = $(this).attr("href"),
					offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
			$('html, body').stop().animate({ 
					scrollTop: offsetTop
			}, 300);
			e.preventDefault();
		});
		$(window).scroll(function(){
			 var fromTop = $(this).scrollTop()+topMenuHeight;
			 var cur = scrollItems.map(function(){
				 if ($(this).offset().top < fromTop)
					 return this;
			 });
			 cur = cur[cur.length-1];
			 var id = cur && cur.length ? cur[0].id : "";
			 if (lastId !== id) {
					 lastId = id;
					 menuItems.parent().removeClass("active").end().filter("[href=#"+id+"]").parent().addClass("active");
			 }
		});
	});

*/

	$("#tabSection > div").hide().filter("div:first").show();
	$('#tabSection h4 a').bind("click",function(){
		var Num = $("#tabSection h4 a").index($(this));
		$("#tabSection h4 a img").each(function(){
			$(this).attr("src", $(this).attr("src").replace("_on.", "_off."));
		});
		$(this).find("img").attr("src", $(this).find("img").attr("src").replace("_off.", "_on."));
		$("#tabSection > div").hide();
		$($("#tabSection > div")[Num]).show();
		return false;
	});
});