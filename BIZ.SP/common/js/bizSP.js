var	bizSP = (typeof bizSP === 'undefined') ? {}	: console.log('......');

bizSP	= {
	init:function(){
		var	h;
		h =	this;
		h.tree.init();
		h.lnb.init();
		h.datePicker.init();
		h.customScroll.init();
		h.customSelect.init();
	}
};

bizSP.tree	= {
	init:function(){
		var	common	= this;
		common.ui();
	},
	ui:function(){
		//메뉴관리
		$('#tt').tree({
			url: '../../data/tree_data.json',
			onlyLeafCheck : true,
			onCheck: function(node,checked){ 
				var hit = $(node.target).children("span.tree-hit");  
				if (hit.hasClass("tree-collapsed")) {  
					hit.removeClass("tree-collapsed").addClass("tree-expanded");  
					hit.next().addClass('tree-folder-open');  
					var ul = $(node.target).next();  
					ul.css('display','block');  
				} else if (hit.hasClass("tree-expanded")) {  
					hit.removeClass("tree-expanded").addClass("tree-collapsed");  
					hit.next().removeClass('tree-folder-open');  
					var ul = $(node.target).next();  
					ul.css('display','none');  
				} else { 
					var checkbox = $(node.target).children("span.tree-checkbox");  
					$('span.tree-checkbox').removeClass("tree-checkbox1").addClass("tree-checkbox0");  
					if(checkbox.hasClass("tree-checkbox0")) {  
						checkbox.removeClass("tree-checkbox0").addClass("tree-checkbox1");  
					} else {  
						checkbox.removeClass("tree-checkbox1").addClass("tree-checkbox0");  
					}  
				}  
			},
			onClick:function(node){  
				var hit = $(node.target).children("span.tree-hit");  
				if (hit.hasClass("tree-collapsed")) {  
					hit.removeClass("tree-collapsed").addClass("tree-expanded");  
					hit.next().addClass('tree-folder-open');  
					var ul = $(node.target).next();  
					ul.css('display','block');  
				} else if (hit.hasClass("tree-expanded")) {  
					hit.removeClass("tree-expanded").addClass("tree-collapsed");  
					hit.next().removeClass('tree-folder-open');  
					var ul = $(node.target).next();  
					ul.css('display','none');  
				} else { 
					var checkbox = $(node.target).children("span.tree-checkbox");  
					$('span.tree-checkbox').removeClass("tree-checkbox1").addClass("tree-checkbox0");  
					if(checkbox.hasClass("tree-checkbox0")) {  
						checkbox.removeClass("tree-checkbox0").addClass("tree-checkbox1");  
					} else {  
						checkbox.removeClass("tree-checkbox1").addClass("tree-checkbox0");  
					}  
				}  
			}
		});

		//메뉴권한관리
		$('#tt02').tree({
			url: '../../data/tree_data.json'
		});
		$('#btnTreeClose').click(function(){
			$('#tt, #tt02').tree('collapseAll');
			return false;
		});
		$('#btnTreeView').click(function(){
			$('#tt, #tt02').tree('expandAll');
			return false;
		});
	}
};


bizSP.lnb	= {
	init:function(){
		var	lnb	= this;
		lnb.ui();
	},
	ui:function(){
		$('.leftMenu > li > a').click(function(e){
			if($(this).next().length > 0){
				var fields = $(this).next();
				if (fields.is(':visible')){
					fields.slideUp(400, 'easeOutQuad')
					$(this).removeClass('active');
					$(this).parent().removeClass('active');
				}else{
					e.preventDefault();
					$('.leftMenu ul').slideUp(400, 'easeOutQuad');
					fields.slideDown(400, 'easeOutQuad');
					$('.leftMenu > li > a').removeClass('active');
					$('.leftMenu li').removeClass('active');
					$(this).addClass('active');
					$(this).parent().addClass('active');
				}
			};
		});	
	}
};
bizSP.datePicker	= {
	init:function(){
		var	datePicker	= this;
		datePicker.ui();
	},
	ui:function(){

		$( ".date-picker" ).datepicker({
				inline: true,
				showOtherMonths: true
		}).datepicker('widget').wrap('<div class="ll-skin-melon"/>');
	}
};

bizSP.customSelect	= {
	init:function(){
		var	customSelect	= this;
		customSelect.ui();
	},
	ui:function(){
		$(".customSelect").selectbox();
	}
};

bizSP.customScroll	= {
	init:function(){
		var	customScroll	= this;
		customScroll.ui();
	},
	ui:function(){

	// IE version check
	var ua = window.navigator.userAgent;
	if(ua.indexOf('Trident/4.0') >= 0 || ua.indexOf('MSIE 7.0') >= 0){

	}else{
			$(window).load(function(){
				$(".scrollTable").mCustomScrollbar({
					axis:"x",
					theme:"dark"
				});

			});
			$(window).load(function(){

				$(".layerInner .long .innerBox, .layerInner .long .innerBox02").mCustomScrollbar({
						axis:"yx",
						theme:"dark"
				});
			});

			$(window).load(function(){

				$(".layerInner .long .innerBox03").mCustomScrollbar({
						axis:"y",
						theme:"dark"
				});
			});
	}





	}
};
$(function(){
	bizSP.init();


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
		'z-index': 9997,
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
		'z-index': 9996
	});

	backgroundSelector.fadeTo('fast', 0.8);
	backgroundSelector.click(function(){
		$("#" + modalID).fadeOut();
		$("#" + dim).remove();
	});

}
//모달 닫기
function hideModal(modalID) {
	$("#" + modalID).fadeOut();
	$("#" + dim).remove();
}


var dim02 = 'dim02';
function showModal02(modalID02) {
	var popupID = "#" + modalID02;
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

	var backgroundSelector = $('<div id="' + dim02 + '" ></div>');

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
		'z-index': 9998
	});

	backgroundSelector.fadeTo('fast', 0.3);
	backgroundSelector.click(function(){
		$("#" + modalID02).fadeOut();
		$("#" + dim02).remove();
	});

}
//모달 닫기
function hideModal02(modalID02) {
	$("#" + modalID02).fadeOut();
	$("#" + dim02).remove();
}