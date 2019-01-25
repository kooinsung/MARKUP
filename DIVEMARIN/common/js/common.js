$(document).ready(function(){

	//기타
	$('.photoGallery li:nth-child(4n)').css('margin-right','0');
	$('.paging .number .on').prev().css('border-right','0');
	//포토갤러리 오버효과
	$('.photoGallery li').hover(
	  function () {
		$(this).find('div').append("<div class='thumbBorder'></div>");
	  },
	  function () {
		 $('.thumbBorder').remove();
	  }
	);

	//메인 다이렉트메뉴 오버효과
	$('.directMenu li').hover(
	  function () {
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_off', '_on'));
	  },
	  function () {
		 $(this).find('img').attr('src', $(this).find('img').attr('src').replace('_on', '_off'));
	  }
	);


	//협력사
	$(".coop select").change(function () {
		window.open(this.value,	'_blank');
	});

	//메인 롤링 컨트롤
	$('#play').click(function(){
		$('.smallRolling .cycle-slideshow').cycle('resume');
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_off', '_on'));
		$('#stop').find('img').attr('src', $('#stop').find('img').attr('src').replace('_on', '_off'));
	});

	$('#stop').click(function(){
		$('.smallRolling .cycle-slideshow').cycle('pause');
		$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_off', '_on'));
		$('#play').find('img').attr('src', $('#play').find('img').attr('src').replace('_on', '_off'));
	});

	//select
	//$("#srchSelect, #emailSelect, #phoneSelect, #lavelSelect, #kindSelect, #phoneSelect02, #scheduleHour, #scheduleMinute, #mailingLevel, #mailingMail, #scheduleHour02, #scheduleMinute02").selectbox();

	//GNB
	$('.main #gnb li h2 a').bind('mouseenter ',function(){
		$('.main #gnb ul').hide();
		$('.main #gnb').show();
		$('.main #content').animate({"margin-top":"50px"}, "fast");
		$(this).parent().next().slideUp();
		$('.main #gnb > li > h2 > a > img').each(function(){
			$(this).attr('src',$(this).attr('src').replace('_on','_off'));
		});
		$myBtn = $(this).children('img');
		$myBtn.attr('src',$myBtn.attr('src').replace('_off','_on'));
	}).bind('mouseleave ',function(){
		$('.main #gnb > li > h2 > a > img').each(function(){
			$(this).attr('src',$(this).attr('src').replace('_on','_off'));
		});
		$myBtn = $(this).children('img');
		$myBtn.attr('src',$myBtn.attr('src').replace('_on','_off'));
	});

	$('.main #gnb, #gnb li > ul').bind('mouseleave ',function(){
		$('.main #gnb ul').hide();
		$('.main #content').animate({"margin-top":"0px"}, "fast");
	});


	$('.sub #gnb li h2 a').bind('mouseenter ',function(){
		$('.sub #gnb ul').hide();
		$('.sub #gnb').animate({"height":"100px"}, "fast");
		$('.sub #content').animate({"margin-top":"50px"}, "fast");
		$(this).parent().next().slideDown('fast');
		$('.sub #gnb > li > h2 > a > img').each(function(){
			$(this).attr('src',$(this).attr('src').replace('_on','_off'));
		});
		$myBtn = $(this).children('img');
		$myBtn.attr('src',$myBtn.attr('src').replace('_off','_on'));
	});



     $('img.rollover').each(function() {
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

	if((document.location.href.indexOf("/divemarin/") > -1)){
		$('#gnb > li').eq(0).find('h2 img').attr('src', $('#gnb > li').eq(0).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-1').show();
	}else if((document.location.href.indexOf("/racha/") > -1)){
		$('#gnb > li').eq(1).find('h2 img').attr('src', $('#gnb > li').eq(1).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-2').show();
	}else if((document.location.href.indexOf("/liveaboad/") > -1)){
		$('#gnb > li').eq(2).find('h2 img').attr('src', $('#gnb > li').eq(2).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-3').show();
	}else if((document.location.href.indexOf("/phuketdiving/") > -1)){
		$('#gnb > li').eq(3).find('h2 img').attr('src', $('#gnb > li').eq(3).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-4').show();
	}else if((document.location.href.indexOf("/license/") > -1)){
		$('#gnb > li').eq(4).find('h2 img').attr('src', $('#gnb > li').eq(4).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-5').show();
	}else if((document.location.href.indexOf("/point/") > -1)){
		$('#gnb > li').eq(5).find('h2 img').attr('src', $('#gnb > li').eq(5).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-6').show();
	}else if((document.location.href.indexOf("/recommend/") > -1)){
		$('#gnb > li').eq(6).find('h2 img').attr('src', $('#gnb > li').eq(6).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-7').show();
	}else if((document.location.href.indexOf("/community/") > -1)){
		$('#gnb > li').eq(7).find('h2 img').attr('src', $('#gnb > li').eq(7).find('h2 img').attr('src').replace('_off', '_on'));
		$('.depth02-8').show();
	};


	// 공통 이미지 롤오버 스크립트
	$('img.overImg').each(function() {
		$(this).mouseenter(function() {
			if ($(this).attr('src').match('_off')) {
				$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
				$(this).mouseleave(function() {
				$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
				});
			};
		});
	});

	//faq 
	$('#faq li > a').click(function(e){
		if($(this).next('ul').length > 0){
			e.preventDefault();
			var subNav = $(this).next('ul');
			if (subNav.is(':visible')){
				subNav.slideUp('fast')
				$(this).removeClass("selected");
			}else{
				$('#faq ul:visible').slideUp('fast');
				subNav.slideDown('fast');
				$("a.selected").removeClass("selected");
				$(this).addClass("selected");
			}
		}
		
	});

	//첨부파일
	$('.addFile').on('click',function () {
		$('.writeFile').last().after('<tr class="writeFile"><th><label for="addFile' + $(".writeFile").length + '"> 첨부파일' + $(".writeFile").length + '</label></th><td><input type="text" id="addFile' + $(".writeFile").length + '" name="addFile' + $(".writeFile").length + '" title="첨부파일" style="width:50%;" readonly /><button type="button" class="btnEnter" id="fileUp' + $(".writeFile").length + '" name="fileUp' + $(".writeFile").length + '" onclick="showPassword(' + $(".writeFile").length + ');">파일등록</button></td></tr>');
		if($('.writeFile').length > 20){
			$(this).hide();
		};
	});
	$('.removeFile').on('click',function () {
		if($('.writeFile').length > 1){
			$('.writeFile').last().remove();
		};
		if($('.writeFile').length < 20){
			$('.addFile').show();
		};
	});

});

//패스워드 레이어
function showPassword(seq , inputtype) {
	var isIE6 = (navigator.appVersion.toLowerCase().indexOf('msie 6') > 0);
	var popupID = $('#layerPassword');
	var popupMarginTop = $(popupID).height() / 2;
	var popupMarginLeft = $(popupID).width() / 2;

	$(popupID).css({
		'left': '50%',
		'z-index': 9999
	});

	if (isIE6) {
		$(popupID).css({
			'top': $(document).scrollTop(),
			'margin-top': $(window).height() / 2 - popupMarginTop,
			'margin-left': -popupMarginLeft,
			'display': 'block',
			'position': 'absolute'
		});
	}else{
		$(popupID).css({
			'top': '50%',
			'margin-top': -popupMarginTop,
			'margin-left': -popupMarginLeft,
			'display': 'block',
			'position': 'fixed'
		});
	}
	if (inputtype != null)
	{
		document.regFrm2.passwd.focus();
		document.regFrm2.seq.value = seq ;
		document.regFrm2.inputtype.value = inputtype ;
	}else{
		document.regFrm.passwd.focus();
		document.regFrm.seq.value = seq ;
	}
};
function HidePassword() {
	var popupID = $('#layerPassword');
	$(popupID).css('display', 'none');
};


/* 공통 사용 modal*/
function ShowModalPopup(modalPopupID) {
	var isIE6 = (navigator.appVersion.toLowerCase().indexOf('msie 6') > 0);
	var popupID = "#" + modalPopupID;
	var popupMarginTop = $(popupID).height() / 2;
	var popupMarginLeft = $(popupID).width() / 2;

	$(popupID).css({
		'left': '50%',
		'z-index': 9999
	});

	if (isIE6) {
		$(popupID).css({
			'top': $(document).scrollTop(),
			'margin-top': $(window).height() / 2 - popupMarginTop,
			'margin-left': -popupMarginLeft,
			'display': 'block',
			'position': 'absolute'
		});
	}else{
		$(popupID).css({
			'top': '50%',
			'margin-top': -popupMarginTop,
			'margin-left': -popupMarginLeft,
			'display': 'block',
			'position': 'fixed'
		});
	}

}
function HideModalPopup(modalPopupID) {
	$("#" + modalPopupID).css('display', 'none');
}