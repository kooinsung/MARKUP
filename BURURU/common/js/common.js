$(document).ready(function(){
	//기타
	$(".boardListType02 > li:nth-child(1n)").css({"margin-right":"25px"});
	$(".planEvent li:nth-child(4n), .prdList li:nth-child(4n), .boardListType02 li:nth-child(2n), .bbarutaPrdList li:nth-child(5n)").css({"margin-right":"0"});

	//전체 브랜드 및 전체 카테고리
	$('.firstMenu strong a').bind('click',function(){
		$('.firstMenu > li > div').hide();
		$(this).parent().next().slideDown();
		$('.firstMenu strong a img').each(function(){
			$(this).attr('src',$(this).attr('src').replace('_on.gif','_off.gif'));
		});
		$myBtn = $(this).children('img');
		$myBtn.attr('src',$myBtn.attr('src').replace('_off.gif','_on.gif'));

		$(this).parent().parent().find(".brandView li:eq(0)").nextAll().hide();

		$('.allBrand li a').bind('mouseenter',function(){
			var index = $(this).parent().index();
			var selectImg = $(this).parent().parent().parent().find('.brandView li');
			$(selectImg).eq(index).show().siblings().hide();
			$('.allBrand li a img').each(function(){
				$(this).attr('src',$(this).attr('src').replace('_on.jpg','_off.jpg'));
			});
			$myBtn = $(this).children('img');
			$myBtn.attr('src',$myBtn.attr('src').replace('_off.jpg','_on.jpg'));
		}); 
		return false;
	});
	$('.btnClose').click(function(){
		$(this).parent().hide();
		$(this).parent().parent().find('strong img').attr('src',$(this).parent().parent().find('strong img').attr('src').replace('_on.gif','_off.gif'));
	});

	//gnb
	$("ul.dropDownMenu li").hover(function(){
		$(this).addClass("hover");
		$('ul:first',this).css('visibility', 'visible');
	}, function(){
		$(this).removeClass("hover");
		$('ul:first',this).css('visibility', 'hidden');
	});
	$("ul.dropdown li ul li:has(ul)").find("a:first").append(" &raquo; ");

	//질보드 차트 
	$(window).load(function(){
		$('.scrollBanner li:first-child').css('margin-left','0');
		$('.scrollBanner li:last-child').css('margin-right','0');
		$(".scrolling").mCustomScrollbar({
			horizontalScroll:true,
			autoDraggerLength:false,
			scrollButtons:{enable:false}
		});
	});

	//다중 말줄임처리
	$(".ellipsis").dotdotdot();

	//lnb
	 $('.leftMenu a').click(function(e){
		  if($(this).parent().next('ul').length > 0){
			e.preventDefault();
			var subNav = $(this).parent().next('ul');
			if (subNav.is(':visible')){
				subNav.slideUp(400, 'easeOutQuad')
				$(this).parent().removeClass("on");
			}else{
				$('.leftMenu ul').slideUp(400, 'easeOutQuad');
				subNav.slideDown(400, 'easeOutQuad');
				$("h3.on").removeClass("on");
				$(this).parent().addClass("on");
			   }
		  };
	 });

	//lnb2
	 $('.faqMenu a').click(function(e){
		  if($(this).parent().next('ul').length > 0){
			e.preventDefault();
			var subNav = $(this).parent().next('ul');
			if (subNav.is(':visible')){
				subNav.slideUp(400, 'easeOutQuad')
				$(this).parent().removeClass("on");
			}else{
				$('.faqMenu ul').slideUp(400, 'easeOutQuad');
				subNav.slideDown(400, 'easeOutQuad');
				$("h3.on").removeClass("on");
				$(this).parent().addClass("on");
			   }
		  };
	 });

	//플로팅 픽스
	var shrinkHeader = $('.header').height();
	$(window).scroll(function() {
	var scroll = getCurrentScroll();
	  if ( scroll >= shrinkHeader ) {
		   $('.sideMenu').addClass('fixed');
		}
		else {
			$('.sideMenu').removeClass('fixed');
		}
	});
	function getCurrentScroll() {
		return window.pageYOffset || document.documentElement.scrollTop;
	};

	//브랜드샵
	$(window).load(function(){
		$(".brandShopScroll").mCustomScrollbar({
			autoDraggerLength:false,
			scrollButtons:{enable:true}
		});
	});

	//맨위로 스크롤 이동
	$('#btnTop').click(function($e){
		$('html, body').animate({scrollTop:0}, "slow", "easeOutExpo" );
		return false;
	});

	//카테고리 셀렉트
	$('.sel').toggle(function() {
		$(this).parent().find('.selList, .selList02').show();
	}, function() {
		$(this).parent().find('.selList, .selList02').hide();
	});
	$('.selList a').click(function(e){
		//var href = $(this).attr('href');
		$(this).parent().parent().parent().find('.sel').text($(this).text());
		$('.selList').hide(); 
		//window.open(href, '_blank');
		e.preventDefault();
	});
	

	//상세 탭
	$(".tabContent").hide();
	$(".tabContent:first").show(); 
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active");
		$(".tabContent").hide();
		var activeTab = $(this).attr("rel"); 
		$("#"+activeTab).fadeIn(); 
		return false;
	});

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

	//메뉴 풍선 덩실덩실
	adballoonUp();
	sliderHandler();
	sliderHandler02();
});

//메뉴 풍선 up
function adballoonUp(){ 
	$('.bubble').animate({top:-15}, 'slow', null, adballoonDown);
}
//메뉴 풍선 down
function adballoonDown(){ 
	$('.bubble').animate({top:-23}, 1000, null, adballoonUp);
}

function sliderHandler(){
	if($("#sliderBigReal").length>0){
		var realSlider= $("#sliderBigReal ul").bxSlider({
			 mode:'fade',
			 auto:true,
			speed:1000,
			pager:false,
			nextText:'',
			prevText:'',
			infiniteLoop:false,
			hideControlOnEnd:true,
			onSlideBefore:function($slideElement, oldIndex, newIndex){
				changeRealDetailThumb(realThumbSlider,newIndex);
			}
		});
		
		var realThumbSlider=$("#sliderThumbReal ul").bxSlider({
		  minSlides: 6,
		  maxSlides: 6,
			auto:true,
		  slideWidth: 199,
		  slideMargin: 0,
		  moveSlides: 1,
		  pager:false,
		  speed:1000,
		  infiniteLoop:false,
		  hideControlOnEnd:true,
		  nextText:'<span></span>',
			prevText:'<span></span>',
			onSlideBefore:function($slideElement, oldIndex, newIndex){
				/*$("#sliderThumbReal ul .active").removeClass("active");
				$slideElement.addClass("active"); */
			}
		});
		linkRealSliders(realSlider,realThumbSlider);
		if($("#sliderThumbReal li").length<5){
			$("#sliderThumbReal .bx-next").hide();
		}
	}
	
}

function linkRealSliders(bigS,thumbS){
	$("#sliderThumbReal ul").on("click","a",function(event){
		event.preventDefault();
		newIndex=$(this).parent().attr("slideIndex");
		bigS.goToSlide(newIndex);
	});
}

function changeRealDetailThumb(slider,newIndex){
	var $thumbS=$("#sliderThumbReal");
	$thumbS.find('.active').removeClass("active");
	$thumbS.find('li[slideIndex="'+newIndex+'"]').addClass("active");
	if(slider.getSlideCount()-newIndex>=6)slider.goToSlide(newIndex);
	else slider.goToSlide(slider.getSlideCount()-6);
}


function sliderHandler02(){
	if($("#sliderBigReal02").length>0){
		var realSlider02= $("#sliderBigReal02 ul").bxSlider({
			speed:1000,
			pager:false,
			nextText:'',
			prevText:'',
			infiniteLoop:false,
			hideControlOnEnd:true,
			onSlideBefore:function($slideElement, oldIndex, newIndex){
				changeRealDetailThumb02(realThumbSlider02,newIndex);
			}
		});
		
		var realThumbSlider02=$("#sliderThumbReal02 ul").bxSlider({
		  minSlides: 4,
		  maxSlides: 4,
		  slideWidth: 80,
		  slideMargin: 10,
		  moveSlides: 1,
		  pager:false,
		  speed:1000,
		  infiniteLoop:false,
		  hideControlOnEnd:true,
		  nextText:'<span></span>',
			prevText:'<span></span>',
			onSlideBefore:function($slideElement, oldIndex, newIndex){
				/*$("#sliderThumbReal ul .active").removeClass("active");
				$slideElement.addClass("active"); */
			}
		});
		linkRealSliders02(realSlider02,realThumbSlider02);
		if($("#sliderThumbReal02 li").length<5){
			$("#sliderThumbReal02 .bx-next").hide();
		}
	}
	
}

function linkRealSliders02(bigS02,thumbS02){
	$("#sliderThumbReal02 ul").on("click","a",function(event){
		event.preventDefault();
		newIndex=$(this).parent().attr("slideIndex");
		bigS02.goToSlide(newIndex);
	});
}

function changeRealDetailThumb02(slider,newIndex){
	var $thumbS02=$("#sliderThumbReal02");
	$thumbS02.find('.active').removeClass("active");
	$thumbS02.find('li[slideIndex="'+newIndex+'"]').addClass("active");
	if(slider.getSlideCount()-newIndex>=4)slider.goToSlide(newIndex);
	else slider.goToSlide(slider.getSlideCount()-4);
}