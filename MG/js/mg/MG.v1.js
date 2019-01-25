var	MG = (typeof MG === 'undefined') ? {}	: console.log('......');

MG.common = {
	ui:function(){
		//약관 박스
		var wh = $(window).height();
		var boxh = (wh - 200) / 2;
		$('.detailPolicy .box').height(boxh);
		$('.detailPolicy .text').height(boxh-80);
	}
};

MG.lnb = {
	//좌측 메뉴
	slide:function(){
		var panel = $('.lnb').mobileSideMenu({
			leftZoneWidth:200,
			allowOverlay: true,
			content: $('.wrap')
		});

		$('.btnLnbClose').click(function(){
			panel.close();
		});

		$('.btnMenu').click(function(){
			panel.open();
		});

		panel.bind('isOpened isClosed', function(evt){
			if(panel.isOpened){
				$('body').addClass('lnbView');
			}else{
				$('body').removeClass('lnbView');
			};
		});

		$('.nav .sub > a').on("click",function(e) {
			if($(this).next('ul').length > 0){
				e.preventDefault();
				var sub = $(this).next('ul');
				if (sub.is(':visible')){
					sub.slideUp(400)
					$(this).removeClass('active');
				}else{
					$('.depth2').slideUp(400);
					$('.nav .sub > a').removeClass('active');
					$(this).addClass('active');
					sub.slideDown(400);
				}
			};
		});
	}
};

MG.dateFixed = {
	//리스트 날짜 고정  /*20160513 수정*/
	scroll:function(){
		var target = $('.date');
		$('.date span').removeClass('active');
		$(window).on('scroll', function(){
			var st = $(this).scrollTop() + 57;
			$(target).each(function(){
				var offset = $(this).offset().top;
				if(st > offset){
					$(this).find('span').addClass('active');
				}else{
					$(this).find('span').removeClass('active');
				}	
			});
		});
	}
};

MG.faq = {
	//faq
	toggle:function(){
		$('.faqTit').on('click',function(e) {
			var offset = $(this).offset().top - 140
			if($(this).next('div').length > 0){
				e.preventDefault();
				var subNav = $(this).next('div');
				if (subNav.is(':visible')){
					 subNav.slideUp('fast')
					 $(this).removeClass('active');
				}else{
					 $('.faqLists div').slideUp('fast');
					 subNav.slideDown('fast');
					 $('.faqTit').removeClass('active');
					 $(this).addClass('active');
					 $("html, body").animate({ scrollTop:offset }, "fast");
				}
			};
		 });
	}
};

MG.viewText = {
	//내용 확장
	view:function(){
		var text = $('.listLoop li');
		text.each(function(){
			var textNum = $(this).find('.colum4 p').text().length;
			if(textNum > 34){
				$(this).find('.btnViewText').show();
				$(this).find('p').addClass('open');
			}else{
				$(this).find('.btnViewText').hide();
				$(this).find('p').removeClass('open');
			}
		});
		
		$('.btnViewText').on("click",function(e) {
			e.preventDefault();
			if($(this).data("show")=="no") {
				$(this).siblings('p').removeClass('close');
				$(this).html('<button type="button" >상세보기<i class="mg iconViewText"></i></button>');
				$(this).data("show","yes");
			}else{
				$(this).siblings('p').addClass('close');
				$(this).html('<button type="button" >상세닫기<i class="mg iconViewText toggle"></i></button>');
				$(this).data("show","no");
			};
		});
	}
};

MG.topMove = {
	//top
	move:function(){
		$(window).on("scroll", function () {
			var scroll = $(window).scrollTop();
			if (scroll > $(window).height()) $('.btnTop').fadeIn();
			else $('.btnTop').fadeOut();
		});

		$('.btnTop button').click(function(){
			$("html, body").animate({ scrollTop: 0 }, "slow");
		});
	}
};
MG.search = {
	//검색
	drag:function(){
		var mc = $('#btnSrchToggle').hammer();
		mc.on('pandown panup', function(e) {
			if(e.type === "pandown"){
				$('.btnSrchToggle').html('<i class="mg iconSrchClose"></i><span>닫기</span>');
				$('.srchUtil').addClass('active');
				$('.btnSrchToggle').data("show","no");

			}else if(e.type === "panup"){
				$('.btnSrchToggle').html('<i class="mg iconSrch"></i><span>검색</span>');
				$('.srchUtil').removeClass('active');
				$('.btnSrchToggle').data("show","yes");
			};
		});
	},
	click:function(){
		$('#btnSrchToggle').on("click",function(e) {
			e.preventDefault();
			if($(this).data("show")=="no") {
				$(this).html('<i class="mg iconSrch"></i><span>검색</span>');
				$('.srchUtil').removeClass('active');
				$(this).data("show","yes");
			}else{
				$(this).html('<i class="mg iconSrchClose"></i><span>닫기</span>');
				$('.srchUtil').addClass('active');
				$(this).data("show","no");
			};
		});
	}
};

MG.layer = {
	//열기
	open:function(modalID){
		var dim = 'dim';
		var layer = "#" + modalID;
		var bg = $('<div class="' + dim + '" ></div>');

		$(layer).css({
			'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
			'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
		}).addClass('open');

		$(bg).appendTo('body').fadeIn('fast');
		$(window).resize(function(){
			$(layer).css({
				'top':Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px",
				'left':Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px"
			});
		});
	},
	//닫기
	hide:function(modalID){
		$('#' + modalID).removeClass('open');
		$('.dim').remove();
	}
};

/*20160511 수정*/
MG.maxLength = {
	check:function(obj){
		if (obj.value.length > obj.maxLength){
		 obj.value = obj.value.slice(0, obj.maxLength);
		}	
	}
};

$(function(){
	MG.common.ui();
	MG.faq.toggle();
	
	if($('.lists').length != 0){
		MG.dateFixed.scroll();
		MG.viewText.view();
	};

	if($('.lnb').length != 0){
		MG.lnb.slide();
	};

	if($('.srch').length != 0){
		//MG.search.drag(); /*20160511 수정*/
		MG.search.click();
	};
	
	if($('.btnTop').length != 0){
		MG.topMove.move();
	};

});



