$(document).ready(function(){
	//전체메뉴
	$('#btnAllMenu').toggle(function() {
		$('.allMenu').show();
	}, function() {
		$('.allMenu').hide();
	});

	//gnb
	var howManySlides = $('.gnb .swiper-wrapper .swiper-slide').length - 1; 
	$(".gnb .menuLeft").addClass('hide');
	var mySwiperMenus = new Swiper('.gnb .swiper-container',{
		slidesPerView: 'auto',
		onSlideChangeStart: function(){
			$('.gnb .menuLeft').show()
			$('.gnb .menuRight').show()
			if(mySwiperMenus.activeIndex === 0){
				$('.gnb .menuLeft').hide()
			}
			if(mySwiperMenus.activeIndex === howManySlides){
				$('.gnb .menuRight').hide()
			}
		}
	});
	$('.gnb .menuLeft').on('click', function(e){
		e.preventDefault()
		mySwiperMenus.swipePrev()
	});
	$('.gnb .menuRight').on('click', function(e){
		e.preventDefault()
		mySwiperMenus.swipeNext()
	});

	//메인 비주얼
	var visualSwiper = new Swiper('.visual .swiper-container',{
		 pagination: '.visual .pagination',
		grabCursor: true,
		paginationClickable: true,
		calculateHeight:true
	});

	//질보드
	$('.zillboardTotal').text($('.zillboardCrousel .swiper-wrapper').children().length);
	var carouselSwiper = new Swiper('.zillboard .swiper-container',{
		calculateHeight:true,
		loop:false,
		onSlideChangeEnd : function(swiperHere) {
			$('.zillboardIndex').text(carouselSwiper.activeIndex+1 );
		}
	});
	$('.zillboard .carouselLeft').on('click', function(e){
		e.preventDefault()
		carouselSwiper.swipePrev()
	});
	$('.zillboard .carouselRight').on('click', function(e){
		e.preventDefault()
		carouselSwiper.swipeNext()
	});

	//뉴상품
	$('.newPrdTotal').text($('.newprd .swiper-wrapper').children().length);
	var newPrdSwiper = new Swiper('.newprd .swiper-container',{
		calculateHeight:true,
		loop:false,
		onSlideChangeEnd : function(swiperHere) {
			$('.newPrdIndex').text(carouselSwiper.activeIndex+1 );
		}
	});
	$('.newprd .carouselLeft').on('click', function(e){
		e.preventDefault()
		newPrdSwiper.swipePrev()
	});
	$('.newprd .carouselRight').on('click', function(e){
		e.preventDefault()
		newPrdSwiper.swipeNext()
	});

	//MD추천
	$('.mdRecomTotal').text($('.mdRecom .swiper-wrapper').children().length);
	var mdRecomSwiper = new Swiper('.mdRecom .swiper-container',{
		calculateHeight:true,
		loop:false,
		onSlideChangeEnd : function(swiperHere) {
			$('.mdRecomIndex').text(mdRecomSwiper.activeIndex+1 );
		}
	});
	$('.mdRecom .carouselLeft').on('click', function(e){
		e.preventDefault()
		mdRecomSwiper.swipePrev()
	});
	$('.mdRecom .carouselRight').on('click', function(e){
		e.preventDefault()
		mdRecomSwiper.swipeNext()
	});

	//상세 이미지
	var detailSwiper = new Swiper('.detailImages .swiper-container',{
		calculateHeight:true,
		loop:false,
	});
	$('.detailImages .detailLeft').on('click', function(e){
		e.preventDefault()
		detailSwiper.swipePrev()
	});
	$('.detailImages .detailRight').on('click', function(e){
		e.preventDefault()
		detailSwiper.swipeNext()
	});

	//롤링 리사이징
	$(window).resize(function(){
		$('.visual .swiper-container').css({height:''});
		$('.visual .swiper-container').css({height: $('.visual .swiper-container').find('img').height()});
		$('.zillboard .swiper-container').css({height:''});
		$('.zillboard .swiper-container').css({height: $('.zillboard .swiper-container').find('div').height()});
		$('.newprd .swiper-container, .mdRecom .swiper-container').css({height:''});
		$('.newprd .swiper-container, .mdRecom .swiper-container').css({height: $('.newprd .swiper-container, .mdRecom .swiper-container').find('div').height()});
		$('.detailImages .swiper-container').css({height:''});
		$('.detailImages .swiper-container').css({height: $('.detailImages .swiper-container').find('img').height()});
		visualSwiper.reInit();
		carouselSwiper.reInit();
		newPrdSwiper.reInit();
		mdRecomSwiper.reInit();
		detailSwiper.reInit();
	})



});
