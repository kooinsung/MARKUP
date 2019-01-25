$(function(){

	//주메뉴
//	$("#gnb > li > a").click(function(){
//		$(".gnbDepth2").css("display","none");
//		$(".gnbDepth3").css("display","none");
//		$(this).next().css("display","block");
//		$("#gnb > li").removeClass("on");
//		$(this).parent().addClass("on");
//		$(this).next().children("li").removeClass("on");
//		$(this).next().children("li:first").addClass("on");
//		$(this).next().children("li:first").children().next().css("display","block");
//		$(this).next().children("li:first").children().next().children("li").removeClass("on");
//		$(this).next().children("li:first").children().next().children("li:first").addClass("on");
//		return false;
//	});
//	$(".gnbDepth2 > li > a").click(function(){
//		$(".gnbDepth3").css("display","none");
//		$(this).next().css("display","block");
//		$(".gnbDepth2 > li").removeClass("on");
//		$(this).parent().addClass("on");
//		$(this).next().children("li").removeClass("on");
//		$(this).next().children("li:first").addClass("on");
//		return false;
//	});
//	$(".gnbDepth3 > li > a").click(function(){
//		$(".gnbDepth3 > li").removeClass("on");
//		$(this).parent().addClass("on");
//		return false;
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
