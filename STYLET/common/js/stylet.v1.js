var	stylet = (typeof stylet === 'undefined') ? {}	: console.log('......');

stylet	= {
	init:function(){
		var	h;
		h =	this;
		h.common.init();
		h.ulToggle.init();
		h.footerToggle.init();
		h.layerToggle.init();
		h.gnb.init();
		h.mSrch.init();
		h.fourThumb.init();
		h.viewPic.init();
		h.itemList.init();
		h.fixedMenu.init();
		h.scrollPosition.init();
		h.tabs.init();
		h.contestList.init();
		h.prdToggle.init();
		h.family.init();
	}
};

stylet.common	= {
	init:function(){
		var	common	= this;
		common.ui();
	},
	ui:function(){
		//커스텀 select
		$(".custom").selectbox();
		
		//좌측 메뉴
		$.slidebars();

		//말줄임
		$(".ellipsis").dotdotdot({watch: "window"});

		//커스텀스크롤바
		$(".customScrollbar").mCustomScrollbar({scrollInertia:0, axis:"x",autoExpandScrollbar:true,advanced:{autoExpandHorizontalScroll:true}});
		if ( !(navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/android/i)) ){
			$(".sb-momentum-scrolling").mCustomScrollbar({scrollInertia:0,autoExpandScrollbar:true,advanced:{autoExpandHorizontalScroll:true}});
		}

		//리스트 정렬
		var $container = $('#prdList').imagesLoaded( function() {
			$container.isotope({
				itemSelector: '.item',
				layoutMode: 'masonry'
			});

			//리스트 정렬 타입
			$('.sortBtns li').bind('click',function(e){
				var index = $(this).index() + 1;
				$('.sortBtns li img').each(function(){
					$(this).attr('src',$(this).attr('src').replace('_on','_off'));
				});
				if( index == 1 ){
					$(this).find('img').attr('src',$(this).find('img').attr('src').replace('_off','_on'));
					$('.prdList.MyPrdList').removeClass('MyPrdList02');
					$container.isotope('layout');
				}else if( index == 2 ){
					$(this).find('img').attr('src',$(this).find('img').attr('src').replace('_off','_on'));
					$('.prdList.MyPrdList').addClass('MyPrdList02');
					$container.isotope('layout');
				};
				e.preventDefault();
			});
		});
		$(window).on("resize", function () {
			$('.srchListType01, .srchListType02').hide();
		});

		//좋아요
		$('.cycleLike').click(function(){
			if ($(this).hasClass('gray')) {
				$(this).removeClass('gray').addClass('red');
			}else if($(this).hasClass('red')){
				$(this).removeClass('red').addClass('gray');
			}
			return false;
		});
		//위로 이동 show / hide
		$(window).on("scroll", function () {
			var scroll = $(window).scrollTop();			
			if (scroll > 100) $('#btnTopMove').fadeIn();
			else $('#btnTopMove').fadeOut();
		});
		//위로 이동
		$('#btnTopMove').click(function(){
			$("html, body").animate({ scrollTop: 0 }, "fast");
			return false;
		});	
	}
};

//fixed menu
stylet.fixedMenu= {
	init:function(){
		var	fixedMenu	= this;
		fixedMenu.ui();
	},
	ui:function(){
		$(window).on("orientationchange load resize scroll", function () {
			var w = $(window).width();
			var scroll = $(window).scrollTop();
			if (scroll >= 60) $('.header').addClass('fixedHeader');
			else $('.header').removeClass('fixedHeader'); $('h1').css('left', '0');
		});	
	}
};

stylet.scrollPosition= {
	init:function(){
		var	scrollPosition	= this;
		scrollPosition.ui();
	},
	ui:function(){
		$(window).on("orientationchange load resize", function () {
			var w = $(window).width();
			var fixW = 1160;
			var hLeft = (w - fixW) / 2;
			var iScrollPos = 0;
			if(w >= 1024){
				$(window).scroll(function () {
					var iCurScrollPos = $(this).scrollTop();
					if (iCurScrollPos > iScrollPos)  $('.header').show(); else $('.header').show();
					iScrollPos = iCurScrollPos;
					$('.header.fixedHeader h1').css('left', hLeft);
				});
			}else if(w <= 1023){
				$(window).scroll(function () {
					 var iCurScrollPos = $(this).scrollTop();
					 if (iCurScrollPos > iScrollPos&&iScrollPos>0){
						 $('.header').hide();
					 }else{
						 $('.header').show()
					};
					iScrollPos = iCurScrollPos;
					$('.header.fixedHeader h1').css('left', '0');
				});
			}
		});	


	}
};

//레이어 뷰
stylet.layerToggle= {
	init:function(){
		var	layerToggle	= this;
		layerToggle.ui();
	},
	ui:function(){
		//초대하기
		$('.btnLayerView').bind('click',function(){
			$(this).parent().find('div').stop().fadeIn('fast');
			$('.btnLayerClose').click(function(){
				$(this).parent().stop().fadeOut();
			});
		});

		//상세보기 & 정렬/보기방식
		$('.btnLayerView02').bind('click',function(e){
			if($(this).parent().find('div').length > 0){
				var fields = $(this).parent().find('div');
				if (fields.is(':visible')){
					fields.slideUp('fast')
					$(this).removeClass('active');
				}else{
					e.preventDefault();
					$('.listUtil > div').slideUp('fast');
					fields.slideDown('fast');
					$('.btnLayerView02').removeClass('active');
					$(this).addClass('active');
				}
			};
			$('.btnLayerClose').click(function(){
				$('.btnLayerView02').removeClass('active');
				$(this).parent().stop().slideUp('fast');
			});
		});	


	}
};

//웹메뉴
stylet.gnb= {
	init:function(){
		var	gnb	= this;
		gnb.ui();
	},
	ui:function(){
		$('.gnbDepth01 li a').bind('mouseenter',function(){
			var num = $(".gnbDepth01 li a").index($(this));
			$('.gnbDepth02').stop().animate({top:49}, 'fast');
			if(num == 0){
				var position = $(this).parent().position();
				var first = position.left + 17
				$('.d01').css('left', first);
			}else if(num == 1){
				var position = $(this).parent().position();
				var first = position.left + 17
				$('.d02').css('left', first);
			}else if(num == 2){
				var position = $(this).parent().position();
				var first = position.left + 17
				$('.d03').css('left', first);
			}else{
				$('.gnbDepth02').stop().animate({top:3}, 'fast');
			}
			$('.gnbDepth01 li a').removeClass('active');
			$(this).addClass('active');
			$('.gnbDepth02 > ul > li').hide();
			$($('.gnbDepth02 > ul > li')[num]).show();
			$('.gnbInner').bind('mouseleave',function(){
				$('.gnbDepth01 li a').removeClass('active');
				$('.gnbDepth02').stop().animate({top:3}, 'fast');
				$('.gnbDepth02 > ul > li').hide();
			});
			return false;
		});
	}
};
//ul 토글
stylet.ulToggle= {
	init:function(){
		var	ulToggle	= this;
		ulToggle.ui();
	},
	ui:function(){
		$('.btnToggle').bind("click",function(e) {
			e.preventDefault();
			if ($(this).data("show")=="no") {
				$(this).parent().find('ul').stop().slideUp('fast');
				$(this).find('i').removeClass('acitve');
				$(this).data("show","yes");
			}else{
				$(this).parent().find('ul').stop().slideDown('fast');
				$(this).find('i').addClass('acitve');
				$(this).data("show","no");
			}
		});

		$('.btnLogToggle').bind("click",function(e) {
			e.preventDefault();
			if ($(this).data("show")=="no") {
				$('.loginLayer').stop().slideUp('fast');
				$(this).data("show","yes");
			}else{
				$('.loginLayer').stop().slideDown('fast');
				$(this).data("show","no");
			}
		});
	}
};

//패밀리사이트
stylet.family= {
	init:function(){
		var	family	= this;
		family.ui();
	},
	ui:function(){
		$('.btnFamily').bind('click',function(){
			$('.topFamilyInner').slideDown('fast');
			$('.btnCloseFamily').click(function(){
				$('.topFamilyInner').slideUp('fast');
			});
		});
	}
};

//모바일 검색 활성화
stylet.mSrch= {
	init:function(){
		var	mSrch	= this;
		mSrch.ui();
	},
	ui:function(){
		$('.srch02 .btnSrch').bind('click',function(){
			$('.util').css('width','100%');
			$('.utilInner .srch02').css({'width':'100%','right':'0'});
			$('.srchListType02').slideDown('fast');
			$('.topFamily .btnFamily').css('z-index','0');
			$('.btnSrchClose').click(function(){
				$('.util').css('width','auto');
				$('.utilInner .srch02').css({'width':'50px','right':'60px'});
				$('.srchListType02').hide();
				$('.topFamily .btnFamily').css('z-index','150');
			});
		});
		$(window).on("orientationchange load resize", function () {
			var w = $(window).width();
			if(w <= 1024){
				//$('.util').css('width','auto');
			}else{
				$('.util').css('width','100%');
			}
		});
	}
};

//풋터 토글
stylet.footerToggle= {
	init:function(){
		var	footerToggle	= this;
		footerToggle.ui();
	},
	ui:function(){

		$('#btnfooterToggle').click(function(){
			var footerTop = $('.footer').offset().top + 100;
			var scroll = $(window).scrollTop();
			if($('.footerM .footerInner').css('display') == "block"){
				$('.footerM .footerInner').stop().slideUp('fast');
				$(this).find('span').removeClass('active');
			}else{
				 $("html, body").animate({ scrollTop: footerTop }, "slow");
				$(this).find('span').addClass('active');
				$('.footerM .footerInner').stop().slideDown('fast');
			}
			return false;
		});
	}
};

//아이템 리스트 
stylet.itemList= {
	init:function(){
		var	itemList	= this;
		itemList.ui();
	},
	ui:function(){
		$(window).on("orientationchange load resize", function () {
			var w = $(window).width();
			$('.viewItemlist').each(function(){
				var w = $(window).width();
				if(w >= 640){
					$(this).find('li').show(); $(this).find('li:gt(3)').hide();
				}else{
					$(this).find('li').show(); $(this).find('li:gt(1)').hide();
				};
			});
			/*
			$('.viewItemlist02').each(function(){
				var w = $(window).width();
				if(w >= 640){
					$('.viewItemlist02 li').show(); $(this).find('li:gt(3)').hide();
				}else{
					$('.viewItemlist02 li').show(); $(this).find('li:gt(1)').hide();
				};
			});
			$('.viewItemlist03').each(function(){
				var w = $(window).width();
				if(w >= 640){
					$('.viewItemlist03 li').show(); $(this).find('li:gt(3)').hide();
				}else{
					$('.viewItemlist03 li').show(); $(this).find('li:gt(1)').hide();
				};
			});
			*/
		});

		$('.itemTit').click(function(){
			var w = $(window).width();
			$(this).find('i').addClass('active');
			$('.viewItemlist01').each(function(){
				if(w >= 640){
					if($('.viewItemlist01 li:visible').length <= 5) {
						$('.viewItemlist01 li').show();
					}else{
						$('.viewItemlist01').find('li:gt(3)').hide();
						$(this).parent().parent().find('i').removeClass('active');
					}
				}else{
					if($('.viewItemlist01 li:visible').length <= 3) {
						$('.viewItemlist01 li').show();
					}else{
						$('.viewItemlist01').find('li:gt(1)').hide();
						$(this).parent().parent().find('i').removeClass('active');
					}
				};

			});
			return false;
		});

/*
		$('.itemTit').click(function(e){
			if($(this).parent().find('div').length > 0){
				var fields = $(this).parent().find('div');
				if (fields.is(':visible')){
					fields.slideUp('fast')
					$(this).find('i').removeClass('active');
				}else{
					e.preventDefault();
					$('.itemList div').slideUp('fast');
					fields.slideDown('fast');
					$('.itemList i').removeClass('active');
					$(this).find('i').addClass('active');
				}
			};
		});	
*/
	}
};

//콘테스트 리스트 
stylet.contestList= {
	init:function(){
		var	contestList	= this;
		contestList.ui();
	},
	ui:function(){
		$('.selList > ul > li > a').click(function(e){
			e.preventDefault();
			if($(this).next('ul').length > 0){
				var fields = $(this).next('ul');
				if (fields.is(':visible')){
					fields.slideUp('fast')
					$(this).parent().removeClass('active');
				}else{
					$('.selList .childList').slideUp('fast');
					fields.slideDown('fast');
					$('.selList > ul > li').removeClass('active');
					$(this).parent().addClass('active');
				}
			};
		});	
	}
};

//리뷰
stylet.viewPic= {
	init:function(){
		var	viewPic	= this;
		viewPic.ui();
	},
	ui:function(){
		$('.btnViewReview').bind("click",function(e) {
			e.preventDefault();
			if ($(this).data("show")=="yes") {
				$(this).removeClass('active');
				$(this).parent().find('.reviewBox').stop().slideUp('fast');
				$(this).parent().parent().find('.reviewTxt').show('fast');
				$(this).data("show","no");
			}else{
				$(this).addClass('active');
				$(this).parent().find('.reviewBox').stop().slideDown('fast');
				$(this).parent().parent().find('.reviewTxt').hide('fast');
				$(this).data("show","yes");
			}
		});
	}
};

//썸네일 4개타입
stylet.fourThumb= {
	init:function(){
		var	fourThumb	= this;
		fourThumb.ui();
	},
	ui:function(){

		$('.listThumb > li, .listThumbCall').bind('click',function(e){
			e.preventDefault();
			var index = $(this).index() + 1;
			var dim = 'modalDim';
			var popupID = "#lsitThumbLayer";
			var popupMarginTop = $(popupID).height() / 2;
			var popupMarginLeft = $(popupID).width() / 2;
			//alert(index + "번째");
			$(popupID).css({'z-index': 21, 'display': 'block', 'width': '100%'});
			$(popupID).center();
			//$(window).bind('resize', function() {
			//	$(popupID).center({transition:300});
			//});
			var backgroundSelector = $('<div id="' + dim + '" ></div>');
			backgroundSelector.appendTo('body');
			backgroundSelector.css({'width': '100%','height': '100%','display': 'none',	'background-color': '#000','filter':'alpha(opacity=50)','position': 'absolute','top': 0,'left': 0,'z-index': 20});
			backgroundSelector.fadeTo('fast', 0.5);
			$('.btnClose').click(function(){
				$(popupID).fadeOut();
				$("#" + dim).remove();
			});
		});

	}
};

//탭
stylet.tabs= {
	init:function(){
		var	tabs	= this;
		tabs.ui();
	},
	ui:function(){
		$('.loginTabs li a').bind("click",function(){
			var num = $(".loginTabs li a").index($(this));
			$('.loginTabs li').removeClass('active');
			$(this).parent().addClass('active');
			$(".loginTabConts > div").hide();
			$($(".loginTabConts > div")[num]).fadeIn();
			return false;
		});
	}
};

//관련 상품
stylet.prdToggle= {
	init:function(){
		var	prdToggle	= this;
		prdToggle.ui();
	},
	ui:function(){
		$(window).on("orientationchange load resize", function () {
			var w = $(window).width();
			//다른 상품
			$('.anotherPrd01').each(function(){
				var w = $(window).width();
				if(w > 640 && w <= 1024){
					$('.anotherPrd01 li').show(); $(this).find('li:gt(4)').hide();
				}else if(w <= 640){
					$('.anotherPrd01 li').show(); $(this).find('li:gt(2)').hide();
				}else{
					$('.anotherPrd01 li').show(); $(this).find('li:gt(5)').hide();
				};
			});
			//함께 본 상품
			$('.anotherPrd02').each(function(){
				var w = $(window).width();
				if(w > 640 && w <= 1024){
					$('.anotherPrd02 li').show(); $(this).find('li:gt(4)').hide();
				}else if(w <= 640){
					$('.anotherPrd02 li').show(); $(this).find('li:gt(2)').hide();
				}else{
					$('.anotherPrd02 li').show(); $(this).find('li:gt(5)').hide();
				};
			});
		});
		//다른 상품
		$('.bagNum').click(function(){
			var w = $(window).width();
			$('.anotherPrd01').each(function(){
				if(w > 670 && w <= 1024){
					if($('.anotherPrd01 li:visible').length <= 5) $('.anotherPrd01 li').show();
					else $('.anotherPrd01').find('li:gt(4)').hide();
				}else if(w <= 669){
					if($('.anotherPrd01 li:visible').length <= 4) $('.anotherPrd01 li').show();
					else $('.anotherPrd01').find('li:gt(2)').hide();
				}else{
					if($('.anotherPrd01 li:visible').length <= 6) $('.anotherPrd01 li').show();
					else $('.anotherPrd01').find('li:gt(5)').hide();
				};
			});
			return false;
		});
		//함께 본 상품
		$('.view .colum06 .titArea').click(function(){
			$(this).find('i').addClass('active');
			var w = $(window).width();
			$('.anotherPrd02').each(function(){
				if(w > 670 && w <= 1024){
					if($('.anotherPrd02 li:visible').length <= 5) {
						$('.anotherPrd02 li').show();
					}else{
						$('.anotherPrd02').find('li:gt(4)').hide();
						$(this).parent().parent().find('i').removeClass('active');
					}
				}else if(w <= 669){
					if($('.anotherPrd02 li:visible').length <= 4) {
						$('.anotherPrd02 li').show();
					}else{
						$('.anotherPrd02').find('li:gt(2)').hide();
						$(this).parent().parent().find('i').removeClass('active');
					}
				}else{
					if($('.anotherPrd02 li:visible').length <= 6){
						$('.anotherPrd02 li').show();
					}else{
						$('.anotherPrd02').find('li:gt(5)').hide();
						$(this).parent().parent().find('i').removeClass('active');
					}
				};
			});
			return false;
		});
	}
};
$(function(){
	stylet.init();

});


//모달 열기
var dim = 'modalDim';
function showModal(modalID) {
	var popupID = "#" + modalID;
	var popupMarginTop = $(popupID).height() / 2;
	var popupMarginLeft = $(popupID).width() / 2;

	$(popupID).css({
		'z-index': 21,
		'display': 'block',
		'width': '100%'
	});
	$(popupID).center();
	$(window).bind('resize', function() {
		$(popupID).center({transition:300});
	});

	var backgroundSelector = $('<div id="' + dim + '" ></div>');

	backgroundSelector.appendTo('body');

	backgroundSelector.css({
		'width': '100%',
		'height': '100%',
		'display': 'none',
		'background-color': '#000',
		'filter':'alpha(opacity=50)',
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'z-index': 20
	});

	backgroundSelector.fadeTo('fast', 0.8);

}
//모달 닫기
function hideModal(modalID) {
	$("#" + modalID).fadeOut();
	$("#" + dim).remove();
}