$(function () {
	//lnb 높이
	var db = document.body;
	var dde = document.documentElement;
	var docHeight = Math.max(db.scrollHeight, dde.scrollHeight, db.offsetHeight, dde.offsetHeight, db.clientHeight, dde.clientHeight) - 79;
	$('.lnb').height(docHeight);

	//fixed table
	var tableHeight = $('.fixedTable .defaultTable table thead').height();
	var tableWidth = $('.fixedTable .defaultTable table thead').width() + 1;
	$('.fixedTable .defaultTable table').clone().appendTo( ".fixedTable .copyTable" );
	$('.fixedTable .copyTable').css({'position':'absolute', 'top':'0', 'z-index':'1', 'width':tableWidth, 'height':tableHeight, 'overflow':'hidden'})

	var tableHeight2 = $('.wFixedTable .defaultTable table thead').height();
	var tableWidth2 = $('.wFixedTable .defaultTable table thead').width() + 1;
	$('.wFixedTable .defaultTable table').clone().appendTo( ".wFixedTable .copyTable" );
	$('.wFixedTable .copyTable').css({'position':'absolute','z-index':'1', 'width':tableWidth2, 'height':tableHeight2, 'overflow':'hidden'})
	$('.wFixedTable .copyTable table').css({'width':'100%'})
	$('.wFixedTable').scroll(function() {
	  $('.wFixedTable .copyTable').css('top', $(this).scrollTop() + "px");
	});

	//resize
	$(window).on("resize", function () {
		$('.lnb').height(docHeight);
		var tableHeight = $('.fixedTable .defaultTable table thead').height();
		var tableWidth = $('.fixedTable .defaultTable table thead').width() + 1;
		$('.fixedTable .defaultTable table').clone().appendTo( ".fixedTable .copyTable" );
		$('.fixedTable .copyTable').css({'position':'absolute', 'top':'0', 'z-index':'1', 'width':tableWidth, 'height':tableHeight, 'overflow':'hidden'})

		var tableHeight2 = $('.wFixedTable .defaultTable table thead').height();
		var tableWidth2 = $('.wFixedTable .defaultTable table thead').width() + 1;
		$('.wFixedTable .defaultTable table').clone().appendTo( ".wFixedTable .copyTable" );
		$('.wFixedTable .copyTable').css({'position':'absolute','z-index':'1', 'width':tableWidth2, 'height':tableHeight2, 'overflow':'hidden'})
		$('.wFixedTable .copyTable table').css({'width':'100%'})
		$('.wFixedTable').scroll(function() {
		  $('.wFixedTable .copyTable').css('top', $(this).scrollTop() + "px");
		});
	});
});


//modal open
var dim = 'dim';
function showModal(modalID) {
	var layer = "#" + modalID;
	var layer_bg = $('<div id="' + dim + '" ></div>');
	$(layer).css("top", Math.max(0, (($(window).height() - $(layer).height()) / 2) +  $(window).scrollTop()) + "px");
	$(layer).css("left", Math.max(0, (($(window).width() - $(layer).width()) / 2) +  $(window).scrollLeft()) + "px");
	$(layer).fadeIn('fast');
	$(layer_bg).appendTo('body');
	$(layer_bg).css({'width': '100%', 'height': '100%', 'display': 'none', 	'background-color': '#000', 	'filter':'alpha(opacity=50)', 'position': 'fixed', 'top': 0, 'left': 0, 'z-index': 998});
	$(layer_bg).fadeTo('fast', 0.8);

}

//modal close
function hideModal(modalID) {
	$("#" + modalID).fadeOut('fast');
	$("#" + dim).remove();
}

