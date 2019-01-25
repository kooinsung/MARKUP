$(document).ready(function(){

	//기타
	$('.TabList li:last-child, .TabList02 li:last-child').css('background','none');
	$(".phuketGroBlog > li:nth-child(2n)").css({"background":"none"});
	$(".phuketGroBlog > li:nth-child(2n) > .GroBlogInner").css({"padding-left":"20px"});
	$(".event > ul > li:nth-child(3n)").css({"margin-right":"0px"});
	$(".tourPic > ul > li:nth-child(4n)").css({"margin-right":"0px"});

	//글로벌 사이트
	$('.sel').toggle(function() {
		$(this).parent().find('.selList, .selList02').show();
	}, function() {
		$(this).parent().find('.selList, .selList02').hide();
	});
//	$('.selList a').click(function(e){
//		var href = $(this).attr('href');
//		$('.selList').hide(); 
//		window.open(href, '_blank');        
//		e.preventDefault();
//	});


	//placeholder처리
	$('[placeholder]').on({
	focus: function() {
		if( $(this).val() == $(this).attr('placeholder') ) {
			$(this).val('');
		}
	},
	blur: function(){
		if( !$(this).val() ) {
			$(this).val( $(this).attr('placeholder') );
		}
	}
	}).each( function() {
		$(this).val( $(this).attr('placeholder') ) ;
	});

	//탭 - 텍스트형
	$(".tab > div").hide().filter("div:first").show();
	$('.tab strong a').bind("click",function(){
		var num = $(".tab strong a").index($(this));
		 $(".tab strong a").removeClass("on");
		 $(this).addClass("on");
		$(".tab > div").hide();
		$($(".tab > div")[num]).show();
		return false;
	});

	//탭 - 이미지형
	$(".tab02 > div").hide().filter("div:first").show();
	$('.tab02 > strong > a').bind("click",function(){
	  var num = $(".tab02 > strong > a").index($(this));
	  $(".tab02 > strong > a > img").each(function(){
		   $(this).attr("src", $(this).attr("src").replace("_on.gif", "_off.gif"));
	  });
	  $(this).find("img").attr("src", $(this).find("img").attr("src").replace("_off.gif", "_on.gif"));
	  $(".tab02 > div").hide();
	  $($(".tab02 > div")[num]).show();
	  return false;
	});

	//메인 notice
	$('.noticeToggle').toggle(function() {
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_off', '_on'));
		$(this).parent().find('.noticeList').cycle('pause');
	}, function() {
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_on', '_off'));
		$(this).parent().find('.noticeList').cycle('resume');
	});

	//투어사진 오버효과
	$('.tourPic > ul > li').hover(
	  function () {
		$(this).find('div').append("<div class='thumbBorder'></div>");
	  },
	  function () {
		 $('.thumbBorder').remove();
	  }
	);

	//GNB
	$('#gnb h2 a').bind('mouseenter',function(){
		$('#gnb div').hide();
		$(this).parent().next().show();
		$('#gnb h2 a img').each(function(){
			$(this).attr('src',$(this).attr('src').replace('_on.png','_off.png'));
		});
		$myBtn = $(this).children('img');
		$myBtn.attr('src',$myBtn.attr('src').replace('_off.png','_on.png'));

		$('.type01 li a').bind('mouseenter',function(){
			$('.type01 li a img').each(function(){
				$(this).attr('src',$(this).attr('src').replace('_on.png','_off.png'));
			});
			$myBtn = $(this).children('img');
			$myBtn.attr('src',$myBtn.attr('src').replace('_off.png','_on.png'));
		});

		$(this).parent().parent().find(".menuThumb li:eq(0)").nextAll().hide();
		$('.type02 li a').bind('mouseenter',function(){
			var index = $(this).parent().index();
			var selectImg = $(this).parent().parent().parent().find('.menuThumb li');
			$(selectImg).eq(index).show().siblings().hide();
			$('.type02 li a img').each(function(){
				$(this).attr('src',$(this).attr('src').replace('_on.png','_off.png'));
			});
			$myBtn = $(this).children('img');
			$myBtn.attr('src',$myBtn.attr('src').replace('_off.png','_on.png'));
		}); 
	});

	$('#gnb').mouseleave(function(){ 
		$('#gnb div').not(":animated").hide();
		$('#gnb h2 a img').each(function(){
			$(this).attr("src",$(this).attr("src").replace("_on.png","_off.png"));
		});
		$(".menuThumb li").show();
	});


	if((document.location.href.indexOf("") > -1)){
	};


	// 공통 이미지 롤오버 스크립트
	$('img.overImg').each(function() {
		$(this).mouseenter(function() {
			if ($(this).attr('src').match('_off')) {
				$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
				$(this).mouseleave(function() {
				$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
				});
			};
		});
	});

	//faq 
	$('#faq li > a').click(function(e){
		if($(this).next('ul').length > 0){
			e.preventDefault();
			var subNav = $(this).next('ul');
			if (subNav.is(':visible')){
				subNav.slideUp('fast')
				$(this).removeClass("selected");
			}else{
				$('#faq ul:visible').slideUp('fast');
				subNav.slideDown('fast');
				$("a.selected").removeClass("selected");
				$(this).addClass("selected");
			}
		}
		
	});

	//객실정보, 사진정보
	$(".TabInfo > div").hide().filter("div:first").show();
	$('.TabList li a').bind("click",function(){
		var num = $(".TabList li a").index($(this));
		 $(".TabList li a").removeClass("active");
		 $(this).addClass("active");
		$(".TabInfo > div").hide();
		$($(".TabInfo > div")[num]).show();
		return false;
	});
	$(".TabInfo02 > div").hide().filter("div:first").show();
	$('.TabList02 li a').bind("click",function(){
		var num = $(".TabList02 li a").index($(this));
		 $(".TabList02 li a").removeClass("active");
		 $(this).addClass("active");
		$(".TabInfo02 > div").hide();
		$($(".TabInfo02 > div")[num]).show();
		return false;
	});
//	$('.TabList a[href^="#"]').bind('click',function (e) {
//		e.preventDefault();
//
//		var target = this.hash,
//		$target = $(target);
//
//		$('html, body').stop().animate({
//		'scrollTop': $target.offset().top
//		}, 900, 'easeOutQuad', function () {
//		window.location.hash = target;
//		});
//
//		$('.TabList a[href^="#"]').addClass("active").not(this).removeClass("active");
//	});


	//투어 리스트 오버
	$('#tourViewList .inner').hover(function() {
		$(this).find('.layer').fadeIn('fast');
	}, function() {
		$(this).find('.layer').fadeOut('fast');
	});

	//패밀리 호텔 오버 효과
	$('.familyHotel li img').mouseover(function(){
		$(this).attr('src', $(this).attr('src').replace('_off.jpg', '_on.jpg'));
	});
	$('.familyHotel li img').mouseout(function(){
		$(this).attr('src', $(this).attr('src').replace('_on.jpg', '_off.jpg'));
	});

});

/* 공통 사용 modal*/
function ShowModalPopup(modalPopupID) {
	var popupID = "#" + modalPopupID;
	var popupMarginTop = $(popupID).height() / 2;
	var popupMarginLeft = $(popupID).width() / 2;

	$(popupID).fadeIn();
	$(popupID).css({
		'left': '50%',
		'top': '50%',
		'margin-top': -popupMarginTop,
		'margin-left': -popupMarginLeft,
		'position': 'fixed',
		'z-index': 9999
	});
}
function HideModalPopup(modalPopupID) {
	$("#" + modalPopupID).fadeOut();
}