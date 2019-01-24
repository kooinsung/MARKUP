var AbsoluteDefault = (typeof AbsoluteDefault === 'undefined') ? {}	: console.log('......');


AbsoluteDefault = {
	detailRolling:function(){
		var visual = $('#bigs').bxSlider({auto: true,autoControls: false});
		$('.bx-next, .bx-prev, .bx-pager a').click(function(){
			visual.startAuto();
		});
	},
	detailAco:function(){
	  $('.btnToggles a').on('click',function(e) {
			if($(this).parent().next('div').length > 0){
				e.preventDefault();
				var subNav = $(this).parent().next('div');
				if (subNav.is(':visible')){
					 subNav.slideUp('fast')
					 $(this).parent().removeClass('active'); 
				}else{
					 $('.toggleBox').slideUp('fast');
					 subNav.slideDown('fast');
					 $('.btnToggles').removeClass('active');
					 $(this).parent().addClass('active');
				}
		   };
	  });
	}
};


$(function(){
	AbsoluteDefault.detailRolling();
	AbsoluteDefault.detailAco();
});



