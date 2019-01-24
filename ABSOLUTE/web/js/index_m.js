var AbsoluteIndex = (typeof AbsoluteIndex === 'undefined') ? {}	: console.log('......');

AbsoluteIndex = {

	visual:function(){
		var visual = $('#visual').bxSlider({auto: true,autoControls: false});
		$('.bx-next, .bx-prev, .bx-pager a').click(function(){
			visual.startAuto();
		});

		var prdRolling = $('#prdRolling').bxSlider({auto: true,autoControls: false});
		$('.bx-next, .bx-prev, .bx-pager a').click(function(){
			prdRolling.startAuto();
		});
	}

};


$(function(){
	AbsoluteIndex.visual();
});

