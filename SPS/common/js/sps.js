/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_mode();
	init_flick();
	init_accessibility()
	init_jump();		
	init_jump_basic();
	init_lazy();	
	init_flick2();	
	init_event();
	init_slide_res();
	init_featured_product();
	init_specs_tabs();
	change_img();
	change_feature_img();
	init_tab();

};

/********************************************************************************************************
 * METHOD:MODE
 ********************************************************************************************************/
function init_mode(){
	var owner=this;	
	
	owner.change_img(_common.is_mode());
	owner.change_feature_img();
		
	$(window).resize( function() {
		var mode = _common.is_mode();
		
		owner.change_img(mode);
		owner.change_kv(mode);
		owner.change_feature_img();
	});

	// Mobile Images Load
	if (ValidationUtil.is_mobile()) {
		$(document).ready(function(){
			var mode = _common.is_mode();
			owner.change_kv(mode);
		});
	}
	else{
		$(window).load( function(){
			var mode = _common.is_mode();
			owner.change_kv(mode);
		});
	}

	
};

/********************************************************************************************************
 * METHOD:CHANGE_IMG
 ********************************************************************************************************/
function change_img(mode) {
	var img_url = '';
	
	$('.ss-carousel').css('background', 'url(/common/b2b4/img/ico/loading-animation.gif) no-repeat 50% 50%');
	
	$('img.responsive').each(function() {
		var $this = $(this);
		
		switch(String(mode).toUpperCase()) {
			case 'MOBILE':
				img_url = $this.attr('data-media-mobile');
				break;
			case 'PC':
			case 'TABLET_B':
			case 'TABLET_A':
				img_url = $this.attr('data-media-desktop');
				break;
		};
		
		$this.attr('src', img_url);
	});


	// 1. pdp-product
	$('.hero-module *[data-role=ui-flick]').find('>div>ul>li>div').each(function() {
		$(this).css('background-image', '');

		switch(String(mode).toUpperCase()) {
			case 'MOBILE':
				img_url = $(this).find('img').attr('data-media-mobile');
				break;
			case 'TABLET_A':
				img_url = $(this).find('img').attr('data-media-tablet-portrait');
				break;
			case 'TABLET_B':
				img_url = $(this).find('img').attr('data-media-tablet-landscape');
				break;
			case 'PC':
				img_url = $(this).find('img').attr('data-media-desktop');
				break;
		};

		$(this).attr('src', img_url);
		
		//$(this).attr('data-original', img_url);
		
	});

	$('.ss-carousel').css('background', '');	
};

/**
 * Change Feature Image for responsive
 */
function change_feature_img() {
	var mode = '';
	var w = window.innerWidth;

	if (navigator.userAgent.indexOf('MSIE 7.0') !== -1 || navigator.userAgent.indexOf('MSIE 8.0') !== -1) {
		w = $(window).width();
	}

	if (w <= 479) {
		mode = 'MOBILE';
	} else if (w > 479 && w <= 767) {
		mode = 'TABLET_A';
	} else if (w > 767 && w <= 1023) {
		mode = 'TABLET_B';
	} else if (w > 1023) {
		mode = 'PC';
	}

	$('.feature-module').find('img.responsive-image').each(function() {
		var $this = $(this);
		var img_url = '';
		var type = $this.data('type');

		if (type == 'type1') {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_B':
					img_url = $this.attr('data-media-mobile');
					break;
				case 'TABLET_A':
				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		} else if (type == 'type2') {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_A':
				case 'TABLET_B':
					img_url = $this.attr('data-media-mobile');
					break;

				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		} else if (type == 'type3') {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_A':
					img_url = $this.attr('data-media-mobile');
					break;
				case 'TABLET_B':
				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		}
		// HTML
		else {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_A':
				case 'TABLET_B':
					img_url = $this.attr('data-media-tablet-portrait');
					break;

				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		}

		$this.addClass('lazy');
		$this.attr('data-original', img_url);

	});
}




/********************************************************************************************************
 * METHOD:CHANGE_KV
 ********************************************************************************************************/
function change_kv(mode) {
	var img_url = '';
	var	kv_img = $('div.key-visual li:gt(0)');
	var	clone = $('*[data-clone=clone]:first').find('img:gt(0)');
	
	$(kv_img).find('img').each(function() {
		var $this = $(this);
						
		switch(String(mode).toUpperCase()) {
			case 'MOBILE':
				img_url = $this.attr('data-media-mobile');
				$(this).removeClass('kv_desktop').addClass('kv_mobile');
				clone.css({'display':'inline'});
				break;
			case 'PC':
			case 'TABLET_B':
			case 'TABLET_A':
				img_url = $this.attr('data-media-desktop');
				$(this).removeClass('kv_mobile').addClass('kv_desktop');
				clone.css({'display':'none'});
				break;
		};
		
		$this.attr('src', img_url);
	});
};

/********************************************************************************************************
 * METHOD:TAB
 ********************************************************************************************************/
function init_tab(){
	$('*[data-role=ui-tab]').each(function(){
		$(this).data('tab',new TabUI($(this)));
	});

	$('.nav li').each(function() {
	 $(this).mouseover(function() {
		$('.nav li').addClass('active2');
	   if ($(this).hasClass('active')) {
		$(this).removeClass("active");
		$(this).mouseout(function() {
			$('.nav li').removeClass('active2');
		  $(this).addClass("active");
		});
	   }
	 }).mouseout(function() {
	$('.nav li').removeClass('active2');
	 });
	});
};

/********************************************************************************************************
 * METHOD:FLICK, SLIDE.BLOCK
 ********************************************************************************************************/
function init_flick(){
	$('.key-visual-area *[data-role=ui-flick]').each(function(){
		$(this).data('flick',new FlickUI($(this),{'auto':true}));
		
		(function(flick){
			var owner=flick;
			flick.auto_btn=$('*[data-role=ui-flick-auto]');
			
			flick.auto_btn.bind({
				'click':function(){
					var $this = $(this);
					if($this.hasClass('pause')){
						$this.attr('class', 'play');
						$this.find('span').text('play');
						owner._flag.auto=false;
						owner.stop_autoplay();
						sendClickCode('content_click_count','kv rolling:pause');
					}else{
						$this.attr('class', 'pause');
						$this.find('span').text('pause');
						owner._flag.auto=true;
						owner.autoplay();
						sendClickCode('content_click_count','kv rolling:play');
					}
				}
			});
		}($(this).data('flick')));
	});



};

/********************************************************************************************************
 * METHOD:ACCESSIBILITY
 ********************************************************************************************************/
function init_accessibility(){

	$('.header *[data-role=ui-nav-btn]').bind({
		'click':function(){
			if($('.body-wrap').hasClass('nav-on')){
				$('.ctl-nav').find('span').text('Close Menu');
			}else{
				$('.ctl-nav').find('span').text('Open Menu');
			}
		}
	});

	$('.nav *[data-role=ui-nav] li').bind({
		'click':function(){
			if($(this).hasClass('on')){
				$(this).find('span').text('open sub menu');
			}else{
				$(this).find('span').text('close sub menu');
			}
		},
		'mouseover':function(){
			if($(this).hasClass('on')){
				$(this).find('span').text('open sub menu');
			}else{
				$(this).find('span').text('close sub menu');
			}
		},
		'mouseout':function(){
			$(this).find('span').text('close sub menu');
		},
		'focus':function(){
			if($(this).hasClass('on')){
				$(this).find('span').text('open sub menu');
			}else{
				$(this).find('span').text('close sub menu');
			}
		}
	});
	$('*[data-role=ui-nav-wrap] .direct li:last-child a').bind({
		'blur':function(){
				$('.header *[data-role=ui-nav-btn]').click();

		}
	});

	$('*[data-role=ui-btn-spec] ').bind({
		'click':function(){
			if($(this).hasClass('link-toggled')){
				$(this).find('span.blind').text('(close more specs)');
			}else{
				$(this).find('span.blind').text('(open more specs)');
			}
		}
	});

	$('*[data-role=ui-filter-toggle] ').bind({
		'click':function(){
			if($(this).hasClass('link-toggled')){
				$(this).find('.blind').text('filter close');
			}else{
				$(this).find('.blind').text('filter open');
			}
		}
	});

	$('*[data-role=ui-mfilter-toggle] ').bind({
		'click':function(){
			if($(this).hasClass('link-toggled')){
				$(this).find('.blind').text('filter open');
			}else{
				$(this).find('.blind').text('filter close');
			}
		}
	});

	$('*[data-role=ui-mfilter-menu] ').bind({
		'click':function(){
			if($(this).hasClass('link-toggled')){
				$(this).find('.blind').text('filter close');
			}else{
				$(this).find('.blind').text('filter open');
			}
		}
	});
}

/****************************************************************************************
*
* [METHOD]:JUMP BASIC
*
****************************************************************************************/
function init_jump_basic(){
	$('.filter-by *[data-role=ui-jump-basic]').each(function(){
		$(this).data('jumpBasic',new JumpBasicUI($(this), {
			desktop: $('.filter-by-area.desktop-area'),
			mobile: $('.filter-by-area.mobile-area')
		}));
	});
	
	$('*[data-role=ui-jump-filter-filterby], *[data-role=ui-jump-filter-sortby]').on('click', function(e){
		var mode = _common.is_mode();
		var target = null;
		var target_button = null;
		
		if (mode == 'MOBILE') {
			target = $('.filter-by-area.mobile-area');
			target_button = target.find('.filterby'); 
		}
		else {
			target = $('.filter-by-area.desktop-area');
			target_button = target.find('.btn-filterby');
		}
		
		var pos = target.offset().top;
		$('html,body').stop().animate({'scrollTop':pos+'px'},700);
		
		if (target_button.hasClass('link-toggled')) {
			target_button.click();
		}

		e.preventDefault();
	});
	/*
	$('.btn-jump.email').on('click', function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		PopupUI.newWindow(url, 'open', 751, 700, true);
	});
	*/
}


/****************************************************************************************
* METHOD:INIT FEATURED PRODUCT
****************************************************************************************/
function init_featured_product(){
	var $scope = $('div[data-role=featured-tabs]');
	
/*
	$scope.find('button').click(function(){
		var $content = $('div[data-role=featured-tabs-conts]');
		var idx = $scope.find('button').index(this);
		$('.featured-product .btn-tab').text('Expand');
		$('.featured-product .btn-tab').removeClass('show');
		$('.featured-product .btn-box').removeClass("on");
		$('.featured-product .col-inner').removeClass("on");
		$(this).text('close');
		$(this).addClass('show');
		$(this).parent().parent().addClass('on');
		$(this).parent().parent().find('.btn-box').addClass('on');
		$content.hide().eq(idx).show();
		$('.show').click(function(){
			$(this).removeClass('show');
			$('div[data-role=featured-tabs-conts]').hide();
		})			
	});
*/
	$scope.find('button').click(function(){
		var $content = $('div[data-role=featured-tabs-conts]');
		var idx = $scope.find('button').index(this);		
		
		if($(this).text() == 'Close'){
			$('.featured-product .btn-tab').text('Expand').removeClass('show');
			$('.featured-product .btn-box,.featured-product .col-inner').removeClass("on");
			$content.hide();
			$('.solution-software').css('margin-top','0');
		}else{
			$('.featured-product .btn-tab').text('Expand').removeClass('show');
			$('.featured-product .btn-box,.featured-product .col-inner').removeClass("on");
			$(this).text('Close').addClass('show');
			$(this).parent().parent().addClass('on');
			$(this).parent().parent().find('.btn-box').addClass('on');
			$content.hide().eq(idx).show();
			if(idx == "0" || idx == "1") {
				$('.solution-software').css('margin-top','340px');
			}else if(idx == "2" || idx == "3"){
				$('.solution-software').css('margin-top','560px');
			}
		}



	});


	
};

/****************************************************************************************
* METHOD:INIT SPECS TABS
****************************************************************************************/
function init_specs_tabs(){
	var $scope = $('div[data-role=specs-tabs]');
	
	$scope.find('button').click(function(){
		var $content = $('div[data-role=specs-tabs-conts]');
		var idx = $scope.find('button').index(this);

		$('.specs-tabs li').removeClass("on");
		$(this).parent().addClass('on');
		$content.hide().eq(idx).show();
	});

	var $scope02 = $('div[data-role=specs-tabs02]');
	$scope02.find('> ul > li > button').bind({
		'click':function(){
			$('.specs-tabs > ul > li').removeClass("on");
			$(this).parent().addClass('on');
			$('.configurator-slide').css('display','none')
			$(this).parent().find('.configurator-slide').css('display','block');
		},
		'focus':function(){
			$('.specs-tabs > ul > li').removeClass("on");
			$(this).parent().addClass('on');
			$('.configurator-slide').css('display','none')
			$(this).parent().find('.configurator-slide').css('display','block');
		}
	});
//	$scope02.find('> ul > li > button').click(function(){
//		$('.specs-tabs > ul > li').removeClass("on");
//		$(this).parent().addClass('on');
//		$('.configurator-slide').css('z-index','1')
//		$(this).parent().find('.configurator-slide').css('z-index','2');
//	});

};

/**
 * Lazy Load
 */
function init_lazy() {
	$(document).ready(function(){
		$('.feature-module').find('img.responsive-image').attr('src', '');
		
/*
		if (ValidationUtil.is_mobile()) {
			$('a.btn.print').remove();
		}
*/
	});
	
	$(window).load(function(){
		$('img.lazy').lazyload({
	        thresold : 100,
	        effect: "fadeIn"
	    });	
	});
	
	$(window).resize(function(){
		if (_common._document_width != $(window).width()) {
			_common._document_width = $(window).width();
			
			$('img.lazy').lazyload({
		        thresold : 100
		    });	
		}
	});
};


/**
 * Flick Initialize
 */
function init_flick2() {
	var owner = this;

	$('.hero-module *[data-role=ui-flick]').each(function() {
		$(this).data('flick', new FlickUI($(this)));

		// override
		( function(flick) {
				// smaple images gallery ?�이??
				if (flick._scope.attr('data-type') === 'sub') {
					// sample images gallery ?��? information display ?�어
					var btn_info = $('*[data-role=ui-btn-info]');

					btn_info.each(function() {
						var parent = $(this).closest('div');

						$(this).data({
							'title' : parent.find('div.module-heading'),
							'content' : parent.find('ul.features'),
							'icon' : $(this).find('span')
						});
					});

					btn_info.on('click', function() {
						var $this = $(this);
						
						if (!$this.data('icon').hasClass('icon-minus')) {
							$this.data('icon').removeClass('icon-plus').addClass('icon-minus');

							$this.data('title').show();
							$this.data('content').show();
						} else {
							$this.data('icon').removeClass('icon-minus').addClass('icon-plus');

							$this.data('title').hide();
							$this.data('content').hide();
						}
					});
				} else {
					flick._color_btn = $('*[data-role=ui-swatch]').find('a');

					if (flick._color_btn.length >= 2) {
						flick._color_btn.on('click', function() {
							var code = $(this).attr('data-color');

							$(this).parent().parent().find('>div').removeClass('active');
							$(this).parent().addClass('active');

							change_prd_image(code);
						});
					}

					// lazyload
					flick._lazyload = function(type, currentIdx) {
						var lazyloadMainImage = flick._scope.find('*[data-role=ui-flick-content] *[data-lazyloadimage-initflag=false]');
						var lazyloadThumbImage = $('*[data-role=ui-slide-res]').filter('*[data-type=main]').find('*[data-lazyloadimage-initflag=false]');

						var targetMainImage = new Array();
						var targetThumbImage = new Array();

						// main prev event
						if (type == 'prev') {
							var thisMainObj = flick._scope.find('*[data-role=ui-flick-content] li').eq(currentIdx - 1).find('span');

							if (thisMainObj.attr('data-lazyloadimage-initflag') == 'false') {
								targetMainImage.push(thisMainObj);
							}
						}
						// main next event
						else if (type == 'next') {
							var thisMainObj = flick._scope.find('*[data-role=ui-flick-content] li').eq(currentIdx + 1).find('span');

							if (thisMainObj.attr('data-lazyloadimage-initflag') == 'false') {
								targetMainImage.push(thisMainObj);
							}
						}
						// main thumbnail prev event
						else if (type == 'thumb-prev') {
							var thisMainObj = flick._scope.find('*[data-role=ui-flick-content] li').eq(currentIdx - 1).find('span');

							if (thisMainObj.attr('data-lazyloadimage-initflag') == 'false') {
								targetMainImage.push(thisMainObj);
							}

							for (var i = currentIdx - 4; i <= currentIdx + 4; i += 1) {
								var thisThumbObj = $('*[data-role=ui-slide-res]').filter('*[data-type=main]').find('li').eq(i);

								if (thisThumbObj.attr('data-lazyloadimage-initflag') == 'false') {
									targetThumbImage.push(thisThumbObj);
								}
							}
						}
						// main thumbnail next event
						else if (type == 'thumb-next') {
							var thisMainObj = flick._scope.find('*[data-role=ui-flick-content] li').eq(currentIdx + 1).find('span');

							if (thisMainObj.attr('data-lazyloadimage-initflag') == 'false') {
								targetMainImage.push(thisMainObj);
							}

							for (var i = currentIdx - 4; i <= currentIdx + 4; i += 1) {
								var thisThumbObj = $('*[data-role=ui-slide-res]').filter('*[data-type=main]').find('li').eq(i);

								if (thisThumbObj.attr('data-lazyloadimage-initflag') == 'false') {
									targetThumbImage.push(thisThumbObj);
								}
							}
						} else if (type == 'focus') {
							var thisMainObj = flick._scope.find('*[data-role=ui-flick-content] li').eq(currentIdx).find('span');
							var prevMainObj = flick._scope.find('*[data-role=ui-flick-content] li').eq(currentIdx - 1).find('span');
							var nextMainObj = flick._scope.find('*[data-role=ui-flick-content] li').eq(currentIdx + 1).find('span');

							if (thisMainObj.attr('data-lazyloadimage-initflag') == 'false') {
								targetMainImage.push(thisMainObj);
							}

							// pre load
							if (prevMainObj.attr('data-lazyloadimage-initflag') == 'false') {
								targetMainImage.push(prevMainObj);
							}

							// pre load
							if (nextMainObj.attr('data-lazyloadimage-initflag') == 'false') {
								targetMainImage.push(nextMainObj);
							}

							for (var i = currentIdx - 4; i <= currentIdx + 4; i += 1) {
								var thisThumbObj = $('*[data-role=ui-slide-res]').filter('*[data-type=main]').find('li').eq(i);

								if (thisThumbObj.attr('data-lazyloadimage-initflag') == 'false') {
									targetThumbImage.push(thisThumbObj);
								}
							}
						}

						$.each(targetMainImage, function(idx, val) {
							var thisObj = val;
							thisObj.attr('data-lazyloadimage-initflag', 'true');

							var html = '';

								html += '<img class="responsive-image pdp-desktop" src="' + thisObj.attr('data-lazyloadimage-desktop') + '" alt="' + thisObj.attr('data-lazyloadimage-alt') + '" />';
								html += '<img class="lazy responsive-image pdp-mobile" data-original="' + thisObj.attr('data-lazyloadimage-mobile') + '" alt="' + thisObj.attr('data-lazyloadimage-alt') + '" src="' + thisObj.attr('data-lazyloadimage-mobile') + '" alt="' + thisObj.attr('data-lazyloadimage-alt') + '" />';

							thisObj.append(html);
						});

						$.each(targetThumbImage, function(idx, val) {
							var thisObj = val;
							thisObj.attr('data-lazyloadimage-initflag', 'true');

							var html = '<a href="javascript:;"><img src="' + thisObj.attr('data-lazyloadimage-thumb') + '" alt="' + thisObj.attr('data-lazyloadimage-alt') + '" /></a>';

							thisObj.append(html);
						});

						var m_slide = null;

						$('*[data-role=ui-slide-res]').each(function() {
							if ($(this).attr('data-type') === 'main') {
								m_slide = $(this).data('slide');
							}
						});

						m_slide.reinit();
					};

					flick._scope.find('*[data-role=ui-flick-prev], *[data-role=ui-flick-next]').click(function(e) {
						var type = $(this).attr('data-role') == 'ui-flick-prev' ? 'prev' : 'next';
						var currentIdx = flick._current;

						flick._lazyload(type, currentIdx);
					});

					function change_prd_image(code) {
						var m_slide = null;

						$('*[data-role=ui-slide-res]').each(function() {
							if ($(this).attr('data-type') === 'main') {
								m_slide = $(this).data('slide');
							}
						});

						flick._scope.css({
							'visibility' : 'hidden'
						});
						m_slide._scope.css({
							'visibility' : 'hidden'
						});

						flick._content.empty();
						m_slide._content.empty();

						// 1. build-event
						$('*[data-role=prd-img-data]').find('>li[image-color-type=' + String(code) + ']').each(function(idx) {
							var flick_data = $(this).clone();
							var spanObj = flick_data.find('span');

							var html = '';
							
							html += '<img class="responsive-image pdp-desktop" src="' + spanObj.attr('data-media-desktop') + '" alt="' + spanObj.attr('data-alt') + '" />';
							html += '<img class="lazy responsive-image pdp-mobile" data-original="' + spanObj.attr('data-media-mobile') + '" alt="' + spanObj.attr('data-alt') + '" src="' + spanObj.attr('data-media-mobile') + '" alt="' + spanObj.attr('data-alt') + '" />';

							spanObj.append(html);

							var slide_img;
							if ($(flick_data).attr('data-heroimagetype') === 'V') {
								// replace-video-image
								slide_img = '/common/b2b4/img/product/pdp-video-thumb.png';
							} else {
								slide_img = spanObj.attr('gallery-thumb-url');
							}

							var slide_data = '<li><a href="javascript:void(0);"><img src=' + slide_img + ' alt=' + spanObj.attr('data-alt') + ' /></a></li>';

							flick._content.append(flick_data);
							m_slide._content.append(slide_data);

							if (idx >= 5) {
								m_slide._scope.find('*[data-role=ui-slide-res-prev], *[data-role=ui-slide-res-next]').show();
							} else {
								m_slide._scope.find('*[data-role=ui-slide-res-prev], *[data-role=ui-slide-res-next]').hide();
							}
						});

						m_slide._content.children().first().addClass('current').find('img').on('load', function() {
							m_slide.reinit();
						});

						// 2. reinitialize modules
						flick._content.children().first().find('img').on('load', function() {
							flick.reinit();
						});

						// 3. reinitialize image src by mode
						flick._scope.css({
							'visibility' : 'visible'
						});
						m_slide._scope.css({
							'visibility' : 'visible'
						});

						// 4. analytics tagging add
						sendClickCode('pdp_gallery', 'gallery:color');
					};
				}

				flick.reset_current = function(d, f) {
					var owner = this;
					var flag = ( typeof f !== 'undefined') ? true : f;

					switch(d) {
						case -1:
							owner._current += 1;

							if (owner._current > owner._length - 1) {
								owner._current = 0;
							}
							break;

						case 1:
							owner._current -= 1;

							if (owner._current < 0) {
								this._current = owner._length - 1;
							}
							break;

						default:
							break;
					}

					var slide = null;

					$('*[data-role=ui-slide-res]').each(function() {
						if ($(this).attr('data-type') === owner._scope.attr('data-type')) {
							slide = $(this).data('slide');
						}
					});

					if (!flag) {
						slide.focus('focus', this._current, false);
					}

					if (owner._scope.attr('data-type') === 'main') {
						var flick = $('*[data-role=ui-flick]').filter('*[data-type=main]').data().flick;
						var itemLen = $('*[data-role=ui-slide-res]').filter('*[data-type=main]').data().slide._child.length;

						if (itemLen == 2) {
							var curr = flick._current;
							var num = 0;

							// prev
							if (d == 1) {
								if (curr == 3) {
									num = 2;
								} else {
									num = 1;
								}
							}
							// next
							else if (d == -1) {
								if (curr == 1) {
									num = 2;
								} else {
									num = 1;
								}
							}

							owner._num.find('span.current-num').text(num);

							flick._current = num - 1;
							$('*[data-role=ui-slide-res]').filter('*[data-type=main]').data().slide._current = num - 1;
							$('*[data-role=ui-slide-res]').filter('*[data-type=main]').find('li').removeClass('current').eq(flick._current).addClass('current');
						} else {
							owner._num.find('span.current-num').text(owner._current + 1);
						}

					}
				};
			}($(this).data('flick')));
	});
}




/**
 * Slide Library Initialize
 */
function init_slide_res() {
	$('.hero-module *[data-role=ui-slide-res]').each(function() {
		$(this).data('slide', new SlideResUI($(this)));

		$(this).find('*[data-role=ui-slide-res-content]').on('click', 'a', function(e) {
			e.preventDefault();
		});

		//override
		( function(slide) {
				slide.focus = function(type, n, f) {
					var owner = this;
					var flag = ( typeof f !== 'undefined') ? true : f;
					var flick = null;

					$('*[data-role=ui-flick]').each(function() {
						if ($(this).attr('data-type') === owner._scope.attr('data-type')) {
							flick = $(this).data('flick');
						}
					});

					switch(type) {
						case 'prev':
							if (this._current > 0) {
								this._child.eq(this._current).removeClass('current').prev().addClass('current');
								this._current -= 1;
								this.transition(type);

								// ?��?지 ?�적 로드
								if (flick._lazyload != undefined) {
									flick._lazyload('thumb-prev', this._current);
								}

								if (!flag) {
									flick.transition(1, undefined, false);
								}
							} else {
								this._transition.flag = true;
								return;
							}
							break;

						case 'next':
							if (this._current < this._info.leng - 1) {
								this._child.eq(this._current).removeClass('current').next().addClass('current');
								this._current += 1;
								this.transition(type);

								// ?��?지 ?�적 로드
								if (flick._lazyload != undefined) {
									flick._lazyload('thumb-next', this._current);
								}

								if (!flag) {
									flick.transition(-1, undefined, false);
								}
							} else {
								this._transition.flag = true;
								return;
							}
							break;

						case 'focus':
							if (this._current !== n) {
								var d;

								if (this._current < n) {
									d = -1;
								} else {
									d = 1;
								}

								// ?��?지 ?�적 로드
								if (flick._lazyload != undefined) {
									flick._lazyload('focus', n);
								}

								this._child.eq(this._current).removeClass('current');
								this._child.eq(n).addClass('current');
								this.transition(type, n);

								if (!flag) {
									flick.transition(d, n, false);
								}
							} else {
								this._transition.flag = true;
								return;
							}
							break;

						default:
							break;
					}
				};
			}($(this).data('slide')));
	});
}


/**
 * Jump-to Initialize
 */
function init_jump() {
	$('.detail-contents *[data-role=ui-jump]').each(function() {
		$(this).data('jump', new JumpUI($(this)));

		var self = $(this);
		var current = null;
		var active = null;
		var temp = '';

		$(window).on('scroll', function() {
			current = self.data('jump')._current.find('span').text();
			active = self.data('jump')._isActive;

			if (active) {
				if (current != temp) {
					if (current.length === 0) {
						return false;
					}

					if (!self.data('jump')._flag) {
						//sendClickCode('jumpto', 'jump to:scroll:' + current.toLowerCase());
						//sendClickCode('jumpto', 'jump to:scroll:' + self.data('jump')._current.attr('eng-title').toLowerCase());
					}

					temp = self.data('jump')._current.find('span').text();
				}
			} else {
				temp = '';
			}
		});

	});
}


/**
 * Event Initialize
 */
function init_event() {
	$('*[data-role="ui-btn-spec"]').on('click', function() {
		if (!$(this).hasClass('link-toggled')) {
			$(this).addClass('link-toggled').parent().next().slideDown();
		}
		else {
			$(this).removeClass('link-toggled').parent().next().slideUp();
		}
	});
	
	$('ul[data-role=ui-btn-tab]').find('a').click(function(){
		var $content = $('div[data-role=ui-tab-1depth]');
		var idx = $('ul[data-role=ui-btn-tab]').find('a').index(this);
		
		$(this).closest('li').addClass('active').siblings().removeClass("active");
		$content.hide().eq(idx).show();
	});

	$('*[data-role=ui-btn-buyonline]').on('click', function() {
		$(this).data('manager', new LayerCommonUI($(this)));
	});
	
	$('*[data-role=ui-btn-wtbToggle]').on('click', function() {
		var $this = $(this);
		
		$this.toggleClass('active');
		
		if($this.hasClass('active')){
			$this.siblings().show();
		}
		else{
			$this.siblings().hide();
		}
	});
	
	$('*[data-role=ui-btn-wtbToggle]').parent().siblings().click(function(){
		var $self = $('*[data-role=ui-btn-wtbToggle]');
		$self.removeClass('active');
		$self.siblings().hide();
	});
	
	var isClick = false;
	$('*[data-role=ui-btn-wtbToggle]').siblings()
	.click(function(e){
		var $self = $('*[data-role=ui-btn-wtbToggle]');
		$self.removeClass('active');
		$self.siblings().hide();
		isClick = true;
	})
	.hover(
		function(){
			$(this).siblings().removeClass('active');
		},
		function(){
			if(!isClick){
				$('*[data-role=ui-btn-wtbToggle]').addClass('active');
			}else{
				isClick = false;
			}
		}
	);
	
	$(document).on('click', '*[data-role=ui-btn-partnerlocator]', function(e) {
		e.preventDefault();
		var $this = $(this);
		
		if($this.data('popup')) {
			pswtb.sandbox.openWTB(this, 'CA_'+$this.data('model'));
			return;
		}
		else{
			var iaUrlPath = $('#typeCode').val();
			location.href = '/' + SITE_CD + '/business/partnerlocator?iaUrlPath=' + iaUrlPath;
		}
	});
	

	$(window).load(function(){
		if(_common.is_mode() == 'PC'){
			$('#support').find('a[data-role=ui-accordion-btn]').first().click();
		}
	});
	
	$(window).resize(function(){
		if(_common.is_mode() == 'PC'){
			var $this = $('#support').find('a[data-role=ui-accordion-btn]').first();
			if(!$this.hasClass('expanded')) $this.click();
		}
		else {
			$.each($('#support').find('a[data-role=ui-accordion-btn]'), function(){
				if($(this).hasClass('expanded')) $(this).click();
			});
		}
	});

};



/**
 * configure
 */
$(document).on("click", "*[data-role=ui-btn-configure]", function() {
   $(this).data("manager", new LayerCommonUI($(this)))
   return false;
});


/**
 * Event
 */

$(document).on("click", "*[data-role=ui-btn-event]", function() {
   $(this).data("manager", new LayerCommonUI($(this)))
	//$('.event-step1-area').show();
	//$('.event-step2-area, .event-step3-area').hide();	
});

/*
$(document).on("click", "#btnApply", function() {
	$('.event-step1-area').hide();
	$('.event-step2-area').show();	
});	

$(document).on("click", "#btnEventSubmit", function() {
	$('.event-step1-area, .event-step2-area').hide();
	$('.event-step3-area').show();		
});	
 */
