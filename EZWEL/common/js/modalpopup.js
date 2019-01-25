//modal
var mask = 'modal';
function ShowModalPopup(modalPopupID){
	var popupID = $("#" + modalPopupID);
	var backgroundSelector = $('<div id="' + mask + '" ></div>');
	var winH = $(window).height();
	var winW = $(window).width();

	popupID.css({
		'position':'absolute',
		'top':'5%',
		'left':winW/2-$(popupID).width()/2
	});

	$(window).resize(function () {
		var winH = $(window).height();
		var winW = $(window).width();
		popupID.css({
			'position':'absolute',
			'top':'5%',
			'left':winW/2-$(popupID).width()/2
		});
	});

	popupID.show();

	if($("body").find("#modal").length==0){
		backgroundSelector.appendTo('body');
		backgroundSelector.css({
				'width': '100%',
				'height': '100%',
				'display': 'none',
				'background-color': '#000',
				'position': 'fixed',
				'top': 0,
				'left': 0,
				'z-index': 9990
		});
		backgroundSelector.fadeTo('fast', 0.8);
	}

	//모달레이어 위치로 스크롤 이동
	$('html, body').animate({scrollTop:$(popupID).offset().top}, "slow", "easeOutExpo" );

	//모달로드시 iscroll 새로고침
	myScroll.refresh();
}

//main을 제외한 나머지는 ajax로 html을 파싱하여 뿌리기 때문에 remove
function HideModalPopup(modalPopupID) {
	$("#" + modalPopupID).remove();
	$("#" + mask).remove();

}

//remove 시키지 않고 hide만 시킨다. html 미리 그려놓고 show/hide 하는 용도
function viewHideModalPopup(modalPopupID) {
	$("#" + modalPopupID).hide();
	$("#" + mask).remove();
}

//iscroll
var myScroll;
function initScroll() {
	try{
		myScroll = new iScroll("scroll", {
			hideScrollbar:false
		});
	}catch(e){
		
	}

}

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
