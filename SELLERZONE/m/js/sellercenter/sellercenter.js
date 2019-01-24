var mwSellerUI = (typeof mwSellerUI === 'undefined') ? {}	: console.log('......');

mwSellerUI.layerToggle = {
	init:function(){
		mwSellerUI.layerToggle.show();
		mwSellerUI.layerToggle.hide();
	},
	show:function(){
		$('.btn_view').on("click",function(e) {
			$(this).siblings('.layer').fadeIn('fast');
		});
	},
	hide:function(){
		$('.btn_layer_close').on("click",function(e) {
			$(this).closest('.layer').fadeOut('fast');
		});
	}
};

mwSellerUI.accordion = {
	init:function(){
		$('.view_row .toggle').on("click",function(e) {
			if($(this).next('div').length > 0){
				e.preventDefault();
				var depth = $(this).next('div');
				if (depth.is(':visible')){
					depth.slideUp('fast');
					$(this).find('a').removeClass('active');
				}else{
					$('.toggle_box').slideUp('fast');
					depth.slideDown('fast');
					$('.view_row .toggle a').removeClass('active');
					$(this).find('a').addClass('active');
				}
			};
		});
	}
};

mwSellerUI.tbToggle = {
	init:function(){
		$('.btn_tr').on("click",function(e) {
			if($(this).closest('tr').next('.tb_conts').length > 0){
				e.preventDefault();
				var depth = $(this).closest('tr').next('.tb_conts');
				if (depth.is(':visible')){
					depth.hide();
				}else{
					$('.tb_conts').hide();
					depth.show();
				}
			};
		});
		$('.btn_tr_close').on("click",function(e) {
			e.preventDefault();
			$(this).closest('.tb_conts').hide();
		});
	}
};

mwSellerUI.layerPopup = {
	open:function(popID){
		var target = "#" + popID;
		var dim = $('<div class="dim" ></div>');

		$(target).css({
			'top':Math.max(0, (($(window).height() - $(target).height()) / 2) +  $(window).scrollTop()) + "px",
			'left':Math.max(0, (($(window).width() - $(target).width()) / 2) +  $(window).scrollLeft()) + "px"
		}).addClass('open');

		$(window).resize(function(){
			$(target).css({
				//'top':Math.max(0, (($(window).height() - $(target).height()) / 2) +  $(window).scrollTop()) + "px",
				'left':Math.max(0, (($(window).width() - $(target).width()) / 2) +  $(window).scrollLeft()) + "px"
			});
		});
		$(dim).appendTo('body').fadeIn('fast');
		$("html, body").animate({ scrollTop: $(target).offset().top }, "fast");

	},
	close:function(popID){
		$('#' + popID).removeClass('open');
		$('.dim').remove();
	}
};
