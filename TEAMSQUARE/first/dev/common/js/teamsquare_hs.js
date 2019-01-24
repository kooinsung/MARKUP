var	teamSquare = (typeof teamSquare === 'undefined') ? {}	: console.log('......');

teamSquare	= {
	init:function(){
		var	h;
		h =	this;
		h.common.init();
		h.menu.init();
		h.member.init();
		h.teamPage.init();
		h.teamSrch.init();
		h.cs.init();
		h.file.init();
	}
};

teamSquare.common	= {
	init:function(){
		var	common	= this;
		common.ui();
	},
	ui:function(){
		//placeholder
		 if ($.browser.msie) {
			$('input[placeholder]').each(function() {
				var input = $(this);
				$(input).val(input.attr('placeholder'));
				$(input).focus(function() {
					if (input.val() == input.attr('placeholder')) {
						input.val('');
					}
				});
				$(input).blur(function() {
					if (input.val() == '' || input.val() == input.attr('placeholder')) {
						input.val(input.attr('placeholder'));
					}
				});
			});
		}

		//말줄임
		$(".ellipsis").dotdotdot();

		//custom 셀렉트 박스
		$(".mid").selectbox();

		//기타 css제어
		$('.infoInner li:nth-child(2) span').css('width','auto');
		$('.info01 .sbHolder').eq(0).css('margin-right','10px');
		$('.joinInner .label').eq(0).css('margin-top','0px');
		$('.bDay .sbHolder').eq(0).css('width','100px').find('.sbSelector, .sbOptions').css('width','100px');
		$('.faqList > li:last-child').css('border','0');
		$('.teamInfo .teamInfoList li:last-child, .teamInfo .userInfoList li:last-child, .teamInfo .questInfoList li:last-child').css('border-bottom','0');
	}
};

//메뉴 관련
teamSquare.menu= {
	init:function(){
		var	menu	= this;
		menu.ui();
	},
	ui:function(){
		//로그인 후 레이어
		$('.afterLogin a[name=showLayer]').bind('click',function(e){
			if($(this).parent().find('.defaultLayer').length > 0){
				e.preventDefault();
				var layer = $(this).parent().find('.defaultLayer');
				if (layer.is(':visible')){
					if($(this).attr('href') == "#noticesLayer"){
						$('.iconMsg').removeClass('active');
					}else if($(this).attr('href') == "#myLayer"){
						$('.afterLogin .myMenu .thumb').removeClass('active');
					}
					layer.slideUp('fast', 'easeOutQuad')
				}else{
						$('.iconMsg, .afterLogin .myMenu .thumb').removeClass('active');
					$('.defaultLayer').fadeOut('fast');
					if($(this).attr('href') == "#noticesLayer"){
						$('.iconMsg').addClass('active');
					}else if($(this).attr('href') == "#myLayer"){
						$('.afterLogin .myMenu .thumb').addClass('active');
					}
					layer.slideDown('fast', 'easeOutQuad');
				}
			}
		});

		//모바일 메뉴
		$('#btnMenu').toggle(function() {
			$('.defaultLayer').slideUp('fast', 'easeOutQuad');
			$(this).addClass('active');
			$('#gnb').slideDown('fast', 'easeOutQuad');
		}, function() {
			$(this).removeClass('active');
			$('#gnb').slideUp('fast', 'easeOutQuad');
		});

	}
};

//회원 관련
teamSquare.member= {
	init:function(){
		var	member	= this;
		member.ui();
	},
	ui:function(){
		//회원가입 관심분야
		$('#fieldList a').click(function(e){
			e.preventDefault();
			if($(this).next('div').length > 0){
				var fields = $(this).next('div');
				if (fields.is(':visible')){
					fields.slideUp(400, 'easeOutQuad')
					$(this).find('i').removeClass('active');
				}else{
					$('#fieldList div').slideUp(400, 'easeOutQuad');
					fields.slideDown(400, 'easeOutQuad');
					$(".iconAco.active").removeClass("active");
					$(this).find('i').addClass('active');
				}
			};
		});
	}
};

//팀페이지
teamSquare.teamPage= {
	init:function(){
		var	teamPage	= this;
		teamPage.ui();
	},
	ui:function(){
		//팀정보 토글
		$('.btnMoreTeam').toggle(function() {
			$(this).find('button').addClass('active');
			$('.teamInfo .btnApply, .teamInfoList').stop().slideDown(400, 'easeOutQuad');
			$('.userInfoList').animate({ height:185}, 500 );
			
		}, function() {
			$(this).find('button').removeClass('active');
			$('.teamInfo .btnApply, .teamInfoList').stop().slideUp(400, 'easeOutQuad');
			$('.userInfoList').animate({ height:35}, 500 );
		});

		//작성 메뉴
		$('.writeBox button').bind("click",function(){
			var writeIndex = $(".writeBox button").index($(this));
			$('.writeBox button').removeClass('active');
			$(this).addClass('active');
			$(".writeLayer , .writeLayer > ul > li").stop().hide();
			$($(".writeLayer > ul > li")[writeIndex]).stop().fadeIn();
			$(".writeLayer").fadeIn();
		});

		//검색
		$('#btnSrch').bind("click",function(){
			$(".writeLayer, .writeLayer > ul > li").hide();
			$('.srchArea').fadeIn();
			$('#btnSrchClose').click(function(){
				$('.writeLayer').hide();
				$('.srchArea').fadeOut();
			});
		});

		//작성 레이어
		$('.btnEdit').bind("click",function(){
			var parentH = $(this).parent().parent().find('.profileLayer').height();
			$(this).parent().parent().innerHeight(parentH);
			$(this).parent().parent().find('.profileLayer').fadeIn();
			$('.btnCancel').click(function(){
				$(this).parent().parent().parent().fadeOut();
				$(this).parent().parent().parent().parent().css('height','auto');
			});
		});
		
		//글작성 레이어 0322추가
		$('.btnEditText').bind("click",function(){
			$(this).parent().parent().parent().parent().find('.writeDetailBox').hide();
			$(this).parent().parent().parent().parent().find('.writeModiBox').fadeIn();
			//$('.writeDetail').hide();
			$('.btnCancel').click(function(){
				$(this).parent().parent().parent().parent().find('.writeModiBox').hide();
				$(this).parent().parent().parent().parent().find('.writeDetailBox').fadeIn();
			});
		});

	}
};

//팀구함
teamSquare.teamSrch= {
	init:function(){
		var	teamSrch	= this;
		teamSrch.ui();
	},
	ui:function(){
		//팀구함 조건 검색 토글
		$('.btnCondition').toggle(function() {
			$(this).addClass('active');
			$('.selectList').stop().slideDown(400, 'easeOutQuad');
		}, function() {
			$(this).removeClass('active');
			$('.selectList').stop().slideUp(400, 'easeOutQuad');
		});
	}
};

//input file
teamSquare.file= {
	init:function(){
		var	file	= this;
		file.ui();
	},
	ui:function(){
		var fileWrap = $('<div/>').css({height:0,width:0,'overflow':'hidden'});
		var fileInput = $(':file').wrap(fileWrap);
		fileInput.change(function(){
			$this = $(this);
			$('#file').text($this.val());
		})
		$('#file').click(function(){
			fileInput.click();
		}).show();
	}
};

//cs
teamSquare.cs= {
	init:function(){
		var	cs	= this;
		cs.ui();
	},
	ui:function(){
		$('.faqList > li > a').click(function(e){
			e.preventDefault();
			if($(this).next().length > 0){
				var fields = $(this).next();
				if (fields.is(':visible')){
					fields.slideUp(400, 'easeOutQuad')
					$(this).removeClass('active');
				}else{
					$('.faqList ul').slideUp(400, 'easeOutQuad');
					fields.slideDown(400, 'easeOutQuad');
					$(".iconFaqToggle.active").removeClass("active");
					$(this).addClass('active');
				}
			};
		});
	}
};


$(function(){
	teamSquare.init();
});


//모달 열기
var dim = 'dim';
function showModal(modalID) {
	var popupID = "#" + modalID;
	var popupMarginTop = $(popupID).height() / 2;
	var popupMarginLeft = $(popupID).width() / 2;

	$(popupID).hide();

	$(popupID).css({
		'left': '50%',
		'z-index': 9999,
		'top': '50%',
		'margin-top': -popupMarginTop,
		'margin-left': -popupMarginLeft,
		'display': 'block',
		'position': 'fixed'
	});

	var backgroundSelector = $('<div id="' + dim + '" ></div>');

	backgroundSelector.appendTo('body');

	backgroundSelector.css({
		'width': '100%',
		'height': $(document).height(),
		'display': 'none',
		'background-color': '#000',
		'filter':'alpha(opacity=50)',
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'z-index': 9990
	});

	backgroundSelector.fadeTo('fast', 0.8);

}
//모달 닫기
function hideModal(modalID) {
	$("#" + modalID).fadeOut();
	$("#" + dim).remove();
}