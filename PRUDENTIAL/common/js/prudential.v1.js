var	prudential = (typeof prudential === 'undefined') ? {}	: console.log('......');

prudential	= {
	init:function(){
		var	h;
		h =	this;
		h.common.init();
	}
};

prudential.common	= {
	init:function(){
		var	common	= this;
		common.ui();
	},
	ui:function(){
					
		//메뉴 활성화
		$('#btnMenu').click(function(){
			var backgroundSelector = $('<div></div>');
			$('#leftMenu').animate({ left: 0 }, "slow", 'easeOutExpo');
			backgroundSelector.appendTo('body');
			backgroundSelector.css({
				'width': '100%',
				'height': '100%',
				'display': 'none',
				'background-color': '#000',
				'filter':'alpha(opacity=50)',
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'z-index':98
			});
			backgroundSelector.fadeTo('fast', 0.8);

			$('#btnMenuClose').click(function(){
				backgroundSelector.remove();
				var w = $(window).width();
				if(w >= 700){
					$('#leftMenu').animate({ left: "-330px" }, "fast");
				}else if(w <= 699){
					$('#leftMenu').animate({ left: "-310px" }, "fast");
				};
			});
		});

		//로딩바
		var top = ( $(window).scrollTop() + ($(window).height() - $('.loadIngBar .pace').height()) / 2 );
		var top02 = ( $(window).scrollTop() + ($(window).height() - $('.loadIngBar .ladingText').height()) / 2 );
		$('.loadIngBar .pace').css({'top':top, 'position':'fixed'});
		$('.loadIngBar .ladingText').css({'top':top02, 'position':'fixed'});
		$(window).on("resize", function () {
			var top = ( $(window).scrollTop() + ($(window).height() - $('.loadIngBar .pace').height()) / 2 );
			var top02 = ( $(window).scrollTop() + ($(window).height() - $('.loadIngBar .ladingText').height()) / 2 );
			$('.loadIngBar .pace').css({'top':top, 'position':'fixed'});
			$('.loadIngBar .ladingText').css({'top':top02, 'position':'fixed'});
		});


		//위로 이동 show / hide
		$(window).on("scroll", function () {
			var scroll = $(window).scrollTop();			
			if (scroll > 100) $('#btnTopMove').fadeIn();
			else $('#btnTopMove').fadeOut();
		});
		$('#btnTopMove').click(function(){
			$("html, body").animate({ scrollTop: 0 }, "fast");
		});		
		
		//val 삭제
		$(document).on('click', '.btnValDel', function(){
			$(this).hide();
			$(this).parent().find('input').val('');
		});

		//val삭제 버튼 show/hide, 저장 버튼 활성화
		$(document).on('keyup', 'input[type="text"], input[type="number"], input[type="tel"]', function(){
			if($(this).val().length > 0) {
				$(this).parent().parent().find('button').show();
				$('.btnSave').removeClass('disabled');
				$('.btnSave').removeAttr('disabled');
			} else {
				$(this).parent().parent().find('button').hide();
				$('.btnSave').addClass('disabled');
				$('.btnSave').attr('disabled');
			}
		});

		//전화번호 하이푼
		$(document).on('keyup', 'input[type="tel"]', function(){
			var _val = this.value.trim();
			this.value = autoHypenPhone(_val);
		});

		//focus일때
		$(document).on('focus', 'input[type="text"], input[type="number"], input[type="tel"]', function(){
			$(this).parent().parent().addClass('focus');
			$(this).blur(function(){
				$(this).parent().parent().removeClass('focus').removeClass('error');
				$(this).parent().parent().next('p').hide();
			});
		});

		//안드로이드 placehoder 오류
		$('input[type="number"]').each(function(i, el) {
			el.type = "text";
			el.onfocus = function(){this.type="number";};
			el.onblur = function(){this.type="text";};
		});
		
		
		//한글만
		$(document).on('keyup', '.long input[type=text]', function(){
			regexp = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
			v = $(this).val();
			if( regexp.test(v) ) {
				console.log("한글만");
				$(this).val(v.replace(regexp,''));
			}
		});

		
		//●처리
		$('.security').each(function(){
			var str = $(this).text();
			var masking = str.replace(/\d{6}$/g,'●●●●●●');
			$('.security').text(masking);
		});
		$('.securityVal').each(function(){
			var str = $(this).val();
			var masking = str.replace(/\d{6}$/g,'●●●●●●');
			$('.securityVal').val(masking);
			$(this).blur(function(){
				var str = $(this).val();
				var masking = str.replace(/\d{6}$/g,'●●●●●●');
				$('.securityVal').val(masking);
			});
		});
	}
};

$(function(){
	prudential.init();
});


//input[type="number"] - maxlength 체크
function maxLengthCheck(obj){
	if (obj.value.length > obj.maxLength){
	 obj.value = obj.value.slice(0, obj.maxLength);
	}
}

//전화번호 하이푼 처리
function autoHypenPhone(str) {
	str = str.replace(/[^0-9]/g, '');
	var tmp = '';
	if (str.length < 4) {
		return str;
	} else if (str.length < 7) {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3);
		return tmp;
	} else if (str.length < 11) {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 3);
		tmp += '-';
		tmp += str.substr(6);
		return tmp;
	} else {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 4);
		tmp += '-';
		tmp += str.substr(7);
		return tmp;
	}
	return str;
}


