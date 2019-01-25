var	KH = (typeof KH === 'undefined') ? {}	: console.log('......');

KH	= {
	init:function(){
		var	h;
		h =	this;
		h.common.init();

	}
};


KH.common = {
	init:function(){
		var	common	= this;
		common.ui();
	},
	ui:function(){
		//롤오버
		$('img.rollover').each(function() {
			$(this).mouseover(function() {
				if ($(this).attr('src').match('_off')) {
					$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
					$(this).mouseout(function() {
						$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
					});
				}
			});
		});

		//gnb
				$('.gnb > li > a').bind("mouseover",function(){
		          var num = $(".gnb > li > a").index($(this));
		          $(".gnb > li > a img").each(function(){
		               $(this).attr("src", $(this).attr("src").replace("_on.png", "_off.png"));
		          });
		         
		          $(this).find("img").attr("src", $(this).find("img").attr("src").replace("_off.png", "_on.png"));
		          $(".depth02Area > li").hide();
		          $($(".depth02Area > li")[num]).show();
		     });
		$('.depth02Area').bind('mouseleave',function(){
			$('.depth02Area > li').hide();
		});
		
		
		
		
/*
		$('.gnb > li > a').bind('mouseenter',function(){
			$('.gnb .depth02').hide();
			$(this).next().show();

			$('.gnb > li > a > img').each(function(){
				$(this).attr('src',$(this).attr('src').replace('_on.png','_off.png'));
			});

			$myBtn = $(this).children('img');
			$myBtn.attr('src',$myBtn.attr('src').replace('_off.png','_on.png'));
		});

		$('.gnbArea').bind('mouseleave',function(){
			$('.gnb .depth02').hide();
		});
*/

		//링크
		$( "#btnLink" ).toggle(
		  function() {
		    $('.familySite').slideDown();
		  }, function() {
		    $('.familySite').slideUp();
		  }
		);		
	}
};




$(function(){
	KH.init();
});


