
MISS_MR	= {
	init:function(){
		var	h;
		h =	this;
		h.moreMenu.init();
		h.menuForm.init();
		h.tabs.init();
		h.sort.init();
		h.manageMenu.init();
		h.dropDown.init();
		h.masterMenu.init();
		h.cal.init();
		h.defaultH.init();
		h.resizeTextarea.init();
	}
};

//default height
MISS_MR.defaultH = {
	init:function(){
		var	defaultH	= this;
		defaultH.ui();
	},
	ui:function(){
		var h = $(window).height();
		var header = $('.header').height();
		var minH = h - header;
		$('.wrap').css('min-height',minH);
	}
};

//textarea resize
MISS_MR.resizeTextarea = {
	init:function(){
		var	defaultH	= this;
		defaultH.ui();
	},
	ui:function(){
		$('.msgInput').on( 'keyup', 'textarea', function (e){
			$(this).css('height', 'auto' );
			$(this).height( this.scrollHeight );
		});
		$('.msgInput').find( 'textarea' ).keyup();
	}
};


//달력
MISS_MR.cal = {
	init:function(){
		var	cal	= this;
		cal.ui();
	},
	ui:function(){
		//페이지용 .cycleGoWork{background:#ff314d}/*출근*/ .cycleAbsence{background:#000000}/*결근*/
		$( "#pageDatePicker" ).datepicker({
		})

		//레이어용
		$(".layerDatePicker").datepicker({
			changeMonth: true,
			changeYear: true,
			beforeShowDay: function(date) {
				var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $(".startlayerDatePicker").val());
				var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $(".endlayerDatePicker").val());
				return [true, date1 && ((date.getTime() == date1.getTime()) || (date2 && date >= date1 && date <= date2)) ? "dp-highlight" : ""];
			},
			onSelect: function(dateText, inst) {
				var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $(".startlayerDatePicker").val());
				var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $(".endlayerDatePicker").val());
				if (!date1 || date2) {
					$(".startlayerDatePicker").val(dateText);
					$(".endlayerDatePicker").val("");
				} else {
					$(".endlayerDatePicker").val(dateText);
				}
			}
		});
	}
};


//더보기 메뉴
MISS_MR.moreMenu = {
	init:function(){
		var	moreMenu	= this;
		moreMenu.ui();
	},
	ui:function(){
		$('#btnMoreMenu').toggle(function(){
			$(this).addClass('iconMoreMenuActive');
			$('.moreMenu').fadeIn();
		}, function() {
			$(this).removeClass('iconMoreMenuActive');
			$('.moreMenu').fadeOut();
		});
	}
};

//드롭다운 메뉴
MISS_MR.dropDown = {
	init:function(){
		var	dropDown	= this;
		dropDown.ui();
	},
	ui:function(){
		$('.dropDown > span').click(function(e){
			e.preventDefault();
			if($(this).next().length > 0){
				var fields = $(this).next();
				if (fields.is(':visible')){
					fields.slideUp('fast');
					$(this).find('i').removeClass('active');
				}else{
					$('.modifyList, .authBox .list').slideUp('fast');
					fields.slideDown('fast');
					$('.dropDown span i').removeClass('active');
					$(this).find('i').addClass('active');
				}
			};
		});	
	}
};

//메뉴판
MISS_MR.menuForm = {
	init:function(){
		var	menuForm	= this;
		menuForm.ui();
	},
	ui:function(){
		//메뉴판 리스트
		$('.orderMenuList > li > a').click(function(e){
			e.preventDefault();
			if($(this).next().length > 0){
				var fields = $(this).next();
				if (fields.is(':visible')){
					fields.slideUp('fast');
					$(this).removeClass('active');
				}else{
					$('.orderMenuList ul').slideUp('fast');
					fields.slideDown('fast');
					$('.orderMenuList > li > a').removeClass('active');
					$(this).addClass('active');
				}
			};
		});	
	}
};


//사장님 메뉴
MISS_MR.manageMenu = {
	init:function(){
		var	manageMenu	= this;
		manageMenu.ui();
	},
	ui:function(){
		$('.manageMenuList > li > a').click(function(e){
			e.preventDefault();
			if($(this).next().length > 0){
				var fields = $(this).next();
				if (fields.is(':visible')){
					fields.slideUp('fast');
					$(this).removeClass('active');
				}else{
					$('.manageMenuList > li > div').slideUp('fast');
					fields.slideDown('fast');
					$('.manageMenuList > li > a').removeClass('active');
					$(this).addClass('active');
				}
			};
		});	

		//메뉴판 관리
		$('.menuAdd .btnMenuDel, .callAdd .btnMenuDel, .authManage .btnMenuDel').click(function(e){
			e.preventDefault();
			$(this).parent().remove();
		})

		//메뉴 추가/삭제
		$('.menuAdd .btnAdd').click(function(e){
			e.preventDefault();
			$(this).parent().parent().find('ul').append('<li><div><span class="default02"><input type="text" value=""/></span> <span class="default02"><input type="text" value=""/></span></div><button type="button" class="icon iconMenuDel btnMenuDel">삭제</button></li>');
			$('.menuAdd .btnMenuDel').click(function(e){
				e.preventDefault();
				$(this).parent().remove();
			})
		})

		//호출메세지 추가/삭제
		$('.callAdd .btnAdd').click(function(e){
			e.preventDefault();
			$(this).parent().parent().find('ul').append('<li><div><span class="default02"><input type="text" value=""/></span></div><button type="button" class="icon iconMenuDel btnMenuDel">삭제</button></li>');
			$('.callAdd .btnMenuDel').click(function(e){
				e.preventDefault();
				$(this).parent().remove();
			})
		})

		//권한 그룹 추가/삭제
		$('.authManage .btnAdd').click(function(e){
			e.preventDefault();
			$(this).parent().parent().find('ul').append('<li class=""><div class="tit">&nbsp</div><button type="button" class="icon iconMenuDel btnMenuDel">삭제</button></li>');
			$('.authManage .btnMenuDel').click(function(e){
				e.preventDefault();
				$(this).parent().remove();
			})
		})
	}
};


//사장님 메뉴
MISS_MR.masterMenu = {
	init:function(){
		var	masterMenu	= this;
		masterMenu.ui();
	},
	ui:function(){
		$('.masterMenuList > li > a').click(function(e){
			e.preventDefault();
			if($(this).next().length > 0){
				var fields = $(this).next();
				if (fields.is(':visible')){
					fields.slideUp('fast');
					$(this).removeClass('active');
				}else{
					$('.masterMenuList > li > div').slideUp('fast');
					fields.slideDown('fast');
					$('.masterMenuList > li > a').removeClass('active');
					$(this).addClass('active');
				}
			};
		});	

//		//메뉴판 관리
//		$('.menuAdd .btnMenuDel, .callAdd .btnMenuDel, .authManage .btnMenuDel').click(function(e){
//			e.preventDefault();
//			$(this).parent().remove();
//		})
//
//		//메뉴 추가/삭제
//		$('.menuAdd .btnAdd').click(function(e){
//			e.preventDefault();
//			$(this).parent().parent().find('ul').append('<li><div><span class="default02"><input type="text" value=""/></span> <span class="default02"><input type="text" value=""/></span></div><button type="button" class="icon iconMenuDel btnMenuDel">삭제</button></li>');
//			$('.menuAdd .btnMenuDel').click(function(e){
//				e.preventDefault();
//				$(this).parent().remove();
//			})
//		})
//
//		//호출메세지 추가/삭제
//		$('.callAdd .btnAdd').click(function(e){
//			e.preventDefault();
//			$(this).parent().parent().find('ul').append('<li><div><span class="default02"><input type="text" value=""/></span></div><button type="button" class="icon iconMenuDel btnMenuDel">삭제</button></li>');
//			$('.callAdd .btnMenuDel').click(function(e){
//				e.preventDefault();
//				$(this).parent().remove();
//			})
//		})
//
//		//권한 그룹 추가/삭제
//		$('.authManage .btnAdd').click(function(e){
//			e.preventDefault();
//			$(this).parent().parent().find('ul').append('<li class=""><div class="tit">&nbsp</div><button type="button" class="icon iconMenuDel btnMenuDel">삭제</button></li>');
//			$('.authManage .btnMenuDel').click(function(e){
//				e.preventDefault();
//				$(this).parent().remove();
//			})
//		})
	}
};

//탭
MISS_MR.tabs = {
	init:function(){
		var	tabs	= this;
		tabs.ui();
	},
	ui:function(){
		$('.defaultTabCont > li').hide().filter('li:first').show();
		$('.defaultTab li a').bind('click',function(e){
			e.preventDefault();
			var num = $('.defaultTab li a').index($(this));
			$('.defaultTab li a').removeClass('active');
			$(this).addClass('active');
			$('.defaultTabCont > li').hide();
			$($('.defaultTabCont > li')[num]).show();
		});
	}
};

//정렬
MISS_MR.sort = {
	init:function(){
		var	sort	= this;
		sort.ui();
	},
	ui:function(){
		$('.btnState').toggle(function(){
			$('.sortMenu').addClass('open');
			$('.btnGrid').bind('click',function(e){
				e.preventDefault();
				$('.roomStateView').removeClass('listType');
			});
			$('.btnList').bind('click',function(e){
				e.preventDefault();
				$('.roomStateView').addClass('listType');
			});
		}, function() {
			$('.sortMenu').removeClass('open');
		});	
	}
};

$(function(){
	MISS_MR.init();
});


//모달 열기
var dim = 'dim';
function showModal(modalID) {
	var popupID = "#" + modalID;
	var popupMarginTop = $(popupID).height() / 2;
	var popupMarginLeft = $(popupID).width() / 2;

	$(popupID).addClass('open');
	$(popupID).css({
		'left': '49%',
		'z-index': 9999,
		'top': '45%',
		'margin-top': -popupMarginTop,
		'margin-left': -popupMarginLeft,
		'position': 'fixed',
		'display':'block'
	});

	var backgroundSelector = $('<div id="' + dim + '" ></div>');
	backgroundSelector.appendTo('body');
	backgroundSelector.css({
		'width': '100%',
		'height': $(document).height(),
		'display': 'none',
		'background-color': '#fff',
		'filter':'alpha(opacity=50)',
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'z-index': 9990
	});
	backgroundSelector.fadeTo('fast', 0.2);

}
//모달 닫기
function hideModal(modalID) {
	$("#" + modalID).removeClass('open').fadeOut('fast');
	$("#" + dim).remove();
}