$(function(){


	//lnb
	$('#leftSide li:has(ul)').addClass("has-sub");
		$('#leftSide').find('.has-sub').find('a:first').addClass("sub");
		$('#leftSide ul ul').addClass("sub-menu");
		$(".sub-menu").hide();
		$('#leftSide li a').click(function() {
		var checkElement = $(this).next(); 
		
		$('#leftSide li').removeClass('on');
		$(this).parentsUntil("#leftSide").addClass('on');
		
		if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
			$(this).closest('li').removeClass('on');
			checkElement.slideUp('normal');
			return false;
		}
		 
		if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
			$('#leftSide ul:visible').not(checkElement.parentsUntil('#leftSide')).slideUp('normal');
			checkElement.slideDown('normal');
			return false;
		}
	});

//	$('.lnb > li > a').click(function(e){
//		if($(this).next('ul').length > 0){
//			e.preventDefault();
//			var subNav = $(this).next('ul');
//			if (subNav.is(':visible')){
//				subNav.slideUp(400)
//				$(this).removeClass("on");
//			}else{
//				$('.lnb ul').slideUp(400);
//				subNav.slideDown(400);
//				$(this).parent().addClass("on");
//			}
//		};
//	});

	//placeholder 처리
	$('input[placeholder]').each(function(){
		var input = $(this);
		$(input).val(input.attr('placeholder'));
		$(input).focus(function(){
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			}
		});
		$(input).blur(function(){
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
			}
		});
	});
	
	//테이블 하이라이트
	$(function(){
		$('.tbl_list tbody tr').mouseover(function(){
			$(this).children().addClass('selectedRow');
		}).mouseout(function(){
			$(this).children().removeClass('selectedRow');
		});
	});

	//첨부파일 리스트 추가&삭제
	$('.addBtn').click(function(){
		var obj = $(this).parent().prev().children("li:first").clone(true);
		$(this).parent().prev().append(obj);
		return false;
	});
	$('.delBtn').click(function(){
		if($(this).parent().prev().children().length > 1){
			$(this).parent().prev().children("li:last").remove();
		};
		return false;
	});

	//달력 일자 선택
	$(".datepicker").datepicker({
		showButtonPanel:true,
		dateFormat:"yy-mm-dd",
		showOn:"button",
		buttonImage:"../images/btn_calendar.png",
		buttonImageOnly:true
	});
	$(".datepicker2").datepicker({
		showButtonPanel:true,
		dateFormat:"yy-mm-dd",
		showOn:"button",
		buttonImage:"../images/btn_calendar.png",
		buttonImageOnly:true
	});

});

// 날짜 탭 변수 
function setDate(arr){
	var nowDate = new Date();
	$(".datepicker2").val(jQuery.datepicker.formatDate(jQuery.datepicker.ATOM, nowDate));
	if(arr == 7){ // 일주일전
		nowDate.setDate(nowDate.getDate()-arr);
	}else{
		nowDate.setMonth(nowDate.getMonth()-arr);
	}
	$(".datepicker").val(jQuery.datepicker.formatDate(jQuery.datepicker.ATOM, nowDate));
}
