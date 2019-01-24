var AbsoluteIndex = (typeof AbsoluteIndex === 'undefined') ? {}	: console.log('......');

AbsoluteIndex = {

	visual:function(){
		var visual = $('#visual').bxSlider({mode:'fade',auto: true,autoControls: false});
		$('.bx-next, .bx-prev, .bx-pager a').click(function(){
			visual.startAuto();
		});
	},
	product:function(){
		var timeInterval, tabCount = 0, currentIndex = 1;
		tabCount = $('.smalls').find('li').length;
		var tabObj = $('.bigs li');
		changeTabIndex();
		timeInterval = setInterval(function(){
			changeTabIndex();
		},2 * 1000);
		
		function changeTabIndex(){
			if(currentIndex > tabCount){
				currentIndex = 1;
			}
			$('.smalls li').removeClass('active');
			var currentObj = $('.smalls').find('li a').eq(currentIndex - 1);
			currentObj.parent().addClass('active');
			currentObj.parent().each(function(index){
				var p = $(this).position();
				$('.hover').animate({top:p.top, left:p.left}, 500);
			});

			$('.bigs li').hide();
			$(tabObj).eq(currentIndex-1).show();
			currentIndex++;
		};
		
		$('.smalls li a').mouseenter(function(){
			clearInterval(timeInterval);
		}).mouseleave(function(){
			timeInterval = setInterval(function(){
				changeTabIndex();
			},2 * 1000);
		});
		
		$('.smalls li a').click(function(){
			$('.smalls li').removeClass('active');
			var currentObj = $(this);
			currentIndex = $('.smalls').find('li a').index($(this)) + 1;
			currentObj.parent().addClass('active');
			currentObj.parent().each(function(index){
				var p = $(this).position();
				$('.hover').animate({top:p.top, left:p.left}, 500);
			});
			$('.bigs li').hide();
			$(tabObj).eq(currentIndex-1).show();
			currentIndex++;
			return false;
		});
	}
};


$(function(){
	AbsoluteIndex.visual();
	AbsoluteIndex.product();
});

