//fixed버튼 변수
var _ty;
var _zoom, _zoomTop;
var _zoom02, _zoomTop02;
var _zoom03, _zoomTop03;
var _zoom04, _zoomTop04;
var bx, _bxt;

$(document).ready(function() {
  //통합검색 확장
  $('input[name="searchWords"]').focus(function(){
		$('header > .inner').css('padding','0 0');
		$('.search_head').addClass('extent');
		$('header .search_head .input_box').animate({"margin-right":"0px"},"slow");
		$('#nav, .titleArea, #content, footer, .allMenu, h1, .notice, .btn_myCart').hide();
		$('#unifiedSearch').show();

  });
  $('input[name="searchWords"]').blur(function(){
		$('header > .inner').css('padding','0 12px');
		$('.search_head').removeClass('extent');
		$('header .search_head .input_box').animate({"margin-right":"45px"},"slow");
		$('#nav, .titleArea, #content, footer, .allMenu, h1, .notice, .btn_myCart').show();
		$('#unifiedSearch').hide();
  });


	//fixed버튼 offset
	_ty = $("#cartBtns").offset();
	_zoom = $("#shopZoom").offset();
	_zoom02 = $("#shopZoom02").offset();
	_zoom03 = $("#shopZoom03").offset();
	_zoom04 = $("#shopZoom04").offset();

	//메인상단배너
	var dafaultMain = $(".banner #dafault");
	var dafaultPlan = $(".popular03 #dafault");
	dafaultMain.swipe({
		goToFirst:false, 
		slideSpeed : 300, 
		paginationSpeed : 400, 
		singleItem : true 
	});

	//인기 기획전
	dafaultPlan.swipe({
		autoPlay:false,
		goToFirst:false, 
		slideSpeed : 300, 
		paginationSpeed : 400, 
		singleItem : true 
	});

	//메인최근본상품 및 상품상세 
	var dafault021 = $(".detailView #dafault02");
	var dafault022 = $(".lastest #dafault02");
	$("#dafault02").swipe({
		autoPlay:false,
		pagination:false,
		slideSpeed : 300, 
		singleItem : true, 
		afterInit : function(){
			//확대버튼 fixed처리를 위한,,,
			/*
			if(_zoom){
				_zoomTop = _zoom.top + 246 + 10*$('.orderOption02 > ul > li').length + $("#shopZoom").height();
			}
			*/
		}
	});
	$(".next").click(function(){
		dafault021.trigger('swipe.next');
		dafault022.trigger('swipe.next');
	})
	$(".prev").click(function(){
		dafault021.trigger('swipe.prev');
		dafault022.trigger('swipe.prev');
	})

	//메인특가복지, 추천서비스wow
	bxInit();

	//메인베스트50
	$("#rolling03").swipe({
		autoPlay:false,
		slideSpeed : 300,
		items : 3,
		itemsDesktop : [1199,3],
		itemsDesktopSmall : [979,3],
		itemsTablet: [768,3],
		itemsMobile : [479,3]
	});

	//상품상세
	$("#rolling04").swipe({
		autoPlay:false,
		pagination : false, 
		paginationSpeed : 400,
		items : 5,
		itemsDesktop : [1199,5],
		itemsDesktopSmall : [979,5],
		itemsTablet: [768,5],
		itemsMobile : [479,3]
	});

	//메뉴 구분선 삭제
	$('#nav > .inner > ul > li > a.on').parent().prev().css('background','none');
	$('.viewTab > ul > li.on').prev().find('a').css('border-right','0');

	//공지사항/이벤트
	$('#noticeAndnews li:not(:first)').hide();
	var slide = function(){ 
		var Act_curr = $('#noticeAndnews li.curr');
		Act_curr.hide().removeClass('curr');
		
		if (Act_curr.next()[0] && Act_curr.next()[0].nodeName == 'LI') { 
			Act_curr.next().show().addClass('curr');
		} else {
			$('#noticeAndnews li:first').addClass('curr').show();
		}
		setTimeout(slide, 4500);
	}
	slide();
	$('.layerClose').click(function(){
		$('.notice').hide();
	});

	//인기 기획전 탭메뉴 - 640이하
	$('.tabMenu li a').click(function(){
		var allTab = $('.tabMenu li');
		var allTabNum = $('.tabMenu li').length;
		var allContents = $('div[id*=content0]');

		allContents.hide();
		$('.tabMenu li').css({'border':'1px solid #e2e2e2', 'border-left':'0', 'border-bottom':'1px solid #323c45'});
		allonTab = $('.tabMenu li[class*=_on]').attr('class');
		allresetTab = allonTab.replace('_on','');
		$('.tabMenu li[class*=_on]').attr('class',allresetTab).css({'border':'1px solid #e2e2e2', 'border-left':'0', 'border-bottom':'1px solid #000', 'background':'#fff', 'color':'#889098'}).prev().css('border-right','1px solid #e2e2e2');
		offTab = $(this).parent().attr('class');
		onTab = offTab.replace('Menu','Menu_on');
		$(this).parent().attr('class',onTab).css({'border':'1px solid #323c45', 'border-bottom':'1px solid #e0faff', 'background':'#e0faff', 'color':'#166db8'}).prev().css('border-right','0');
		$('.tabMenu li.tab01Menu_on').css('border-left','0');
		$('.tabMenu li.tab04Menu_on').css('border-right','0');
		activeTab = $(this).attr('href');
		$(activeTab).show();
		return false;
	}); $('.tabMenu li a:first').click(); 

	//하위 아코디언 메뉴
//	var oldDeps = [null, null];
//	var subMenu;
//	var elem = $('.subMenu a');
//	 	elem.click(function(e){
//		var $this = $(this);
//		var target = $(this).attr('class')
//		if ($this.attr('href').length > 1) {
//			//j$this.trigger('click');
//			// click event 중복으로 수정 2013-10-01 전민형
//			eval($this.attr('href'));
//			return false;
//		};
//		if (target == 'deps1') {
//			subMenu = $this.parent().next('ul');
//			$('h4.on').removeClass('on');
//			$(this).parent().addClass('on');
//			if (oldDeps[0] != null) {
//				if (oldDeps[1] != null) oldDeps[1].next('ul').stop().slideUp(100, 'easeOutQuad');
//				oldDeps[0].parent().next('ul').stop().slideUp(100, 'easeOutQuad');
//			}
//			oldDeps[0] = $this;
//		}else if(target == 'deps2'){
//			subMenu = $this.next('ul')
//			$(this).parent().parent().parent().find('h4').addClass('on');
//			if (oldDeps[1] != null) {
//				oldDeps[1].next('ul').stop().slideUp(100, 'easeOutQuad');
//			}
//			oldDeps[1] = $this;
//		}
//		subMenu.stop().slideDown(100, 'easeOutQuad');
//		return false;
//	});


	//하위 아코디언 메뉴
	$('.subMenu a').click(function(e){
		if($(this).parent().next('ul').length > 0){
			e.preventDefault();
			var subNav = $(this).parent().next('ul');
			if (subNav.is(':visible')){
				subNav.slideUp(400, 'easeOutQuad')
				$(this).parent().removeClass("on");
			}else{
				$('.subMenu ul').slideUp(400, 'easeOutQuad');
				subNav.slideDown(400, 'easeOutQuad');
				$("h4.on").removeClass("on");
				$(this).parent().addClass("on");

			}
		};
	});


	//주문수정 토글
	$('.btn_Modify').toggle(function() {
		$(this).addClass('btnType03');
		$(this).find('img').attr('src',$(this).find('img').attr('src').replace('_off.png','_on.png'));
		$(this).parent().parent().find('.orderModify').slideDown();
	}, function() {
		$(this).removeClass('btnType03');
		$(this).find('img').attr('src',$(this).find('img').attr('src').replace('_on.png','_off.png'));
		$(this).parent().parent().find('.orderModify').slideUp().hide(50);
	});
	//주문수정 취소버튼
	$('.smallBtns02 button:first-child').on('click', function(e){
		$(this).parent().parent().parent().find('.btn_Modify').click();
	});

	//맨위로 스크롤 이동
	$('.topMove').click(function($e){
		$('html, body').animate({scrollTop:0}, "slow", "easeOutExpo" );
		return false;
	});

	//행복한 삶 메인
	$("#familyBanner").touchSlider({
		flexible : true,
		roll:false,
		speed : 300,
		initComplete : function (e) {
			$("#bannerPaging").html("");
			var num = 1;
			$("#familyBanner ul li").each(function (i, el) {
				if((i+1) % e._view == 0) {
					$("#bannerPaging").append('<button type="button" class="btn_page">page' + (num++) + '</button>');
				}
			});
			$("#bannerPaging .btn_page").bind("click", function (e) {
				var i = $(this).index();
				$("#familyBanner").get(0).go_page(i);
			});
		},
		counter : function (e) {
			$("#bannerPaging .btn_page").removeClass("on").eq(e.current-1).addClass("on");
		}
	});

});

//fixed
$(document).scroll(function(){
	var _wh = $(window).height();
	var _sh = $(document).scrollTop();
	var _h = _wh+_sh-$("#cartBtns").height();
	var _h02 = _wh+_sh-$("#shopZoom").height();
	var _h03 = _wh+_sh-$("#shopZoom02").height();
	var _h04 = _wh+_sh-$("#shopZoom04").height();

	if(_zoom02){
		_zoomTop02 = _zoom02.top + 20 + 40 + 18 + 12 + 14 + $('#shopZoom02 > a').height();
	}

	if(_zoom03){
		_zoomTop03 = _zoom03.top + $('#shopZoom03 > a').height();
	}
	
	if (_ty){
		if (_h < _ty.top) {
			$("#cartBtns").css({'position':'fixed', 'bottom':'0', 'left':'0', 'width':'100%', 'padding':'7px 0 5px 0', 'background':'rgba(0, 0, 0, 0.8)', 'z-index':'10000', 'margin-bottom':'0'});
		}else {
			$("#cartBtns").css({'position':'static', 'bottom':'auto', 'padding':'0', 'background':'none', 'margin-bottom':'0'});
		};
	};

	if (_zoom) {
		if (_sh > _zoomTop) {
			$("#shopZoom").css({'position':'fixed', 'top':'0', 'left':'0', 'width':'100%'});
		}else {
			$("#shopZoom").css({'position':'static', 'top':'auto', 'width':'auto'});
		};
	}
	
	if (_zoom02) {
		if (_sh > _zoomTop02) {
			$("#shopZoom02").css({'position':'fixed', 'top':'0', 'right':'12px'});
		}else {
			$("#shopZoom02").css({'position':'absolute', 'top':'0'});
		};
	}

	if (_zoom03) {
		if (_sh > _zoomTop03) {
			$("#shopZoom03").css({'position':'fixed', 'top':'0', 'right':'12px'});
		}else {
			$("#shopZoom03").css({'position':'absolute', 'top':'0'});
		};
	}	

	if (_zoom04) {
		if (_sh > _zoomTop04) {
			$("#shopZoom04").css({'position':'fixed', 'top':'0', 'left':'0', 'width':'100%'});
		}else {
			$("#shopZoom04").css({'position':'static', 'top':'auto', 'width':'auto'});
		}
	};
});

//특가 상품 컨트롤 
function bxControl(){
	if (bx){
		$('.next02').on('click', function(e){
			e.preventDefault();
			bx.goToNextSlide();
		});
		$('.prev02').on('click', function(e){
			e.preventDefault();
			bx.goToPrevSlide();
		});
		$(".specialPriceControl .totalSlide02").html(Math.ceil(bx.getSlideCount()/2));
		$(".specialPriceControl .currentSlide02").html(bx.getCurrentSlide() + 1);

		if (_bxt) {
			clearTimeout(_bxt);
		}
	}
}

function bxResize(){
	bxControl();
	$(window).resize(function(){
		//bxslider 호출
		bxReinit();

	})
}

//특가 상품 및 추천서비스 11.27
function bxInit(){
	
	if ($(window).width() < 640 )
	{
		bx = $("#new-rolling02").bxSlider({
			swipeThreshold:10,
			pager:false,
			controls:false,
			onSliderLoad: function(){
				_bxt = setTimeout(bxControl, 0);
			},
			onSliderLoad: bxResize,
			onSlideAfter: bxControl
		});
	}else {
		bx = $("#new-rolling02").bxSlider({

			slideWidth: 400,
			minSlides: 2,
		    maxSlides: 2,
			pager:false,
			controls:false,
			onSliderLoad: function(){
				bxResize();
				_bxt = setTimeout(bxControl, 0);
			},
			onSlideAfter: bxControl
		});
	}
}
//11.27
function bxReinit(){
	if ($(window).width() < 640 )
	{
		bx.reloadSlider({
			swipeThreshold:10,
			pager:false,
			controls:false,
				onSliderLoad: bxControl,
				onSlideAfter:bxControl
		});
	}else {
		bx.reloadSlider({
			slideWidth: 400,
			minSlides: 2,
		    maxSlides: 2,
			pager:false,
			controls:false,
			onSliderLoad: bxControl,
			onSlideAfter:bxControl
		});
	}
}

// 썸네일형 리스트 반응형 -best50, 기획전
function UL_layoutFix(el, isNewLine, addMargine){
	var obj = $(el).find("li");
	var win_w,obj_w,n,x, nmg;
	var tempWidth = 0;
	function init(){
		obj = $(el).find("li");
		win_w = $(window).width();
		//if (tempWidth == win_w) return;
		tempWidth = win_w;
		obj_w = $(obj).outerWidth();
		n = Math.floor(win_w / obj_w); //라인당 li 갯수

		//개행되는 목록과 개행되지 않는 목록을 분기
		if (isNewLine){
			x = win_w % obj_w; //남는 영역
			x = (x/n)/2;
			obj.css({marginLeft:x,marginRight:x});
		}
		else {
			win_w = win_w - 30; //화면너비 - 좌우기본마진(15px/15px)
			//기본 마진 외에 추가로 공간이 발생하는 경우 보정해 주어야 한다.
			if (addMargine != undefined) {
				win_w = win_w - addMargine;
			}
			n = Math.floor(win_w / obj_w); //라인당 li 갯수
			nmg = win_w - (obj_w * n);
			x = (n > 1) ? (nmg /(n - 1)) : nmg;
			obj.css({marginLeft:0,marginRight:x});
		}
	}

	if (typeof orientationchange != "undefined"){
		$(window).bind("orientationchange", function(){
			init();
		});
	}
	else{
		$(window).bind("resize",function(){
			init();
		});
	}
	init();
};

