//swipe
if ( typeof Object.create !== "function" ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	var Carousel = {
		init :function(options, el){
			var base = this;
			base.options = $.extend({}, $.fn.swipe.options, options);
			var elem = el;
			var $elem = $(el);
			base.$elem = $elem;
			base.loadContent()
		},

		loadContent : function(){
			var base = this;

			if (typeof base.options.beforeInit === "function") {
				base.options.beforeInit.apply(this,[base.$elem]);
			}

			if (typeof base.options.jsonPath === "string") {
				var url = base.options.jsonPath;

				function getData(data) {
					if (typeof base.options.jsonSuccess === "function") {
						base.options.jsonSuccess.apply(this,[data]);
					} else {
						var content = "";
						for(var i in data["swipe"]){
							content += data["swipe"][i]["item"];
						}
						base.$elem.html(content);
					}
					base.logIn();
				}
				$.getJSON(url,getData);
			} else {
				base.logIn();
			}
		},

		logIn : function(){
			var base = this;

			base.baseClass();

			base.$elem
			.css({opacity: 0})

			base.checkTouch();
			base.support3d();

			base.wrapperWidth = 0;
			base.currentSlide = 0; //Starting Position

			base.userItems = base.$elem.children();
			base.itemsAmount = base.userItems.length;
			base.wrapItems();

			base.swipeItems = base.$elem.find(".swipe-item");
			base.swipeWrapper = base.$elem.find(".swipe-wrapper");
			base.totalItems = base.$elem.parent().find(".totalSlide");//숫자 페이징 처리
			base.currentItem = base.$elem.parent().find(".currentSlide");//숫자 페이징 처리
			
			base.orignalItems = base.options.items;
			base.playDirection = "next";

			base.checkVisible;

			//setTimeout(function(){
			base.onStartup();
			//},0);
			base.customEvents();
		},

		onStartup : function(){
			var base = this;
			base.updateItems();
			base.calculateAll();
			base.buildControls();
			base.updateControls();
			base.response();
			base.moveEvents();
			base.stopOnHover();
			if(base.options.autoPlay === true){
				base.options.autoPlay = 5000;
			}
			base.currentItem.html(base.currentSlide + 1);//숫자 페이징 처리
			base.totalItems.html(base.itemsAmount);//숫자 페이징 처리

			base.play();
			base.$elem.find(".swipe-wrapper").css("display","block")

			if(!base.$elem.is(":visible")){
				base.watchVisibility();
			} else {
				setTimeout(function(){
					base.$elem.animate({opacity: 1},100);
				},10);
			}
			base.onstartup = false;
			base.eachMoveUpdate();
			if (typeof base.options.afterInit === "function") {
				base.options.afterInit.apply(this,[base.$elem]);
			}
		},

		eachMoveUpdate : function(){
			var base = this;
			base.lazyLoad();
			base.autoHeight();
			if(base.options.singleItem === true){
				base.addActiveClass();
			}
			if (typeof base.options.afterAction === "function") {
				base.options.afterAction.apply(this);
			}
		},

		updateVars : function(){
			var base = this;
			base.watchVisibility();
			base.updateItems();
			base.calculateAll();
			base.updatePosition();
			base.updateControls();
			base.eachMoveUpdate();
		},

		reload : function(elements){
			var base = this;
			setTimeout(function(){
				base.updateVars();
			},0)
		},

		watchVisibility : function(){
			var base = this;
			clearInterval(base.checkVisible);
			if(!base.$elem.is(":visible")){
				base.$elem.css({opacity: 0});
				clearInterval(base.autoPlaySpeed);
			} else {
				return false;
			}
			base.checkVisible = setInterval(function(){
				if (base.$elem.is(":visible")) {
					base.reload();
					base.$elem.animate({opacity: 1},200);
					clearInterval(base.checkVisible);
				}
			}, 500);
		},

		wrapItems : function(){
			var base = this;
			base.userItems.wrapAll("<div class=\"swipe-wrapper\">").wrap("<div class=\"swipe-item\"></div>");
			base.$elem.find(".swipe-wrapper").wrap("<div class=\"swipe-wrapper-outer\">");
			base.wrapperOuter = base.$elem.find(".swipe-wrapper-outer");
			base.$elem.css("display","inline-block");
		},

		baseClass : function(){
			var base = this;
			var hasBaseClass = base.$elem.hasClass(base.options.baseClass);
			var hasThemeClass = base.$elem.hasClass(base.options.theme);

			if(!hasBaseClass){
				base.$elem.addClass(base.options.baseClass);
			}

			if(!hasThemeClass){
				base.$elem.addClass(base.options.theme);
			}
		},

		updateItems : function(){

			var base = this;

			if(base.options.responsive === false){
				return false;
			}

			if(base.options.singleItem === true){
				base.options.items = base.orignalItems = 1;
				base.options.itemsDesktop = false;
				base.options.itemsDesktopSmall = false;
				base.options.itemsTablet = false;
				base.options.itemsMobile = false;
				return false;
			}

			var width = $(window).width();

			if(width > (base.options.itemsDesktop[0] || base.orignalItems) ){
				 base.options.items = base.orignalItems
			}

			if(width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false){
				base.options.items = base.options.itemsDesktop[1];
			}

			if(width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false){
				base.options.items = base.options.itemsDesktopSmall[1];
			}

			if(width <= base.options.itemsTablet[0]  && base.options.itemsTablet !== false){
				base.options.items = base.options.itemsTablet[1];
			}

			if(width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false){
				base.options.items = base.options.itemsMobile[1];
			}

			//if number of items is less than declared
			if(base.options.items > base.itemsAmount){
				base.options.items = base.itemsAmount;
			}
		},

		response : function(){
			var base = this,
				smallDelay;
			if(base.options.responsive !== true){
				return false
			}
			$(window).resize(function(){

				if(base.options.autoPlay !== false){
					//bxslider 호출				
					//bxReinit();
					clearInterval(base.autoPlaySpeed);
				}
				clearTimeout(smallDelay)
				smallDelay = setTimeout(function(){
					base.updateVars();
				},base.options.responsiveRefreshRate);
			})
		},

		updatePosition : function(){
			var base = this;

			if(base.support3d === true){
				if(base.positionsInArray[base.currentSlide] > base.maximumPixels){
					base.transition3d(base.positionsInArray[base.currentSlide]);
				} else {
					base.transition3d(0);
					base.currentSlide = 0;
				}
			} else{
				if(base.positionsInArray[base.currentSlide] > base.maximumPixels){
					base.css2slide(base.positionsInArray[base.currentSlide]);
				} else {
					base.css2slide(0);
					base.currentSlide = 0;
				}
			}
			if(base.options.autoPlay !== false){
				base.checkAp();
			}
		},

		appendItemsSizes : function(){
			var base = this;

			var roundPages = 0;
			var lastItem = base.itemsAmount - base.options.items;

			base.swipeItems.each(function(index){
				$(this)
				.css({"width": base.itemWidth})
				.data("swipe-item",Number(index));

				if(index % base.options.items === 0 || index === lastItem){
					if(!(index > lastItem)){
						roundPages +=1;
					}
				}
				$(this).data("swipe-roundPages",roundPages);
			});
		},

		appendWrapperSizes : function(){
			var base = this;
			var width = 0;

			var width = base.swipeItems.length * base.itemWidth;

			base.swipeWrapper.css({
				"width": width*2,
				"left": 0
			});
			
			base.appendItemsSizes();
		},

		calculateAll : function(){
			var base = this;
			base.calculateWidth();
			base.appendWrapperSizes();
			base.loops();
			base.max();
		},

		calculateWidth : function(){
			var base = this;
			base.itemWidth = Math.round(base.$elem.width()/base.options.items)
		},

		max : function(){
			var base = this;
			base.maximumSlide = base.itemsAmount - base.options.items;
			var maximum = (base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth;
				maximum = maximum * -1
			base.maximumPixels = maximum;
			return maximum;
		},

		min : function(){
			return 0;
		},

		loops : function(){
			var base = this;

			base.positionsInArray = [0];
			var elWidth = 0;

			for(var i = 0; i<base.itemsAmount; i++){
				elWidth += base.itemWidth;
				base.positionsInArray.push(-elWidth)
			}
		},

		buildControls : function(){
			var base = this;
			if(base.options.navigation === true || base.options.pagination === true){
				base.swipeControls = $("<div class=\"swipe-controls\"/>").toggleClass("clickable", !base.isTouch).appendTo(base.$elem);
			}
			if(base.options.pagination === true){
				base.buildPagination();
			}
			if(base.options.navigation === true){
				base.buildButtons();
			}
		},

		buildButtons : function(){
			var base = this;
			var buttonsWrapper = $("<div class=\"swipe-buttons\"/>")
			base.swipeControls.append(buttonsWrapper);

			base.buttonPrev = $("<div/>",{
				"class" : "swipe-prev",
				"html" : base.options.navigationText[0] || ""
				});

			base.buttonNext = $("<div/>",{
				"class" : "swipe-next",
				"html" : base.options.navigationText[1] || ""
				});

			buttonsWrapper
			.append(base.buttonPrev)
			.append(base.buttonNext);

			buttonsWrapper.on(base.getEvent(), "div[class^=\"swipe\"]", function(event){
				event.preventDefault();
				if($(this).hasClass("swipe-next")){
					base.next();
				} else{
					base.prev();
				}
			})
		},

		getEvent : function(){
			var base = this;
			if (base.isTouch === true){
				return "touchend.swipeControls";
			} else {
				return "click.swipeControls";
			}
		},

		buildPagination : function(){
			var base = this;

			base.paginationWrapper = $("<div class=\"swipe-pagination\"/>");
			base.swipeControls.append(base.paginationWrapper);

			base.paginationWrapper.on(base.getEvent(), ".swipe-page", function(event){
				event.preventDefault();
				if(Number($(this).data("swipe-page")) !== base.currentSlide){
					base.goTo( Number($(this).data("swipe-page")), true);
				}
			});
		},

		updatePagination : function(){
			var base = this;
			if(base.options.pagination === false){
				return false;
			}

			base.paginationWrapper.html("");

			var counter = 0;
			var lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

			for(var i = 0; i<base.itemsAmount; i++){
				if(i % base.options.items === 0){
					counter +=1;
					if(lastPage === i){
						var lastItem = base.itemsAmount - base.options.items;
					}
					var paginationButton = $("<div/>",{
						"class" : "swipe-page"
						});
					var paginationButtonInner = $("<span></span>",{
						"text": base.options.paginationNumbers === true ? counter : "",
						"class": base.options.paginationNumbers === true ? "swipe-numbers" : ""
					});
					paginationButton.append(paginationButtonInner);

					paginationButton.data("swipe-page",lastPage === i ? lastItem : i);
					paginationButton.data("swipe-roundPages",counter);

					base.paginationWrapper.append(paginationButton);
				}
			}
			base.checkPagination();
		},
		checkPagination : function(){
			var base = this;

			base.paginationWrapper.find(".swipe-page").each(function(i,v){
				if($(this).data("swipe-roundPages") === $(base.swipeItems[base.currentSlide]).data("swipe-roundPages") ){
					base.paginationWrapper
						.find(".swipe-page")
						.removeClass("active");
					$(this).addClass("active");
				}
			});
		},

		checkNavigation : function(){
			var base = this;

			if(base.options.navigation === false){
				return false;
			}
			if(base.options.goToFirstNav === false){
				if(base.currentSlide === 0 && base.maximumSlide === 0){
					base.buttonPrev.addClass("disabled");
					base.buttonNext.addClass("disabled");
				} else if(base.currentSlide === 0 && base.maximumSlide !== 0){
					base.buttonPrev.addClass("disabled");
					base.buttonNext.removeClass("disabled");
				} else if (base.currentSlide === base.maximumSlide){
					base.buttonPrev.removeClass("disabled");
					base.buttonNext.addClass("disabled");
				} else if(base.currentSlide !== 0 && base.currentSlide !== base.maximumSlide){
					base.buttonPrev.removeClass("disabled");
					base.buttonNext.removeClass("disabled");
				}
			}
		},

		updateControls : function(){
			var base = this;
			base.updatePagination();
			base.checkNavigation();
			if(base.swipeControls){
				if(base.options.items === base.itemsAmount){
					base.swipeControls.hide();
				} else {
					base.swipeControls.show();
				}
			}
		},

		destroyControls : function(){
			var base = this;
			if(base.swipeControls){
				base.swipeControls.remove();
			}
		},

		next : function(speed){
			var base = this;
			base.currentSlide += base.options.scrollPerPage === true ? base.options.items : 1;
			if(base.currentSlide > base.maximumSlide + (base.options.scrollPerPage == true ? (base.options.items - 1) : 0)){
				if(base.options.goToFirstNav === true){
					base.currentSlide = 0;
					speed = "goToFirst";
				} else {
					base.currentSlide = base.maximumSlide;
					return false;
				}
			}
			base.goTo(base.currentSlide,speed);

		},

		prev : function(speed){
			var base = this;
			if(base.options.scrollPerPage === true && base.currentSlide > 0 && base.currentSlide < base.options.items){
				base.currentSlide = 0
			} else {
			base.currentSlide -= base.options.scrollPerPage === true ? base.options.items : 1;
			}
			if(base.currentSlide < 0){
				if(base.options.goToFirstNav === true){
					base.currentSlide = base.maximumSlide;
					speed = "goToFirst"
				} else {
					base.currentSlide =0;
					return false;
				}
			}
			base.goTo(base.currentSlide,speed);
		},

		goTo : function(position,pagination){
			var base = this;
			base.currentItem.html(base.currentSlide + 1);//숫자 페이징 처리

			if(typeof base.options.beforeMove === "function") {
				base.options.beforeMove.apply(this);
			}
			if(position >= base.maximumSlide){
				position = base.maximumSlide;
			}
			
			else if( position <= 0 ){
				position = 0;
			}
			base.currentSlide = position;

			var goToPixel = base.positionsInArray[position];

			if(base.support3d === true){
				base.isCss3Finish = false;

				if(pagination === true){
					base.swapTransitionSpeed("paginationSpeed");
					setTimeout(function() {
						base.isCss3Finish = true;
					}, base.options.paginationSpeed);

				} else if(pagination === "goToFirst" ){
					base.swapTransitionSpeed(base.options.goToFirstSpeed);
					setTimeout(function() {
						base.isCss3Finish = true;
					}, base.options.goToFirstSpeed);

				} else {
					base.swapTransitionSpeed("slideSpeed");
					setTimeout(function() {
						base.isCss3Finish = true;
					}, base.options.slideSpeed);
				}
				base.transition3d(goToPixel);
			} else {
				if(pagination === true){
					base.css2slide(goToPixel, base.options.paginationSpeed);
				} else if(pagination === "goToFirst" ){
					base.css2slide(goToPixel, base.options.goToFirstSpeed);
				} else {
					base.css2slide(goToPixel, base.options.slideSpeed);
				}
			}
			if(base.options.pagination === true){
				base.checkPagination();
			}
			if(base.options.navigation === true){
				base.checkNavigation();
			}
			if(base.options.autoPlay !== false){
				base.checkAp();
			}
			base.eachMoveUpdate();
			if(typeof base.options.afterMove === "function") {
				base.options.afterMove.apply(this);
			}
		},

		stop: function(){
			var base = this;
			base.apStatus = "stop";
			clearInterval(base.autoPlaySpeed);
		},

		checkAp : function(){
			var base = this;
			if(base.apStatus !== "stop"){
				base.play();
			}
		},

		play : function(){
			var base = this;
			base.apStatus = "play";
			if(base.options.autoPlay === false){
				return false;
			}
			clearInterval(base.autoPlaySpeed);
			base.autoPlaySpeed = setInterval(function(){
				if(base.currentSlide < base.maximumSlide && base.playDirection === "next"){
					base.next(true);
				} else if(base.currentSlide === base.maximumSlide){
					if(base.options.goToFirst === true){
						base.goTo(0,"goToFirst");
					} else{
						base.playDirection = "prev";
						base.prev(true);
					}
				} else if(base.playDirection === "prev" && base.currentSlide > 0){
					base.prev(true);
				} else if(base.playDirection === "prev" && base.currentSlide === 0){
					base.playDirection = "next";
					base.next(true);
				}
			},base.options.autoPlay);
		},

		swapTransitionSpeed : function(action){
			var base = this;
			if(action === "slideSpeed"){
				base.swipeWrapper.css(base.addTransition(base.options.slideSpeed));
			} else if(action === "paginationSpeed" ){
				base.swipeWrapper.css(base.addTransition(base.options.paginationSpeed));
			} else if(typeof action !== "string"){
				base.swipeWrapper.css(base.addTransition(action));
			}
		},

		addTransition : function(speed){
			var base = this;
			return {
				"-webkit-transition": "all "+ speed +"ms ease",
				"-moz-transition": "all "+ speed +"ms ease",
				"-o-transition": "all "+ speed +"ms ease",
				"transition": "all "+ speed +"ms ease"
			};
		},

		removeTransition : function(){
			return {
				"-webkit-transition": "",
				"-moz-transition": "",
				"-o-transition": "",
				"transition": ""
			};
		},

		doTranslate : function(pixels){
			return {
				"-webkit-transform": "translate3d("+pixels+"px, 0px, 0px)",
				"-moz-transform": "translate3d("+pixels+"px, 0px, 0px)",
				"-o-transform": "translate3d("+pixels+"px, 0px, 0px)",
				"-ms-transform": "translate3d("+pixels+"px, 0px, 0px)",
				"transform": "translate3d("+pixels+"px, 0px,0px)"
			};
		},

		transition3d : function(value){
			var base = this;
			base.swipeWrapper.css(base.doTranslate(value));
		},

		css2move : function(value){
			var base = this;
			base.swipeWrapper.css({"left" : value})
		},

		css2slide : function(value,speed){
			var base = this;

			base.isCssFinish = false;
			base.swipeWrapper.stop(true,true).animate({
				"left" : value
			}, {
				duration : speed || base.options.slideSpeed ,
				complete : function(){
					base.isCssFinish = true;
				}
			});
		},

		support3d : function(){
				var base = this;

				var sTranslate3D = "translate3d(0px, 0px, 0px)";
				 var eTemp = document.createElement("div");
				eTemp.style.cssText = "  -moz-transform:"    + sTranslate3D +
									  "; -ms-transform:"     + sTranslate3D +
									  "; -o-transform:"      + sTranslate3D +
									  "; -webkit-transform:" + sTranslate3D +
									  "; transform:"         + sTranslate3D;
				var rxTranslate = /translate3d\(0px, 0px, 0px\)/g;
				var asSupport = eTemp.style.cssText.match(rxTranslate);
				var bHasSupport = (asSupport !== null && asSupport.length === 1);
				base.support3d = bHasSupport
				return bHasSupport;
		},

		checkTouch : function(){
			var base = this;
			base.isTouch = ("ontouchstart" in document.documentElement);
		},

		moveEvents : function(){
			var base = this;
			if(base.options.mouseDraggable || base.isTouch === true){
				base.eventTypes();
				base.gestures();
				base.disabledEvents();
			}
		},

		eventTypes : function(){
		var base = this;
		var types;

		base.ev_types = {};

		if(base.isTouch) {
		types = [
			"touchstart.swipe",
			"touchmove.swipe",
			"touchend.swipe"
			];
		} else{
		types = [
			"mousedown.swipe",
			"mousemove.swipe",
			"mouseup.swipe"
			];
		}
		base.ev_types["start"] = types[0];
		base.ev_types["move"] = types[1];
		base.ev_types["end"] = types[2];
		},

		disabledEvents :  function(){
			var base = this;
			if(base.isTouch !== true){
				base.$elem.on("dragstart.swipe","img", function(event) { event.preventDefault();});
				base.$elem.bind("mousedown.disableTextSelect", function() {return false;});
			}
		},

		gestures : function(){
			var base = this;

			var locals = {
				offsetX : 0,
				offsetY : 0,
				baseElWidth : 0,
				relativePos : 0,
				position: null,
				minSwipe : null,
				maxSwipe: null,
				sliding : null,
				targetElement : null
			}

			base.isCssFinish = true;

			function getTouches(event){
				if(base.isTouch === true){
					return {
						x : event.touches[0].pageX,
						y : event.touches[0].pageY
					}
				} else {
					if(event.pageX !== undefined){
						return {
							x : event.pageX,
							y : event.pageY
						}
					} else {
						return {
							x : event.clientX,
							y : event.clientY
						}
					}
				}
			}

			function swapEvents(type){
				if(type === "on"){
					$(document).on(base.ev_types["move"], dragMove);
					$(document).on(base.ev_types["end"], dragEnd);
				} else if(type === "off"){
					$(document).off(base.ev_types["move"]);
					$(document).off(base.ev_types["end"]);
				}
			}
			function dragStart(event) {
				var event = event.originalEvent || event || window.event;

				if(base.isCssFinish === false){
					return false;
				}
				if(base.isCss3Finish === false){
					return false;
				}

				if(base.options.autoPlay !== false){
					clearInterval(base.autoPlaySpeed);
				}

				if(base.isTouch !== true && !base.swipeWrapper.hasClass("grabbing")){
					base.swipeWrapper.addClass("grabbing")
				}

				base.newPosX = 0;
				base.newRelativeX = 0;

				$(this).css(base.removeTransition());

				var position = $(this).position();
				locals.relativePos = position.left;
				
				locals.offsetX = getTouches(event).x - position.left;
				locals.offsetY = getTouches(event).y - position.top;

				swapEvents("on");

				locals.sliding = false;
				locals.targetElement = event.target || event.srcElement;
			}

			function dragMove(event){
				var event = event.originalEvent || event || window.event;

				base.newPosX = getTouches(event).x- locals.offsetX;
				base.newPosY = getTouches(event).y - locals.offsetY;
				base.newRelativeX = base.newPosX - locals.relativePos;

				if(base.newRelativeX > 8 || base.newRelativeX < -8 && base.isTouch === true){
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					locals.sliding = true;
				}

				if((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false){
					 $(document).off("touchmove.swipe");
				}

				var minSwipe = function(){
					return  base.newRelativeX / 5;
				}
				var maxSwipe = function(){
					return  base.maximumPixels + base.newRelativeX / 5;
				}

				base.newPosX = Math.max(Math.min( base.newPosX, minSwipe() ), maxSwipe() );
				if(base.support3d === true){
					base.transition3d(base.newPosX);
				} else {
					base.css2move(base.newPosX);
				}
			}

			var dragEnd = function(event){
				var event = event.originalEvent || event || window.event;
				event.target = event.target || event.srcElement;

				if(base.isTouch !== true){
					base.swipeWrapper.removeClass("grabbing");
				}

				swapEvents("off");

				if(base.newPosX !== 0){
					var newPosition = base.getNewPosition();
					base.goTo(newPosition);
					if(locals.targetElement === event.target && base.isTouch !== true){
						$(event.target).on("click.disable", function(ev){
							ev.stopImmediatePropagation()
							ev.stopPropagation();
							ev.preventDefault();
							$(event.target).off("click.disable");
						});
					var handlers = $._data(event.target, "events")["click"];
					var swipeStopEvent = handlers.pop();
					handlers.splice(0, 0, swipeStopEvent);
					}
				}
			}
			base.$elem.on(base.ev_types["start"], ".swipe-wrapper", dragStart); 
		},

		clearEvents : function(){
			var base = this;
			base.$elem.off(".swipe");
			$(document).off(".swipe");
		},

		getNewPosition : function(){
			var base = this,
				newPosition;

			var newPosition = base.improveClosest();

			if(newPosition>base.maximumSlide){
				base.currentSlide = base.maximumSlide;
				newPosition  = base.maximumSlide;
			} else if( base.newPosX >=0 ){
				newPosition = 0;
				base.currentSlide = 0;
			}
			return newPosition;
		},

		improveClosest : function(){
			var base = this;
			var array = base.positionsInArray;
			var goal = base.newPosX;
			var closest = null;
			$.each(array, function(i,v){
				if( goal - (base.itemWidth/20) > array[i+1] && goal - (base.itemWidth/20)< v && base.moveDirection() === "left") {
					closest = v;
					base.currentSlide = i;
				} 
				else if (goal + (base.itemWidth/20) < v && goal + (base.itemWidth/20) > array[i+1] && base.moveDirection() === "right"){
					closest = array[i+1];
					base.currentSlide = i+1;
				}
			});
			return base.currentSlide;
		},

		moveDirection : function(){
			var base = this,
				direction;
			if(base.newRelativeX < 0 ){
				direction = "right"
				base.playDirection = "next"
			} else {
				direction = "left"
				base.playDirection = "prev"
			}
			return direction
		},

		customEvents : function(){
			var base = this;
			base.$elem.on("swipe.next",function(){
				base.next();
			});
			base.$elem.on("swipe.prev",function(){
				base.prev();
			});
			base.$elem.on("swipe.play",function(event,speed){
				base.options.autoPlay = speed;
				base.play();
				base.hoverStatus = "play";
			});
			base.$elem.on("swipe.stop",function(){
				base.stop();
				base.hoverStatus = "stop";
			});
		},
		
		stopOnHover : function(){
			var base = this;
			if(base.options.stopOnHover === true && base.isTouch === false && base.options.autoPlay !== false){
				base.$elem.on("mouseover", function(){
					base.stop();
				});
				base.$elem.on("mouseout", function(){
					if(base.hoverStatus !== "stop"){
						base.play();
					}
				});
			}
		},

		lazyLoad : function(){
			var base = this;

			if(base.options.lazyLoad === false){
				return false;
			}

			for(var i=0; i<base.itemsAmount; i++){
				var item = $(base.swipeItems[i]),
					itemNumber = item.data("swipe-item"),
					lazyImg = item.find(".lazyswipe"),
					follow;

				if(item.data("swipe-loaded") === undefined){
					lazyImg.hide();
					item.addClass("loading").data("swipe-loaded","checked");
				} else if(item.data("swipe-loaded") === "loaded"){
					continue;
				}

				if(base.options.lazyFollow === true){
					follow = itemNumber >= base.currentSlide;
				}else {
					follow = true;
				}

				if(follow && itemNumber < base.currentSlide + base.options.items){
					item.data("swipe-loaded", "loaded");

					var link = lazyImg.data("src");
					if(link){
						lazyImg[0].src = link;
						lazyImg.removeAttr("data-src");
					}

					lazyImg.fadeIn(200);
					item.removeClass("loading");
				}
			}
		},

		autoHeight : function(){
			var base = this;
			if(base.options.autoHeight === true){
				var itemHeight = $(base.swipeItems[base.currentSlide]).css("height");
				base.wrapperOuter.css("height",itemHeight);

				setTimeout(function(){
					if(itemHeight !== $(base.swipeItems[base.currentSlide]).css("height")){
						base.wrapperOuter.css("height",itemHeight);
					}
				},400);

				setTimeout(function(){
					if(!base.wrapperOuter.hasClass("autoHeight")){
						base.wrapperOuter.addClass("autoHeight");
					}
				},0);
			}
		},
		addActiveClass : function(){
			var base = this;
			$(base.swipeItems).removeClass('active');
			$(base.swipeItems[base.currentSlide]).addClass('active');
		}

	};


	$.fn.swipe = function( options ){
		return this.each(function() {
			var carousel = Object.create( Carousel );
			carousel.init( options, this );
			$.data( this, "swipe", carousel );
		});
	};

	$.fn.swipe.options = {

		items : 5,
		itemsDesktop : [1199,4],
		itemsDesktopSmall : [979,3],
		itemsTablet: [768,2],
		itemsMobile : [479,1],
		singleItem:false,

		slideSpeed : 200,
		paginationSpeed : 800,

		autoPlay : true,
		stopOnHover : false,
		goToFirst : true,
		goToFirstSpeed : 1000,

		navigation : false,
		navigationText : ["prev","next"],
		goToFirstNav : true,
		scrollPerPage : false,

		pagination : true,
		paginationNumbers: false,

		responsive: true,
		responsiveRefreshRate : 200,

		baseClass : "swipe-carousel",
		theme : "swipe-theme",

		lazyLoad : false,
		lazyFollow : true,

		autoHeight : false,

		jsonPath : false,
		jsonSuccess : false,

		mouseDraggable : true,

		beforeInit : false,
		afterInit : false,
		beforeMove: false,
		afterMove: false,
		afterAction : false
	};

})( jQuery, window, document );







/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

;(function($){

	var plugin = {};

	var defaults = {

		// GENERAL
		mode: 'horizontal',
		slideSelector: '',
		infiniteLoop: true,
		hideControlOnEnd: false,
		speed: 500,
		easing: null,
		slideMargin: 0,
		startSlide: 0,
		randomStart: false,
		captions: false,
		ticker: false,
		tickerHover: false,
		adaptiveHeight: false,
		adaptiveHeightSpeed: 500,
		video: false,
		useCSS: true,
		preloadImages: 'visible',
		responsive: true,

		// TOUCH
		touchEnabled: true,
		swipeThreshold: 50,
		oneToOneTouch: true,
		preventDefaultSwipeX: true,
		preventDefaultSwipeY: false,

		// PAGER
		pager: true,
		pagerType: 'full',
		pagerShortSeparator: ' / ',
		pagerSelector: null,
		buildPager: null,
		pagerCustom: null,

		// CONTROLS
		controls: true,
		nextText: 'Next',
		prevText: 'Prev',
		nextSelector: null,
		prevSelector: null,
		autoControls: false,
		startText: 'Start',
		stopText: 'Stop',
		autoControlsCombine: false,
		autoControlsSelector: null,

		// AUTO
		auto: false,
		pause: 4000,
		autoStart: true,
		autoDirection: 'next',
		autoHover: false,
		autoDelay: 0,

		// CAROUSEL
		minSlides: 1,
		maxSlides: 1,
		moveSlides: 0,
		slideWidth: 0,

		// CALLBACKS
		onSliderLoad: function() {},
		onSlideBefore: function() {},
		onSlideAfter: function() {},
		onSlideNext: function() {},
		onSlidePrev: function() {}
	}

	$.fn.bxSlider = function(options){

		if(this.length == 0) return this;

		// support mutltiple elements
		if(this.length > 1){
			this.each(function(){$(this).bxSlider(options)});
			return this;
		}

		// create a namespace to be used throughout the plugin
		var slider = {};
		// set a reference to our slider element
		var el = this;
		plugin.el = this;

		/**
		 * Makes slideshow responsive
		 */
		// first get the original window dimens (thanks alot IE)
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();



		/**
		 * ===================================================================================
		 * = PRIVATE FUNCTIONS
		 * ===================================================================================
		 */

		/**
		 * Initializes namespace settings to be used throughout plugin
		 */
		var init = function(){
			// merge user-supplied options with the defaults
			slider.settings = $.extend({}, defaults, options);
			// parse slideWidth setting
			slider.settings.slideWidth = parseInt(slider.settings.slideWidth);
			// store the original children
			slider.children = el.children(slider.settings.slideSelector);
			// check if actual number of slides is less than minSlides / maxSlides
			if(slider.children.length < slider.settings.minSlides) slider.settings.minSlides = slider.children.length;
			if(slider.children.length < slider.settings.maxSlides) slider.settings.maxSlides = slider.children.length;
			// if random start, set the startSlide setting to random number
			if(slider.settings.randomStart) slider.settings.startSlide = Math.floor(Math.random() * slider.children.length);
			// store active slide information
			slider.active = { index: slider.settings.startSlide }
			// store if the slider is in carousel mode (displaying / moving multiple slides)
			slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1;
			// if carousel, force preloadImages = 'all'
			if(slider.carousel) slider.settings.preloadImages = 'all';
			// calculate the min / max width thresholds based on min / max number of slides
			// used to setup and update carousel slides dimensions
			slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
			slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
			// store the current state of the slider (if currently animating, working is true)
			slider.working = false;
			// initialize the controls object
			slider.controls = {};
			// initialize an auto interval
			slider.interval = null;
			// determine which property to use for transitions
			slider.animProp = slider.settings.mode == 'vertical' ? 'top' : 'left';
			// determine if hardware acceleration can be used
			slider.usingCSS = slider.settings.useCSS && slider.settings.mode != 'fade' && (function(){
				// create our test div element
				var div = document.createElement('div');
				// css transition properties
				var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
				// test for each property
				for(var i in props){
					if(div.style[props[i]] !== undefined){
						slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
						slider.animProp = '-' + slider.cssPrefix + '-transform';
						return true;
					}
				}
				return false;
			}());
			// if vertical mode always make maxSlides and minSlides equal
			if(slider.settings.mode == 'vertical') slider.settings.maxSlides = slider.settings.minSlides;
			// save original style data
			el.data("origStyle", el.attr("style"));
			el.children(slider.settings.slideSelector).each(function() {
			  $(this).data("origStyle", $(this).attr("style"));
			});

			slider.isAndroid = false;;

			if( /Android|webOS|BlackBerry|IEMobile/i.test(navigator.userAgent) ) {
				slider.isAndroid = true;
			}
			// perform all DOM / CSS modifications
			setup();
		}

		/**
		 * Performs all DOM and CSS modifications
		 */
		var setup = function(){
			// wrap el in a wrapper
			el.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');
			// store a namspace reference to .bx-viewport
			slider.viewport = el.parent();
			// add a loading div to display while images are loading
			slider.loader = $('<div class="bx-loading" />');
			slider.viewport.prepend(slider.loader);
			// set el to a massive width, to hold any needed slides
			// also strip any margin and padding from el
			el.css({
				width: slider.settings.mode == 'horizontal' ? (slider.children.length * 100 + 215) + '%' : 'auto',
				position: 'relative'
			});
			// if using CSS, add the easing property
			if(slider.usingCSS && slider.settings.easing){
				el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
			// if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
			}else if(!slider.settings.easing){
				slider.settings.easing = 'swing';
			}
			var slidesShowing = getNumberSlidesShowing();
			// make modifications to the viewport (.bx-viewport)
			slider.viewport.css({
				width: '100%',
				overflow: 'hidden',
				position: 'relative'
			});
			slider.viewport.parent().css({
				maxWidth: getViewportMaxWidth()
			});
			// make modification to the wrapper (.bx-wrapper)
			if(!slider.settings.pager) {
				slider.viewport.parent().css({
				margin: '0 auto 0px'
				});
			}
			// apply css to all slider children
			slider.children.css({
				'float': slider.settings.mode == 'horizontal' ? 'left' : 'none',
				listStyle: 'none',
				position: 'relative'
			});
			// apply the calculated width after the float is applied to prevent scrollbar interference
			slider.children.css('width', getSlideWidth());
			// if slideMargin is supplied, add the css
			if(slider.settings.mode == 'horizontal' && slider.settings.slideMargin > 0) slider.children.css('marginRight', slider.settings.slideMargin);
			if(slider.settings.mode == 'vertical' && slider.settings.slideMargin > 0) slider.children.css('marginBottom', slider.settings.slideMargin);
			// if "fade" mode, add positioning and z-index CSS
			if(slider.settings.mode == 'fade'){
				slider.children.css({
					position: 'absolute',
					zIndex: 0,
					display: 'none'
				});
				// prepare the z-index on the showing element
				slider.children.eq(slider.settings.startSlide).css({zIndex: 50, display: 'block'});
			}
			// create an element to contain all slider controls (pager, start / stop, etc)
			slider.controls.el = $('<div class="bx-controls" />');
			// if captions are requested, add them
			if(slider.settings.captions) appendCaptions();
			// check if startSlide is last slide
			slider.active.last = slider.settings.startSlide == getPagerQty() - 1;
			// if video is true, set up the fitVids plugin
			if(slider.settings.video) el.fitVids();
			// set the default preload selector (visible)
			var preloadSelector = slider.children.eq(slider.settings.startSlide);
			if (slider.settings.preloadImages == "all") preloadSelector = slider.children;
			// only check for control addition if not in "ticker" mode
			if(!slider.settings.ticker){
				// if pager is requested, add it
				if(slider.settings.pager) appendPager();
				// if controls are requested, add them
				if(slider.settings.controls) appendControls();
				// if auto is true, and auto controls are requested, add them
				if(slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
				// if any control option is requested, add the controls wrapper
				if(slider.settings.controls || slider.settings.autoControls || slider.settings.pager) slider.viewport.after(slider.controls.el);
			// if ticker mode, do not allow a pager
			}else{
				slider.settings.pager = false;
			}
			// preload all images, then perform final DOM / CSS modifications that depend on images being loaded
			loadElements(preloadSelector, start);
		}

		var loadElements = function(selector, callback){
			var total = selector.find('img, iframe').length;
			if (total == 0){
				callback();
				return;
			}
			var count = 0;
			selector.find('img, iframe').each(function(){
				$(this).one('load', function() {
				  if(++count == total) callback();
				}).each(function() {
				  if(this.complete) $(this).load();
				});
			});
		}

		/**
		 * Start the slider
		 */
		var start = function(){
			// if infinite loop, prepare additional slides
			if(slider.settings.infiniteLoop && slider.settings.mode != 'fade' && !slider.settings.ticker){
				var slice = slider.settings.mode == 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides;
				var sliceAppend = slider.children.slice(0, slice).clone().addClass('bx-clone');
				var slicePrepend = slider.children.slice(-slice).clone().addClass('bx-clone');
				el.append(sliceAppend).prepend(slicePrepend);
			}
			// remove the loading DOM element
			slider.loader.remove();
			// set the left / top position of "el"
			setSlidePosition();
			// if "vertical" mode, always use adaptiveHeight to prevent odd behavior
			if (slider.settings.mode == 'vertical') slider.settings.adaptiveHeight = true;
			// set the viewport height
			slider.viewport.height(getViewportHeight());
			// make sure everything is positioned just right (same as a window resize)
			el.redrawSlider();
			// onSliderLoad callback
			slider.settings.onSliderLoad(slider.active.index);
			// slider has been fully initialized
			slider.initialized = true;
			// bind the resize call to the window
			if (slider.settings.responsive) $(window).bind('resize', resizeWindow);
			// if auto is true, start the show
			if (slider.settings.auto && slider.settings.autoStart) initAuto();
			// if ticker is true, start the ticker
			if (slider.settings.ticker) initTicker();
			// if pager is requested, make the appropriate pager link active
			if (slider.settings.pager) updatePagerActive(slider.settings.startSlide);
			// check for any updates to the controls (like hideControlOnEnd updates)
			if (slider.settings.controls) updateDirectionControls();
			// if touchEnabled is true, setup the touch events
			if (slider.settings.touchEnabled && !slider.settings.ticker) initTouch();
		}

		/**
		 * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
		 */
		var getViewportHeight = function(){
			var height = 0;
			// first determine which children (slides) should be used in our height calculation
			var children = $();
			// if mode is not "vertical" and adaptiveHeight is false, include all children
			if(slider.settings.mode != 'vertical' && !slider.settings.adaptiveHeight){
				children = slider.children;
			}else{
				// if not carousel, return the single active child
				if(!slider.carousel){
					children = slider.children.eq(slider.active.index);
				// if carousel, return a slice of children
				}else{
					// get the individual slide index
					var currentIndex = slider.settings.moveSlides == 1 ? slider.active.index : slider.active.index * getMoveBy();
					// add the current slide to the children
					children = slider.children.eq(currentIndex);
					// cycle through the remaining "showing" slides
					for (i = 1; i <= slider.settings.maxSlides - 1; i++){
						// if looped back to the start
						if(currentIndex + i >= slider.children.length){
							children = children.add(slider.children.eq(i - 1));
						}else{
							children = children.add(slider.children.eq(currentIndex + i));
						}
					}
				}
			}
			// if "vertical" mode, calculate the sum of the heights of the children
			if(slider.settings.mode == 'vertical'){
				children.each(function(index) {
				  height += $(this).outerHeight();
				});
				// add user-supplied margins
				if(slider.settings.slideMargin > 0){
					height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
				}
			// if not "vertical" mode, calculate the max height of the children
			}else{
				height = Math.max.apply(Math, children.map(function(){
					return $(this).outerHeight(false);
				}).get());
			}
			return height;
		}

		/**
		 * Returns the calculated width to be used for the outer wrapper / viewport
		 */
		var getViewportMaxWidth = function(){
			var width = '100%';
			if(slider.settings.slideWidth > 0){
				if(slider.settings.mode == 'horizontal'){
					width = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
				}else{
					width = slider.settings.slideWidth;
				}
			}
			return width;
		}

		/**
		 * Returns the calculated width to be applied to each slide
		 */
		var getSlideWidth = function(){
			// start with any user-supplied slide width
			var newElWidth = slider.settings.slideWidth;
			// get the current viewport width
			var wrapWidth = slider.viewport.width();
			// if slide width was not supplied, or is larger than the viewport use the viewport width
			if(slider.settings.slideWidth == 0 ||
				(slider.settings.slideWidth > wrapWidth && !slider.carousel) ||
				slider.settings.mode == 'vertical'){
				newElWidth = wrapWidth;
			// if carousel, use the thresholds to determine the width
			}else if(slider.settings.maxSlides > 1 && slider.settings.mode == 'horizontal'){
				if(wrapWidth > slider.maxThreshold){
					// newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.maxSlides - 1))) / slider.settings.maxSlides;
				}else if(wrapWidth < slider.minThreshold){
					newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
				}
			}
			return newElWidth;
		}

		/**
		 * Returns the number of slides currently visible in the viewport (includes partially visible slides)
		 */
		var getNumberSlidesShowing = function(){
			var slidesShowing = 1;
			if(slider.settings.mode == 'horizontal' && slider.settings.slideWidth > 0){
				// if viewport is smaller than minThreshold, return minSlides
				if(slider.viewport.width() < slider.minThreshold){
					slidesShowing = slider.settings.minSlides;
				// if viewport is larger than minThreshold, return maxSlides
				}else if(slider.viewport.width() > slider.maxThreshold){
					slidesShowing = slider.settings.maxSlides;
				// if viewport is between min / max thresholds, divide viewport width by first child width
				}else{
					var childWidth = slider.children.first().width();
					slidesShowing = Math.floor(slider.viewport.width() / childWidth);
				}
			// if "vertical" mode, slides showing will always be minSlides
			}else if(slider.settings.mode == 'vertical'){
				slidesShowing = slider.settings.minSlides;
			}
			return slidesShowing;
		}

		/**
		 * Returns the number of pages (one full viewport of slides is one "page")
		 */
		var getPagerQty = function(){
			var pagerQty = 0;
			// if moveSlides is specified by the user
			if(slider.settings.moveSlides > 0){
				if(slider.settings.infiniteLoop){
					pagerQty = slider.children.length / getMoveBy();
				}else{
					// use a while loop to determine pages
					var breakPoint = 0;
					var counter = 0
					// when breakpoint goes above children length, counter is the number of pages
					while (breakPoint < slider.children.length){
						++pagerQty;
						breakPoint = counter + getNumberSlidesShowing();
						counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
					}
				}
			// if moveSlides is 0 (auto) divide children length by sides showing, then round up
			}else{
				pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
			}
			return pagerQty;
		}

		/**
		 * Returns the number of indivual slides by which to shift the slider
		 */
		var getMoveBy = function(){
			// if moveSlides was set by the user and moveSlides is less than number of slides showing
			if(slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()){
				return slider.settings.moveSlides;
			}
			// if moveSlides is 0 (auto)
			return getNumberSlidesShowing();
		}

		/**
		 * Sets the slider's (el) left or top position
		 */
		var setSlidePosition = function(){
			// if last slide, not infinite loop, and number of children is larger than specified maxSlides
			if(slider.children.length > slider.settings.maxSlides && slider.active.last && !slider.settings.infiniteLoop){
				if (slider.settings.mode == 'horizontal'){
					// get the last child's position
					var lastChild = slider.children.last();
					var position = lastChild.position();
					// set the left position
					setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.width())), 'reset', 0);
				}else if(slider.settings.mode == 'vertical'){
					// get the last showing index's position
					var lastShowingIndex = slider.children.length - slider.settings.minSlides;
					var position = slider.children.eq(lastShowingIndex).position();
					// set the top position
					setPositionProperty(-position.top, 'reset', 0);
				}
			// if not last slide
			}else{
				// get the position of the first showing slide
				var position = slider.children.eq(slider.active.index * getMoveBy()).position();
				// check for last slide
				if (slider.active.index == getPagerQty() - 1) slider.active.last = true;
				// set the repective position
				if (position != undefined){
					if (slider.settings.mode == 'horizontal') setPositionProperty(-position.left, 'reset', 0);
					else if (slider.settings.mode == 'vertical') setPositionProperty(-position.top, 'reset', 0);
				}
			}
		}

		/**
		 * Sets the el's animating property position (which in turn will sometimes animate el).
		 * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
		 *
		 * @param value (int)
		 *  - the animating property's value
		 *
		 * @param type (string) 'slider', 'reset', 'ticker'
		 *  - the type of instance for which the function is being
		 *
		 * @param duration (int)
		 *  - the amount of time (in ms) the transition should occupy
		 *
		 * @param params (array) optional
		 *  - an optional parameter containing any variables that need to be passed in
		 */
		var setPositionProperty = function(value, type, duration, params){
			// use CSS transform
			if(slider.usingCSS){
				// determine the translate3d value
				var propValue = slider.settings.mode == 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
				// add the CSS transition-duration
				el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
				if(type == 'slide'){
					// set the property value
					el.css(slider.animProp, propValue);
					// bind a callback method - executes when CSS transition completes
					el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
						// unbind the callback
						el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
						updateAfterSlideTransition();
					});
				}else if(type == 'reset'){
					el.css(slider.animProp, propValue);
				}else if(type == 'ticker'){
					// make the transition use 'linear'
					el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
					el.css(slider.animProp, propValue);
					// bind a callback method - executes when CSS transition completes
					el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
						// unbind the callback
						el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
						// reset the position
						setPositionProperty(params['resetValue'], 'reset', 0);
						// start the loop again
						tickerLoop();
					});
				}
			// use JS animate
			}else{
				var animateObj = {};
				animateObj[slider.animProp] = value;
				if(type == 'slide'){
					el.animate(animateObj, duration, slider.settings.easing, function(){
						updateAfterSlideTransition();
					});
				}else if(type == 'reset'){
					el.css(slider.animProp, value)
				}else if(type == 'ticker'){
					el.animate(animateObj, speed, 'linear', function(){
						setPositionProperty(params['resetValue'], 'reset', 0);
						// run the recursive loop after animation
						tickerLoop();
					});
				}
			}
		}

		/**
		 * Populates the pager with proper amount of pages
		 */
		var populatePager = function(){
			var pagerHtml = '';
			var pagerQty = getPagerQty();
			// loop through each pager item
			for(var i=0; i < pagerQty; i++){
				var linkContent = '';
				// if a buildPager function is supplied, use it to get pager link value, else use index + 1
				if(slider.settings.buildPager && $.isFunction(slider.settings.buildPager)){
					linkContent = slider.settings.buildPager(i);
					slider.pagerEl.addClass('bx-custom-pager');
				}else{
					linkContent = i + 1;
					slider.pagerEl.addClass('bx-default-pager');
				}
				// var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
				// add the markup to the string
				pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
			};
			// populate the pager element with pager links
			slider.pagerEl.html(pagerHtml);
		}

		/**
		 * Appends the pager to the controls element
		 */
		var appendPager = function(){
			if(!slider.settings.pagerCustom){
				// create the pager DOM element
				slider.pagerEl = $('<div class="bx-pager" />');
				// if a pager selector was supplied, populate it with the pager
				if(slider.settings.pagerSelector){
					$(slider.settings.pagerSelector).html(slider.pagerEl);
				// if no pager selector was supplied, add it after the wrapper
				}else{
					slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
				}
				// populate the pager
				populatePager();
			}else{
				slider.pagerEl = $(slider.settings.pagerCustom);
			}
			// assign the pager click binding
			slider.pagerEl.delegate('a', 'click', clickPagerBind);
		}

		/**
		 * Appends prev / next controls to the controls element
		 */
		var appendControls = function(){
			slider.controls.next = $('<a class="bx-next" href="">' + slider.settings.nextText + '</a>');
			slider.controls.prev = $('<a class="bx-prev" href="">' + slider.settings.prevText + '</a>');
			// bind click actions to the controls
			slider.controls.next.bind('click', clickNextBind);
			slider.controls.prev.bind('click', clickPrevBind);
			// if nextSlector was supplied, populate it
			if(slider.settings.nextSelector){
				$(slider.settings.nextSelector).append(slider.controls.next);
			}
			// if prevSlector was supplied, populate it
			if(slider.settings.prevSelector){
				$(slider.settings.prevSelector).append(slider.controls.prev);
			}
			// if no custom selectors were supplied
			if(!slider.settings.nextSelector && !slider.settings.prevSelector){
				// add the controls to the DOM
				slider.controls.directionEl = $('<div class="bx-controls-direction" />');
				// add the control elements to the directionEl
				slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
				// slider.viewport.append(slider.controls.directionEl);
				slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
			}
		}

		/**
		 * Appends start / stop auto controls to the controls element
		 */
		var appendControlsAuto = function(){
			slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
			slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
			// add the controls to the DOM
			slider.controls.autoEl = $('<div class="bx-controls-auto" />');
			// bind click actions to the controls
			slider.controls.autoEl.delegate('.bx-start', 'click', clickStartBind);
			slider.controls.autoEl.delegate('.bx-stop', 'click', clickStopBind);
			// if autoControlsCombine, insert only the "start" control
			if(slider.settings.autoControlsCombine){
				slider.controls.autoEl.append(slider.controls.start);
			// if autoControlsCombine is false, insert both controls
			}else{
				slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
			}
			// if auto controls selector was supplied, populate it with the controls
			if(slider.settings.autoControlsSelector){
				$(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
			// if auto controls selector was not supplied, add it after the wrapper
			}else{
				slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
			}
			// update the auto controls
			updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
		}

		/**
		 * Appends image captions to the DOM
		 */
		var appendCaptions = function(){
			// cycle through each child
			slider.children.each(function(index){
				// get the image title attribute
				var title = $(this).find('img:first').attr('title');
				// append the caption
				if (title != undefined && ('' + title).length) {
                    $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
                }
			});
		}

		/**
		 * Click next binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var clickNextBind = function(e){
			// if auto show is running, stop it
			if (slider.settings.auto) el.stopAuto();
			el.goToNextSlide();
			e.preventDefault();
		}

		/**
		 * Click prev binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var clickPrevBind = function(e){
			// if auto show is running, stop it
			if (slider.settings.auto) el.stopAuto();
			el.goToPrevSlide();
			e.preventDefault();
		}

		/**
		 * Click start binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var clickStartBind = function(e){
			el.startAuto();
			e.preventDefault();
		}

		/**
		 * Click stop binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var clickStopBind = function(e){
			el.stopAuto();
			e.preventDefault();
		}

		/**
		 * Click pager binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var clickPagerBind = function(e){
			// if auto show is running, stop it
			if (slider.settings.auto) el.stopAuto();
			var pagerLink = $(e.currentTarget);
			var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
			// if clicked pager link is not active, continue with the goToSlide call
			if(pagerIndex != slider.active.index) el.goToSlide(pagerIndex);
			e.preventDefault();
		}

		/**
		 * Updates the pager links with an active class
		 *
		 * @param slideIndex (int)
		 *  - index of slide to make active
		 */
		var updatePagerActive = function(slideIndex){
			// if "short" pager type
			var len = slider.children.length; // nb of children
			if(slider.settings.pagerType == 'short'){
				if(slider.settings.maxSlides > 1) {
					len = Math.ceil(slider.children.length/slider.settings.maxSlides);
				}
				slider.pagerEl.html( (slideIndex + 1) + slider.settings.pagerShortSeparator + len);
				return;
			}
			// remove all pager active classes
			slider.pagerEl.find('a').removeClass('active');
			// apply the active class for all pagers
			slider.pagerEl.each(function(i, el) { $(el).find('a').eq(slideIndex).addClass('active'); });
		}

		/**
		 * Performs needed actions after a slide transition
		 */
		var updateAfterSlideTransition = function(){
			// if infinte loop is true
			if(slider.settings.infiniteLoop){
				var position = '';
				// first slide
				if(slider.active.index == 0){
					// set the new position
					position = slider.children.eq(0).position();
				// carousel, last slide
				}else if(slider.active.index == getPagerQty() - 1 && slider.carousel){
					position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
				// last slide
				}else if(slider.active.index == slider.children.length - 1){
					position = slider.children.eq(slider.children.length - 1).position();
				}
				if (slider.settings.mode == 'horizontal') { setPositionProperty(-position.left, 'reset', 0);; }
				else if (slider.settings.mode == 'vertical') { setPositionProperty(-position.top, 'reset', 0);; }
			}
			// declare that the transition is complete
			slider.working = false;
			// onSlideAfter callback
			slider.settings.onSlideAfter(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
		}

		/**
		 * Updates the auto controls state (either active, or combined switch)
		 *
		 * @param state (string) "start", "stop"
		 *  - the new state of the auto show
		 */
		var updateAutoControls = function(state){
			// if autoControlsCombine is true, replace the current control with the new state
			if(slider.settings.autoControlsCombine){
				slider.controls.autoEl.html(slider.controls[state]);
			// if autoControlsCombine is false, apply the "active" class to the appropriate control
			}else{
				slider.controls.autoEl.find('a').removeClass('active');
				slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
			}
		}

		/**
		 * Updates the direction controls (checks if either should be hidden)
		 */
		var updateDirectionControls = function(){
			if(getPagerQty() == 1){
				slider.controls.prev.addClass('disabled');
				slider.controls.next.addClass('disabled');
			}else if(!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd){
				// if first slide
				if (slider.active.index == 0){
					slider.controls.prev.addClass('disabled');
					slider.controls.next.removeClass('disabled');
				// if last slide
				}else if(slider.active.index == getPagerQty() - 1){
					slider.controls.next.addClass('disabled');
					slider.controls.prev.removeClass('disabled');
				// if any slide in the middle
				}else{
					slider.controls.prev.removeClass('disabled');
					slider.controls.next.removeClass('disabled');
				}
			}
		}

		/**
		 * Initialzes the auto process
		 */
		var initAuto = function(){
			// if autoDelay was supplied, launch the auto show using a setTimeout() call
			if(slider.settings.autoDelay > 0){
				var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
			// if autoDelay was not supplied, start the auto show normally
			}else{
				el.startAuto();
			}
			// if autoHover is requested
			if(slider.settings.autoHover){
				// on el hover
				el.hover(function(){
					// if the auto show is currently playing (has an active interval)
					if(slider.interval){
						// stop the auto show and pass true agument which will prevent control update
						el.stopAuto(true);
						// create a new autoPaused value which will be used by the relative "mouseout" event
						slider.autoPaused = true;
					}
				}, function(){
					// if the autoPaused value was created be the prior "mouseover" event
					if(slider.autoPaused){
						// start the auto show and pass true agument which will prevent control update
						el.startAuto(true);
						// reset the autoPaused value
						slider.autoPaused = null;
					}
				});
			}
		}

		/**
		 * Initialzes the ticker process
		 */
		var initTicker = function(){
			var startPosition = 0;
			// if autoDirection is "next", append a clone of the entire slider
			if(slider.settings.autoDirection == 'next'){
				el.append(slider.children.clone().addClass('bx-clone'));
			// if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
			}else{
				el.prepend(slider.children.clone().addClass('bx-clone'));
				var position = slider.children.first().position();
				startPosition = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
			}
			setPositionProperty(startPosition, 'reset', 0);
			// do not allow controls in ticker mode
			slider.settings.pager = false;
			slider.settings.controls = false;
			slider.settings.autoControls = false;
			// if autoHover is requested
			if(slider.settings.tickerHover && !slider.usingCSS){
				// on el hover
				slider.viewport.hover(function(){
					el.stop();
				}, function(){
					// calculate the total width of children (used to calculate the speed ratio)
					var totalDimens = 0;
					slider.children.each(function(index){
					  totalDimens += slider.settings.mode == 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
					});
					// calculate the speed ratio (used to determine the new speed to finish the paused animation)
					var ratio = slider.settings.speed / totalDimens;
					// determine which property to use
					var property = slider.settings.mode == 'horizontal' ? 'left' : 'top';
					// calculate the new speed
					var newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
					tickerLoop(newSpeed);
				});
			}
			// start the ticker loop
			tickerLoop();
		}

		/**
		 * Runs a continuous loop, news ticker-style
		 */
		var tickerLoop = function(resumeSpeed){
			speed = resumeSpeed ? resumeSpeed : slider.settings.speed;
			var position = {left: 0, top: 0};
			var reset = {left: 0, top: 0};
			// if "next" animate left position to last child, then reset left to 0
			if(slider.settings.autoDirection == 'next'){
				position = el.find('.bx-clone').first().position();
			// if "prev" animate left position to 0, then reset left to first non-clone child
			}else{
				reset = slider.children.first().position();
			}
			var animateProperty = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
			var resetValue = slider.settings.mode == 'horizontal' ? -reset.left : -reset.top;
			var params = {resetValue: resetValue};
			setPositionProperty(animateProperty, 'ticker', speed, params);
		}

		/**
		 * Initializes touch events
		 */
		var initTouch = function(){
			// initialize object to contain all touch values
			/*slider.touch = {
				start: {x: 0, y: 0},
				end: {x: 0, y: 0}
			}*/
			slider.touch = {
				start: {x: 0, y: 0},
				end: {x: 0, y: 0},
				scrollX: 0,
				scrollY: 0,
				androidException : false
			}
			slider.viewport.bind('touchstart', onTouchStart);
		}

		/**
		 * Event handler for "touchstart"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var onTouchStart = function(e){
			if(slider.working){
				e.preventDefault();
			}else{
				// record the original position when touch starts
				slider.touch.originalPos = el.position();
				slider.touch.originalPos2 = el.position();
				var orig = e.originalEvent;
				var view = e.view;
				// record the starting touch x, y coordinates
				slider.touch.start.x = orig.changedTouches[0].pageX;
				slider.touch.start.y = orig.changedTouches[0].pageY;
				slider.touch.scrollX = view.scrollX;
				slider.touch.scrollY = view.scrollY;
				// bind a "touchmove" event to the viewport
				slider.viewport.bind('touchmove', onTouchMove);
				// bind a "touchend" event to the viewport
				slider.viewport.bind('touchend', onTouchEnd);
			}
		}

		/**
		 * Event handler for "touchmove"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var onTouchMove = function(e){
			//$('#d').text(e.type);
			var orig = e.originalEvent;
			var view = e.view;
			// if scrolling on y axis, do not prevent default
			var xMovement = Math.abs(orig.changedTouches[0].pageX - slider.touch.start.x);
			var yMovement = Math.abs(orig.changedTouches[0].pageY - slider.touch.start.y);

			// x axis swipe
			//if((xMovement * 3) > yMovement && slider.settings.preventDefaultSwipeX){
			if(xMovement > yMovement && slider.settings.preventDefaultSwipeX){
				e.preventDefault();
				if (slider.isAndroid) {slider.touch.androidException = true};

			// y axis swipe
			//}else if((yMovement * 3) > xMovement && slider.settings.preventDefaultSwipeY){
			}else if(yMovement > xMovement && slider.settings.preventDefaultSwipeY){
				e.preventDefault();
				if (slider.isAndroid) {slider.touch.androidException = true};
			}

			if(slider.settings.mode != 'fade' && slider.settings.oneToOneTouch){
				var value = 0;
				// if horizontal, drag along x axis
				if(slider.settings.mode == 'horizontal'){
					if(slider.touch.scrollY == view.scrollY){
						var change = orig.changedTouches[0].pageX - slider.touch.start.x;
						//for android
						if((slider.isAndroid && slider.touch.androidException) || (!slider.isAndroid && !slider.touch.androidException)) {
							value = slider.touch.originalPos.left + change;
						}else {
							value = slider.touch.originalPos2.left;
						}
						setPositionProperty(value, 'reset', 0);
					}else {
						if(slider.isAndroid){
							value = slider.touch.originalPos2.left;
							setPositionProperty(value, 'reset', 0);
						}
					}
				// if vertical, drag along y axis
				}else{
					if(slider.touch.scrollX == view.scrollX){
						var change = orig.changedTouches[0].pageY - slider.touch.start.y;
						value = slider.touch.originalPos.top + change;
						setPositionProperty(value, 'reset', 0);
					}
				}
				slider.touch.androidException = false;
			}
		}

		/**
		 * Event handler for "touchend"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
		var onTouchEnd = function(e){
			//$('#d').text(e.type);
			slider.viewport.unbind('touchmove', onTouchMove);
			var orig = e.originalEvent;
			var view = e.view;
			var value = 0;
			// record end x, y positions
			slider.touch.end.x = orig.changedTouches[0].pageX;
			slider.touch.end.y = orig.changedTouches[0].pageY;
			// if fade mode, check if absolute x distance clears the threshold
			if(slider.settings.mode == 'fade'){
				var distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
				if(distance >= slider.settings.swipeThreshold){
					slider.touch.start.x > slider.touch.end.x ? el.goToNextSlide() : el.goToPrevSlide();
					el.stopAuto();
				}
				// not fade mode
			}else{
				var distance = 0;
				// calculate distance and el's animate property
				//alert(slider.settings.mode);
				if(slider.settings.mode == 'horizontal'){
					if(slider.touch.scrollY == view.scrollY){
						distance = slider.touch.end.x - slider.touch.start.x;
						value = slider.touch.originalPos.left;
					}else {
						value = slider.touch.originalPos2.left;

					}
					//alert(value + ', ' + slider.touch.originalPos2.left);
				}else{
					if(slider.touch.scrollX == view.scrollX){
						distance = slider.touch.end.y - slider.touch.start.y;
						value = slider.touch.originalPos.top;
					}else {
						value = slider.touch.originalPos2.left;
					}
				}
				// if not infinite loop and first / last slide, do not attempt a slide transition
				if(!slider.settings.infiniteLoop && ((slider.active.index == 0 && distance > 0) || (slider.active.last && distance < 0))){
					setPositionProperty(value, 'reset', 200);
				}else{
					// check if distance clears threshold
					if(Math.abs(distance) >= slider.settings.swipeThreshold){
						distance < 0 ? el.goToNextSlide() : el.goToPrevSlide();
						el.stopAuto();
					}else{
						//el.animate(property, 200); //원본 소스상 주석
						setPositionProperty(value, 'reset', 200);
					}
				}
			}
			slider.viewport.unbind('touchend', onTouchEnd);
		}

		/**
		 * Window resize event callback
		 */
		var resizeWindow = function(e){
			// get the new window dimens (again, thank you IE)
			var windowWidthNew = $(window).width();
			var windowHeightNew = $(window).height();
			// make sure that it is a true window resize
			// *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
			// are resized. Can you just die already?*
			if(windowWidth != windowWidthNew || windowHeight != windowHeightNew){
				// set the new window dimens
				windowWidth = windowWidthNew;
				windowHeight = windowHeightNew;
				// update all dynamic elements
				el.redrawSlider();
			}
		}

		/**
		 * ===================================================================================
		 * = PUBLIC FUNCTIONS
		 * ===================================================================================
		 */

		/**
		 * Performs slide transition to the specified slide
		 *
		 * @param slideIndex (int)
		 *  - the destination slide's index (zero-based)
		 *
		 * @param direction (string)
		 *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
		 */
		el.goToSlide = function(slideIndex, direction){
			// if plugin is currently in motion, ignore request
			if(slider.working || slider.active.index == slideIndex) return;
			// declare that plugin is in motion
			slider.working = true;
			// store the old index
			slider.oldIndex = slider.active.index;
			// if slideIndex is less than zero, set active index to last child (this happens during infinite loop)
			if(slideIndex < 0){
				slider.active.index = getPagerQty() - 1;
			// if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
			}else if(slideIndex >= getPagerQty()){
				slider.active.index = 0;
			// set active index to requested slide
			}else{
				slider.active.index = slideIndex;
			}
			// onSlideBefore, onSlideNext, onSlidePrev callbacks
			slider.settings.onSlideBefore(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
			if(direction == 'next'){
				slider.settings.onSlideNext(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
			}else if(direction == 'prev'){
				slider.settings.onSlidePrev(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
			}
			// check if last slide
			slider.active.last = slider.active.index >= getPagerQty() - 1;
			// update the pager with active class
			if(slider.settings.pager) updatePagerActive(slider.active.index);
			// // check for direction control update
			if(slider.settings.controls) updateDirectionControls();
			// if slider is set to mode: "fade"
			if(slider.settings.mode == 'fade'){
				// if adaptiveHeight is true and next height is different from current height, animate to the new height
				if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
					slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
				}
				// fade out the visible child and reset its z-index value
				slider.children.filter(':visible').fadeOut(slider.settings.speed).css({zIndex: 0});
				// fade in the newly requested slide
				slider.children.eq(slider.active.index).css('zIndex', 51).fadeIn(slider.settings.speed, function(){
					$(this).css('zIndex', 50);
					updateAfterSlideTransition();
				});
			// slider mode is not "fade"
			}else{
				// if adaptiveHeight is true and next height is different from current height, animate to the new height
				if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
					slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
				}
				var moveBy = 0;
				var position = {left: 0, top: 0};
				// if carousel and not infinite loop
				if(!slider.settings.infiniteLoop && slider.carousel && slider.active.last){
					if(slider.settings.mode == 'horizontal'){
						// get the last child position
						var lastChild = slider.children.eq(slider.children.length - 1);
						position = lastChild.position();
						// calculate the position of the last slide
						moveBy = slider.viewport.width() - lastChild.outerWidth();
					}else{
						// get last showing index position
						var lastShowingIndex = slider.children.length - slider.settings.minSlides;
						position = slider.children.eq(lastShowingIndex).position();
					}
					// horizontal carousel, going previous while on first slide (infiniteLoop mode)
				}else if(slider.carousel && slider.active.last && direction == 'prev'){
					// get the last child position
					var eq = slider.settings.moveSlides == 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
					var lastChild = el.children('.bx-clone').eq(eq);
					position = lastChild.position();
				// if infinite loop and "Next" is clicked on the last slide
				}else if(direction == 'next' && slider.active.index == 0){
					// get the last clone position
					position = el.find('> .bx-clone').eq(slider.settings.maxSlides).position();
					slider.active.last = false;
				// normal non-zero requests
				}else if(slideIndex >= 0){
					var requestEl = slideIndex * getMoveBy();
					position = slider.children.eq(requestEl).position();
				}

				/* If the position doesn't exist
				 * (e.g. if you destroy the slider on a next click),
				 * it doesn't throw an error.
				 */
				if ("undefined" !== typeof(position)) {
					var value = slider.settings.mode == 'horizontal' ? -(position.left - moveBy) : -position.top;
					// plugin values to be animated
					setPositionProperty(value, 'slide', slider.settings.speed);
				}
			}
		}

		/**
		 * Transitions to the next slide in the show
		 */
		el.goToNextSlide = function(){
			// if infiniteLoop is false and last page is showing, disregard call
			if (!slider.settings.infiniteLoop && slider.active.last) return;
			var pagerIndex = parseInt(slider.active.index) + 1;
			el.goToSlide(pagerIndex, 'next');
		}

		/**
		 * Transitions to the prev slide in the show
		 */
		el.goToPrevSlide = function(){
			// if infiniteLoop is false and last page is showing, disregard call
			if (!slider.settings.infiniteLoop && slider.active.index == 0) return;
			var pagerIndex = parseInt(slider.active.index) - 1;
			el.goToSlide(pagerIndex, 'prev');
		}

		/**
		 * Starts the auto show
		 *
		 * @param preventControlUpdate (boolean)
		 *  - if true, auto controls state will not be updated
		 */
		el.startAuto = function(preventControlUpdate){
			// if an interval already exists, disregard call
			if(slider.interval) return;
			// create an interval
			slider.interval = setInterval(function(){
				slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
			}, slider.settings.pause);
			// if auto controls are displayed and preventControlUpdate is not true
			if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
		}

		/**
		 * Stops the auto show
		 *
		 * @param preventControlUpdate (boolean)
		 *  - if true, auto controls state will not be updated
		 */
		el.stopAuto = function(preventControlUpdate){
			// if no interval exists, disregard call
			if(!slider.interval) return;
			// clear the interval
			clearInterval(slider.interval);
			slider.interval = null;
			// if auto controls are displayed and preventControlUpdate is not true
			if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
		}

		/**
		 * Returns current slide index (zero-based)
		 */
		el.getCurrentSlide = function(){
			return slider.active.index;
		}

		/**
		 * Returns number of slides in show
		 */
		el.getSlideCount = function(){
			return slider.children.length;
		}

		/**
		 * Update all dynamic slider elements
		 */
		el.redrawSlider = function(){
			// resize all children in ratio to new screen size
			slider.children.add(el.find('.bx-clone')).outerWidth(getSlideWidth());
			// adjust the height
			slider.viewport.css('height', getViewportHeight());
			// update the slide position
			if(!slider.settings.ticker) setSlidePosition();
			// if active.last was true before the screen resize, we want
			// to keep it last no matter what screen size we end on
			if (slider.active.last) slider.active.index = getPagerQty() - 1;
			// if the active index (page) no longer exists due to the resize, simply set the index as last
			if (slider.active.index >= getPagerQty()) slider.active.last = true;
			// if a pager is being displayed and a custom pager is not being used, update it
			if(slider.settings.pager && !slider.settings.pagerCustom){
				populatePager();
				updatePagerActive(slider.active.index);
			}
		}

		/**
		 * Destroy the current instance of the slider (revert everything back to original state)
		 */
		el.destroySlider = function(){
			// don't do anything if slider has already been destroyed
			if(!slider.initialized) return;
			slider.initialized = false;
			$('.bx-clone', this).remove();
			slider.children.each(function() {
				$(this).data("origStyle") != undefined ? $(this).attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
			});
			$(this).data("origStyle") != undefined ? this.attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
			$(this).unwrap().unwrap();
			if(slider.controls.el) slider.controls.el.remove();
			if(slider.controls.next) slider.controls.next.remove();
			if(slider.controls.prev) slider.controls.prev.remove();
			if(slider.pagerEl) slider.pagerEl.remove();
			$('.bx-caption', this).remove();
			if(slider.controls.autoEl) slider.controls.autoEl.remove();
			clearInterval(slider.interval);
			if(slider.settings.responsive) $(window).unbind('resize', resizeWindow);
		}

		/**
		 * Reload the slider (revert all DOM changes, and re-initialize)
		 */
		el.reloadSlider = function(settings){
			if (settings != undefined) options = settings;
			el.destroySlider();
			init();
		}

		init();

		// returns the current jQuery object
		return this;
	}

})(jQuery);


(function(d){d.fn.touchSlider=function(a){a.supportsCssTransitions=function(a){for(var c=["Webkit","Moz","Ms"],d=0,g=c.length;d<g;d++)if("undefined"!==typeof a[c[d]+"Transition"])return!0;return!1}(document.createElement("div").style);a=jQuery.extend({roll:!0,flexible:!1,btn_prev:null,btn_next:null,paging:null,speed:75,view:1,range:0.15,page:1,transition:!1,initComplete:null,counter:null},a);var c=[],c=d.extend({},d.fn.touchSlider.defaults,a);return this.each(function(){var a=this;d.fn.extend(this,
l);this.opts=c;this.init();d(window).bind("orientationchange resize",function(){a.resize(a)})})};var l={init:function(){var a=this;this._view=this.opts.view;this._speed=this.opts.speed;this._tg=d(this);this._list=this._tg.children().children();this._width=parseInt(this._tg.css("width"));this._item_w=parseInt(this._list.css("width"));this._len=this._list.length;this._range=this.opts.range*this._width;this._pos=[];this._start=[];this._top=this._left=this._startY=this._startX=0;this._scroll=this._drag=
!1;this._btn_prev;this._btn_next;d(this).unbind("touchstart",this.touchstart).unbind("touchmove",this.touchmove).unbind("touchend",this.touchend).unbind("dragstart",this.touchstart).unbind("drag",this.touchmove).unbind("dragend",this.touchend).bind("touchstart",this.touchstart).bind("touchmove",this.touchmove).bind("touchend",this.touchend).bind("dragstart",this.touchstart).bind("drag",this.touchmove).bind("dragend",this.touchend);d(this).children().css({width:this._width+"px",overflow:"visible"});
this.opts.flexible&&(this._item_w=this._width/this._view);this.opts.roll&&(this._len=Math.ceil(this._len/this._view)*this._view);for(var c=1<this.opts.page&&this.opts.page<=this._len?(this.opts.page-1)*this._item_w:0,b=0;b<this._len;++b)this._pos[b]=this._item_w*b-c,this._start[b]=this._pos[b],this._list.eq(b).css({"float":"none",display:"block",position:"absolute",top:"0",left:this._pos[b]+"px",width:this._item_w+"px"}),this.opts.supportsCssTransitions&&this.opts.transition&&this._list.eq(b).css({"-moz-transition":"0ms",
"-moz-transform":"","-ms-transition":"0ms","-ms-transform":"","-webkit-transition":"0ms","-webkit-transform":"",transition:"0ms",transform:""});this.opts.btn_prev&&this.opts.btn_next&&(this.opts.btn_prev.unbind("click").bind("click",function(){a.animate(1,!0);return!1}),this.opts.btn_next.unbind("click").bind("click",function(){a.animate(-1,!0);return!1}));this.opts.paging&&(d(this._list).each(function(b,c){var d=a.opts.paging.eq(0).clone();a.opts.paging.before(d);d.bind("click",function(c){a.go_page(b,
c);return!1})}),this.opts.paging.remove());this.initComplete();this.counter()},initComplete:function(){"function"==typeof this.opts.initComplete&&this.opts.initComplete(this)},resize:function(a){if(a.opts.flexible){var c=a._item_w;a._width=parseInt(a._tg.css("width"));a._item_w=a._width/a._view;a._range=a.opts.range*a._width;for(var b=0;b<a._len;++b)a._pos[b]=a._pos[b]/c*a._item_w,a._start[b]=a._start[b]/c*a._item_w,a._list.eq(b).css({left:a._pos[b]+"px",width:a._item_w+"px"}),this.opts.supportsCssTransitions&&
this.opts.transition&&a._list.eq(b).css({"-moz-transition":"0ms","-moz-transform":"","-ms-transition":"0ms","-ms-transform":"","-webkit-transition":"0ms","-webkit-transform":"",transition:"0ms",transform:""})}this.counter()},touchstart:function(a){if("touchstart"==a.type&&1>=a.originalEvent.touches.length||"dragstart"==a.type)for(this._startX=a.pageX||a.originalEvent.touches[0].pageX,this._startY=a.pageY||a.originalEvent.touches[0].pageY,this._scroll=!1,this._start=[],a=0;a<this._len;++a)this._start[a]=
this._pos[a]},touchmove:function(a){if("touchmove"==a.type&&1>=a.originalEvent.touches.length||"drag"==a.type)for(this._left=(a.pageX||a.originalEvent.touches[0].pageX)-this._startX,this._top=(a.pageY||a.originalEvent.touches[0].pageY)-this._startY,(0>this._left?-1*this._left:this._left)<(0>this._top?-1*this._top:this._top)||this._scroll?(this._left=0,this._drag=!1,this._scroll=!0):(-1<navigator.userAgent.indexOf("android 4.1")?a.stopPropagation():a.preventDefault(),this._drag=!0,this._scroll=!1,
this.position(a)),a=0;a<this._len;++a){var c=this._start[a]+this._left;if(this.opts.supportsCssTransitions&&this.opts.transition){var b="translate3d("+c+"px,0,0)";this._list.eq(a).css({left:"","-moz-transition":"0ms","-moz-transform":b,"-ms-transition":"0ms","-ms-transform":b,"-webkit-transition":"0ms","-webkit-transform":b,transition:"0ms",transform:b})}else this._list.eq(a).css("left",c+"px");this._pos[a]=c}},touchend:function(a){if("touchend"==a.type&&1>=a.originalEvent.touches.length||"dragend"==
a.type){if(this._scroll)return this._scroll=this._drag=!1;this.animate(this.direction());this._drag=!1;this._scroll=!0}},position:function(a){var c=this._view*this._item_w;if(-1==a||1==a){this._startX=0;this._start=[];for(var b=0;b<this._len;++b)this._start[b]=this._pos[b];this._left=a*c}else this._left>c&&(this._left=c),this._left<-c&&(this._left=-c);if(this.opts.roll){for(var e=[],b=0;b<this._len;++b)e[b]=this._pos[b];e.sort(function(a,b){return a-b});var b=e[this._len-this._view],f=d.inArray(e[0],
this._pos),g=d.inArray(b,this._pos);1>=this._view&&(b=this._len-1);if(1==a&&0<=e[0]||this._drag&&0<e[0])for(b=0;b<this._view;++b,++f,++g)this._start[g]=this._start[f]-c,this._list.eq(g).css("left",this._start[g]+"px");else if(-1==a&&0>=e[b]||this._drag&&0>=e[b])for(b=0;b<this._view;++b,++f,++g)this._start[f]=this._start[g]+c,this._list.eq(f).css("left",this._start[f]+"px")}else this.limit_chk()&&(this._left/=2)},animate:function(a,c){if(this._drag||!this._scroll||c){var b=this,e=this._speed;c&&this.position(a);
var f=a*this._item_w*this._view;if(0==this._left||!this.opts.roll&&this.limit_chk())f=0;this._list.each(function(a,l){b._pos[a]=b._start[a]+f;if(b.opts.supportsCssTransitions&&b.opts.transition){var h=e+"ms",k="translate3d("+b._pos[a]+"px,0,0)";c&&(h="0ms");d(this).css({left:"","-moz-transition":h,"-moz-transform":k,"-ms-transition":h,"-ms-transform":k,"-webkit-transition":h,"-webkit-transform":k,transition:h,transform:k})}else d(this).animate({left:b._pos[a]+"px"},e)});this.counter()}},direction:function(){var a=
0;this._left<-this._range?a=-1:this._left>this._range&&(a=1);if(!this._drag||this._scroll)a=0;return a},limit_chk:function(){var a=parseInt((this._len-1)/this._view)*this._view;return 0==this._start[0]&&0<this._left||0==this._start[a]&&0>this._left},go_page:function(a,c){for(var b=d.inArray(0,this._pos)/this._view+1-(a+1);0!=b;)0>b?(this.animate(-1,!0),b++):0<b&&(this.animate(1,!0),b--)},get_page:function(){return{total:Math.ceil(this._len/this._view),current:d.inArray(0,this._pos)/this._view+1}},
counter:function(){0>d.inArray(0,this._pos)&&this.init();this.opts.page=this.get_page().current;"function"==typeof this.opts.counter&&this.opts.counter(this.get_page())}}})(jQuery);