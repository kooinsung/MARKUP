/*----------------------------------------------------------------------------
*
* 파스타 프로젝트 전용 js
*
----------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------
*
* 파고다21 링크
*
----------------------------------------------------------------------------*/
//회원가입
function joinMember(){
	//var url= "https://sso.pagoda21.com/member/join/join_main.jsp?f_dom=www.pagodastar.com"
	//CommonPopup(url,'pagoda21',830,600,1);
	window.open('https://sso.pagoda21.com/member/join/join_main.jsp?f_dom=www.pagodastar.com');
}

//아이디 비밀번호 찾기
function findPassword(){
	var url= "https://sso.pagoda21.com/member/find/id_find.jsp";
	CommonPopup(url,'pagoda21',830,600,1);
}

//정보보기
function sso_my_info(){
	window.open('https://sso.pagoda21.com/member/change/join_change.jsp','sso','width=830,height=600,scrollbars=1');
}

//회원탈퇴
function sso_secession(){
	window.open('https://sso.pagoda21.com/member/secession/login.jsp','sso','width=830,height=600,scrollbars=1');
}

//이용약관
function sso_provision(){
	window.open('https://sso.pagoda21.com/member/provision/provision_main.jsp','sso','width=830,height=600,scrollbars=1');
}

//개인정보 취급방침
function sso_policy(){
	window.open('https://sso.pagoda21.com/member/policy/policy.jsp','sso','width=830,height=600,scrollbars=1');
}

//회원정책안내
function sso_intergration(){
	window.open('https://sso.pagoda21.com/member/integration/integration.jsp','sso','width=830,height=600,scrollbars=1');
}

/*----------------------------------------------------------------------------
*
* 시작 , 즐겨찾기
*
----------------------------------------------------------------------------*/
//시작 페이지 설정
function setHome() {
	 document.body.style.behavior='url(#default#homepage)';
	 document.body.setHomePage('http://www.pagodastar.com');

}

//즐겨찾기 바탕화면 바로가기
function shorcut(){

	//즐겨 찾기
	//window.external.AddFavorite('http://www.pagodastar.com','파고다 스타 - 최신인강 압도적 1위');
	
	var f_name = "파고다스타 - 최신인강 압도적 1위";
	var f_url = "http://www.pagodastar.com";
	
	if (window.sidebar) {
		/* FireFox */  
		window.sidebar.addPanel(f_name, f_url,'');		  
	} else if(window.chrome) {
		// Google Chrome
		alert("Ctrl+D키를 누르시면 즐겨찾기에 추가하실 수 있습니다.");
	} else if (window.external) { 
		/* IE */ 
		window.external.AddFavorite(f_url, f_name);
	} else if (window.opera) { 
		/* Opera */
		var add_bm_link = $('add_bookmark');
		add_bm_link.setAttribute('href',f_url);
		add_bm_link.setAttribute('rel','sidebar');
		add_bm_link.setAttribute('title',f_name);
		add_bm_link.click();
	}

}

/*----------------------------------------------------------------------------
*
* 수강확인서
*
----------------------------------------------------------------------------*/

function open_pop_sukang_certi(hid){
	
	var url ='/lectureroom/main/paper_apply/' + hid;
	window.open(url,'_blank','width=670,height=800,toolbar=no,menubar=no,location=no,scrollbars=yes,status=no,resizable=yes,fullscreen=no,left=10,top=10');
	
}

/*----------------------------------------------------------------------------
*
* 영수증 팝업
*
----------------------------------------------------------------------------*/
function view_order_receipt(oid){
	CommonPopup('/mystar/settlement/view_order_receipt/'+oid,'pg_receipt','430','650',1);
}

/*----------------------------------------------------------------------------
*
* 시작 , 즐겨찾기
*
----------------------------------------------------------------------------*/
function GoshippingTrace(comcd,invno){
	
	
	//CJGLS
	if(comcd == '501051'){
		CommonPopup('http://www.cjgls.co.kr/kor/delivery/booking/search.asp','',600,600);
	//현대택배
	}else if(comcd == '501052'){
		var pars = 'http://www.hlc.co.kr/hydex/jsp/tracking/trackingViewCus.jsp?InvNo='+invno;
		CommonPopup(pars,'',600,600);
	//우체국택배
	}else if(comcd == '501053'){
		CommonPopup('http://service.epost.go.kr/iservice/trace/Trace.jsp','',600,600);
	//한진택배
	}else if(comcd == '501055'){
		CommonPopup('http://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp?wbl_num='+invno,'',600,600,'1','1');
	//동부택배
	}else if(comcd == '501056'){
		CommonPopup('http://www.dongbuexpress.co.kr/newHtml/delivery/dvsearch.jsp','',600,600);
	//옐로우캡
	}else if(comcd == '501057'){
		CommonPopup('https://www.yellowcap.co.kr/custom/custom03.asp','',600,600);
	//KGB택배
	}else if(comcd == '501058'){
		CommonPopup('http://www.kgbls.co.kr/sub5/sub5_1.asp','',600,600);
	//로젠택배
	}else if(comcd == '501059'){
		CommonPopup('https://www.ilogen.com/iLOGEN.Web.New/TRACE/TraceNoView.aspx?slipno='+invno+'&gubun=slipno','',600,600);
	//대한통운
	}else if(comcd == '501054'){
		var pars = 'https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no='+invno;
		CommonPopup(pars,'',600,600);
	//하나로택배
	}else if(comcd == '501063'){
		CommonPopup('http://www.hanarologis.com/branch/chase/postform.html?a_gb=center&a_cd=4&a_item=0','',600,600);
	//우편등기
	}else if(comcd == '501065'){
		CommonPopup('http://trace.epost.go.kr/xtts/servlet/kpl.tts.common.svl.SttSVL?target_command=kpl.tts.tt.epost.cmd.RetrieveOrderConvEpostPoCMD&sid1='+invno,'',600,600);
	}

	
	
}
/*----------------------------------------------------------------------------
*
* 게시판
*
----------------------------------------------------------------------------*/

/*
* 게시물 좋아요 수 표시 + 클릭 버튼 에서 클릭
*
*/
function bbs_like_basil(bbs_id,user_id,btn_id){

	if(user_id=='' || user_id==null){
		alert('추천은 로그인 후 하실수 있습니다.');
	}
	else{
		$.getJSON( "/bbs/main/bbs_like/"+bbs_id+'/'+user_id, function( data ) {
			var cnt = data.total;
			var btn_txt = '추천 ';
			if(data.do_like=='0'){
				btn_txt = '취소 ';
			}
			btn_txt += '(' + cnt + ')';
			$('#'+btn_id).html(btn_txt);
		});
	}

}


/*
* 게시물 좋아요 수 표시 + 클릭 버튼 에서 클릭
*
*/
function bbs_like(user_id,bbs_id){
	$.getJSON( "/bbs/main/bbs_like/"+user_id+'/'+bbs_id, function( data ) {
		$('#total_likes').html(data.total);
		var like_btn = '좋아하기';
		if(data.do_like=='0'){
			like_btn = '좋아하기 취소';
		}
		$('#bbs_like_btn').html(like_btn);
	});
}


/*
* 게시물 좋아요 클릭 후 화면 리플래시
*
*/
function bbs_like_reload(user_id,bbs_id){
	$.getJSON( "/bbs/main/bbs_like/"+user_id+'/'+bbs_id, function( data ) {
		document.location.reload();
	});
}

/* func_select */
$(function() {
	$('.func_select>button').click(function() {
		$(this).next('ul').toggleClass('hidden');
		return false;
	});
		
	$(document).click(function(event) {
		//console.log($(event.target).parent());
		if (!$(event.target).parent().is('.func_select')) {
			$('.func_select>ul').addClass('hidden');
		}
	});
	
});

/* toggle */
$(document).ready(function(){
	$(".toggle").click(function(){
		$(".toggle_cont").slideToggle("slow");
		return false;
	});
});
