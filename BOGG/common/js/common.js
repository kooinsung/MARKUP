$(document).ready(function(){

	//���� �Ѹ� ��ũ��Ʈ
	$(".noscript").remove();
	$('#slide img:first').fadeIn(1000, function() {
		$('#slide').cycle({
			fx:'scrollHorz',
			speed:2500,
			timeout:0,
			prev:'#prev',
			next:'#next',
			easing:'easeOutExpo',
			nowrap:1,
			pager:'#Navigator',
			after:onAfter
		});
		function onAfter(curr, next, opts) {
			if((opts.currSlide + 1) == 1){
				$('#next').show();
				$('#prev').hide();
			}else if((opts.currSlide + 1) == 3){
				$('#next').hide();
				$('#prev').show();
			}
		}
	});


	//GNB ��ũ��Ʈ
	$('#topmenu > li > a').bind('mouseover focus',function(){
		$('#topmenu ul').hide();
		$('#topmenu').height('90px');
		$(this).next().show();

		$('#topmenu > li > a > img').each(function(){
			$(this).attr('src',$(this).attr('src').replace('_on.gif','_off.gif'));
		});

		$myBtn = $(this).children('img');
		$myBtn.attr('src',$myBtn.attr('src').replace('_off.gif','_on.gif'));

	});

	$('#topmenu > li > ul > li > a').bind('focus',function(){
		$('#topmenu > li > ul > li > a > img').each(function(){
			$(this).attr('src',$(this).attr('src').replace('_on.gif','_off.gif'));
		});

		$myBtn = $(this).children('img');
		$myBtn.attr('src',$myBtn.attr('src').replace('_off.gif','_on.gif'));
	});
	$('#topmenu > li:last-child > ul > li:last-child > a:last-child').bind('focusout blur',function(){
		$('#topmenu ul').not(':animated').slideUp('slow');
		$('#topmenu').height('90px');
		$('#topmenu > li:last-child > a').find('img').attr("src", $('#topmenu > li:last-child > a').find('img').attr("src").replace("_on.gif","_off.gif"));
		$(this).find('img').attr("src", $(this).find('img').attr("src").replace("_on.gif","_off.gif"));

	});
	$('#topmenu > li > ul > li > a:last-child').bind('focusout blur',function(){
		$(this).find('img').attr("src", $(this).find('img').attr("src").replace("_on.gif","_off.gif"));
	});

	//�̹��� �ѿ��� ��ũ��Ʈ
	$('img.overImg').each(function() {
	 $(this).mouseover(function() {
	  if ($(this).attr('src').match('_off')) {
	   $(this).css('cursor', 'pointer');
	   $(this).attr('src', $(this).attr('src').replace('_off', '_on'));
	   $(this).mouseout(function() {
		$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
	   });
	  }
	 });
	});


	//�Ǹ޴� ��ũ��Ʈ - �����̳ʼҰ�
	$('.tabMenu > div').hide().filter('div:first').show();
	$('.tabMenu h4 a').bind('click focus',function(){
		var num = $('.tabMenu h4 a').index($(this));
		$('.tabMenu h4 a img').each(function(){
			$(this).attr('src', $(this).attr('src').replace('_on.', '_off.'));
		});

		//�����̳� �Ұ� �̹��� ����
		if(num == 0){
		  $('.desingerPic').fadeOut(100,function() {
			$(this).attr("src","../images/introduce/img_designer.jpg").fadeIn('fast');
		  });
		}else if(num == 1){
		  $('.desingerPic').fadeOut(100,function() {
			$(this).attr("src","../images/introduce/img_designer02.jpg").fadeIn('fast');
		  });

		}else if(num == 2){
		  $('.desingerPic').fadeOut(100,function() {
			$(this).attr("src","../images/introduce/img_designer03.jpg").fadeIn('fast');
		  });
		}
		
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_off.', '_on.'));
		$('.tabMenu > div').hide();
		$($('.tabMenu > div')[num]).show();
	});

	//iframe border ����
	var iframe = $('.shopFrame');
	if (iframe != null) {
	   var newIframe = iframe.clone();

	   newIframe.attr("frameborder", "0");
	   newIframe.attr("id", iframe.attr['id']);
	   newIframe.insertBefore(iframe);
	   iframe.remove();
	}



});


//�������� ����Ʈ �غ��� alert
function engAlert(){
	alert("comming soon!");
}

