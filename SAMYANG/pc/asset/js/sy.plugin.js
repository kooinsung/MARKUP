/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ('onwheel' in document || document.documentMode >= 9) ?
            ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function (elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function (elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function (fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            offsetX = 0,
            offsetY = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ('detail' in orgEvent) {
            deltaY = orgEvent.detail * -1;
        }
        if ('wheelDelta' in orgEvent) {
            deltaY = orgEvent.wheelDelta;
        }
        if ('wheelDeltaY' in orgEvent) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if ('wheelDeltaX' in orgEvent) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ('deltaY' in orgEvent) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in orgEvent) {
            deltaX = orgEvent.deltaX;
            if (deltaY === 0) {
                delta = deltaX * -1;
            }
        }

        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) {
            return;
        }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if (orgEvent.deltaMode === 1) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if (orgEvent.deltaMode === 2) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if (special.settings.normalizeOffset && this.getBoundingClientRect) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) {
            clearTimeout(nullLowestDeltaTimeout);
        }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));


/*
	 _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!function (i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery)
}(function (i) {
    "use strict";
    var e = window.Slick || {};
    (e = function () {
        var e = 0;
        return function (t, o) {
            var s, n = this;
            n.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: i(t),
                appendDots: i(t),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function (e, t) {
                    return i('<button type="button" />').text(t + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, n.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = i(t), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, s = i(t).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = e++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0)
        }
    }()).prototype.activateADA = function () {
        this.$slideTrack.find(".slick-active").attr({"aria-hidden": "false"}).find("a, input, button, select").attr({tabindex: "0"})
    }, e.prototype.addSlide = e.prototype.slickAdd = function (e, t, o) {
        var s = this;
        if ("boolean" == typeof t) o = t, t = null; else if (t < 0 || t >= s.slideCount) return !1;
        s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e)
        }), s.$slidesCache = s.$slides, s.reinit()
    }, e.prototype.animateHeight = function () {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.animate({height: e}, i.options.speed)
        }
    }, e.prototype.animateSlide = function (e, t) {
        var o = {}, s = this;
        s.animateHeight(), !0 === s.options.rtl && !1 === s.options.vertical && (e = -e), !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({left: e}, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({top: e}, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), i({animStart: s.currentLeft}).animate({animStart: e}, {
            duration: s.options.speed,
            easing: s.options.easing,
            step: function (i) {
                i = Math.ceil(i), !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o))
            },
            complete: function () {
                t && t.call()
            }
        })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(o), t && setTimeout(function () {
            s.disableTransition(), t.call()
        }, s.options.speed))
    }, e.prototype.getNavTarget = function () {
        var e = this, t = e.options.asNavFor;
        return t && null !== t && (t = i(t).not(e.$slider)), t
    }, e.prototype.asNavFor = function (e) {
        var t = this.getNavTarget();
        null !== t && "object" == typeof t && t.each(function () {
            var t = i(this).slick("getSlick");
            t.unslicked || t.slideHandler(e, !0)
        })
    }, e.prototype.applyTransition = function (i) {
        var e = this, t = {};
        !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }, e.prototype.autoPlay = function () {
        var i = this;
        i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed))
    }, e.prototype.autoPlayClear = function () {
        var i = this;
        i.autoPlayTimer && clearInterval(i.autoPlayTimer)
    }, e.prototype.autoPlayIterator = function () {
        var i = this, e = i.currentSlide + i.options.slidesToScroll;
        i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e))
    }, e.prototype.buildArrows = function () {
        var e = this;
        !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }, e.prototype.buildDots = function () {
        var e, t, o = this;
        if (!0 === o.options.dots) {
            for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), e = 0; e <= o.getDotCount(); e += 1) t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
            o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active")
        }
    }, e.prototype.buildOut = function () {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "")
        }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable")
    }, e.prototype.buildRows = function () {
        var i, e, t, o, s, n, r, l = this;
        if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 1) {
            for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
                var d = document.createElement("div");
                for (e = 0; e < l.options.rows; e++) {
                    var a = document.createElement("div");
                    for (t = 0; t < l.options.slidesPerRow; t++) {
                        var c = i * r + (e * l.options.slidesPerRow + t);
                        n.get(c) && a.appendChild(n.get(c))
                    }
                    d.appendChild(a)
                }
                o.appendChild(d)
            }
            l.$slider.empty().append(o), l.$slider.children().children().children().css({
                width: 100 / l.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }, e.prototype.checkResponsive = function (e, t) {
        var o, s, n, r = this, l = !1, d = r.$slider.width(), a = window.innerWidth || i(window).width();
        if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
            s = null;
            for (o in r.breakpoints) r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
            null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e), l = s), e || !1 === l || r.$slider.trigger("breakpoint", [r, l])
        }
    }, e.prototype.changeSlide = function (e, t) {
        var o, s, n, r = this, l = i(e.currentTarget);
        switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll != 0, o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
            case"previous":
                s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
                break;
            case"next":
                s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
                break;
            case"index":
                var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
                r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
                break;
            default:
                return
        }
    }, e.prototype.checkNavigable = function (i) {
        var e, t;
        if (e = this.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1]; else for (var o in e) {
            if (i < e[o]) {
                i = t;
                break
            }
            t = e[o]
        }
        return i
    }, e.prototype.cleanUpEvents = function () {
        var e = this;
        e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler), i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
    }, e.prototype.cleanUpSlideEvents = function () {
        var e = this;
        e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }, e.prototype.cleanUpRows = function () {
        var i, e = this;
        e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"), e.$slider.empty().append(i))
    }, e.prototype.clickHandler = function (i) {
        !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault())
    }, e.prototype.destroy = function (e) {
        var t = this;
        t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
            i(this).attr("style", i(this).data("originalStyling"))
        }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t])
    }, e.prototype.disableTransition = function (i) {
        var e = this, t = {};
        t[e.transitionType] = "", !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }, e.prototype.fadeSlide = function (i, e) {
        var t = this;
        !1 === t.cssTransitions ? (t.$slides.eq(i).css({zIndex: t.options.zIndex}), t.$slides.eq(i).animate({opacity: 1}, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
            opacity: 1,
            zIndex: t.options.zIndex
        }), e && setTimeout(function () {
            t.disableTransition(i), e.call()
        }, t.options.speed))
    }, e.prototype.fadeSlideOut = function (i) {
        var e = this;
        !1 === e.cssTransitions ? e.$slides.eq(i).animate({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }))
    }, e.prototype.filterSlides = e.prototype.slickFilter = function (i) {
        var e = this;
        null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit())
    }, e.prototype.focusHandler = function () {
        var e = this;
        e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function (t) {
            t.stopImmediatePropagation();
            var o = i(this);
            setTimeout(function () {
                e.options.pauseOnFocus && (e.focussed = o.is(":focus"), e.autoPlay())
            }, 0)
        })
    }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function () {
        return this.currentSlide
    }, e.prototype.getDotCount = function () {
        var i = this, e = 0, t = 0, o = 0;
        if (!0 === i.options.infinite) if (i.slideCount <= i.options.slidesToShow) ++o; else for (; e < i.slideCount;) ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else if (!0 === i.options.centerMode) o = i.slideCount; else if (i.options.asNavFor) for (; e < i.slideCount;) ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow; else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
        return o - 1
    }, e.prototype.getLeft = function (i) {
        var e, t, o, s, n = this, r = 0;
        return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, e += (n.$list.width() - o.outerWidth()) / 2)), e
    }, e.prototype.getOption = e.prototype.slickGetOption = function (i) {
        return this.options[i]
    }, e.prototype.getNavigableIndexes = function () {
        var i, e = this, t = 0, o = 0, s = [];
        for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i;) s.push(t), t = o + e.options.slidesToScroll, o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s
    }, e.prototype.getSlick = function () {
        return this
    }, e.prototype.getSlideCount = function () {
        var e, t, o = this;
        return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
            if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) return e = n, !1
        }), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
    }, e.prototype.goTo = e.prototype.slickGoTo = function (i, e) {
        this.changeSlide({data: {message: "index", index: parseInt(i)}}, e)
    }, e.prototype.init = function (e) {
        var t = this;
        i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay())
    }, e.prototype.initADA = function () {
        var e = this, t = Math.ceil(e.slideCount / e.options.slidesToShow),
            o = e.getNavigableIndexes().filter(function (i) {
                return i >= 0 && i < e.slideCount
            });
        e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({tabindex: "-1"}), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (t) {
            var s = o.indexOf(t);
            i(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + t,
                tabindex: -1
            }), -1 !== s && i(this).attr({"aria-describedby": "slick-slide-control" + e.instanceUid + s})
        }), e.$dots.attr("role", "tablist").find("li").each(function (s) {
            var n = o[s];
            i(this).attr({role: "presentation"}), i(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + e.instanceUid + s,
                "aria-controls": "slick-slide" + e.instanceUid + n,
                "aria-label": s + 1 + " of " + t,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(e.currentSlide).find("button").attr({"aria-selected": "true", tabindex: "0"}).end());
        for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) e.$slides.eq(s).attr("tabindex", 0);
        e.activateADA()
    }, e.prototype.initArrowEvents = function () {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {message: "previous"}, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {message: "next"}, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), i.$nextArrow.on("keydown.slick", i.keyHandler)))
    }, e.prototype.initDotEvents = function () {
        var e = this;
        !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {message: "index"}, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }, e.prototype.initSlideEvents = function () {
        var e = this;
        e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)))
    }, e.prototype.initializeEvents = function () {
        var e = this;
        e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {action: "start"}, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {action: "move"}, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {action: "end"}, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {action: "end"}, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition)
    }, e.prototype.initUI = function () {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), i.$nextArrow.show()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show()
    }, e.prototype.keyHandler = function (i) {
        var e = this;
        i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({data: {message: !0 === e.options.rtl ? "next" : "previous"}}) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({data: {message: !0 === e.options.rtl ? "previous" : "next"}}))
    }, e.prototype.lazyLoad = function () {
        function e(e) {
            i("img[data-lazy]", e).each(function () {
                var e = i(this), t = i(this).attr("data-lazy"), o = i(this).attr("data-srcset"),
                    s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"), r = document.createElement("img");
                r.onload = function () {
                    e.animate({opacity: 0}, 100, function () {
                        o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({opacity: 1}, 200, function () {
                            e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }), n.$slider.trigger("lazyLoaded", [n, e, t])
                    })
                }, r.onerror = function () {
                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), n.$slider.trigger("lazyLoadError", [n, e, t])
                }, r.src = t
            })
        }

        var t, o, s, n = this;
        if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad) for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++) r < 0 && (r = n.slideCount - 1), t = (t = t.add(d.eq(r))).add(d.eq(l)), r--, l++;
        e(t), n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow))
    }, e.prototype.loadSlider = function () {
        var i = this;
        i.setPosition(), i.$slideTrack.css({opacity: 1}), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad()
    }, e.prototype.next = e.prototype.slickNext = function () {
        this.changeSlide({data: {message: "next"}})
    }, e.prototype.orientationChange = function () {
        var i = this;
        i.checkResponsive(), i.setPosition()
    }, e.prototype.pause = e.prototype.slickPause = function () {
        var i = this;
        i.autoPlayClear(), i.paused = !0
    }, e.prototype.play = e.prototype.slickPlay = function () {
        var i = this;
        i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1
    }, e.prototype.postSlide = function (e) {
        var t = this;
        t.unslicked || (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()))
    }, e.prototype.prev = e.prototype.slickPrev = function () {
        this.changeSlide({data: {message: "previous"}})
    }, e.prototype.preventDefault = function (i) {
        i.preventDefault()
    }, e.prototype.progressiveLazyLoad = function (e) {
        e = e || 1;
        var t, o, s, n, r, l = this, d = i("img[data-lazy]", l.$slider);
        d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), (r = document.createElement("img")).onload = function () {
            s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === l.options.adaptiveHeight && l.setPosition(), l.$slider.trigger("lazyLoaded", [l, t, o]), l.progressiveLazyLoad()
        }, r.onerror = function () {
            e < 3 ? setTimeout(function () {
                l.progressiveLazyLoad(e + 1)
            }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad())
        }, r.src = o) : l.$slider.trigger("allImagesLoaded", [l])
    }, e.prototype.refresh = function (e) {
        var t, o, s = this;
        o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, s.destroy(!0), i.extend(s, s.initials, {currentSlide: t}), s.init(), e || s.changeSlide({
            data: {
                message: "index",
                index: t
            }
        }, !1)
    }, e.prototype.registerBreakpoints = function () {
        var e, t, o, s = this, n = s.options.responsive || null;
        if ("array" === i.type(n) && n.length) {
            s.respondTo = s.options.respondTo || "window";
            for (e in n) if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
                for (t = n[e].breakpoint; o >= 0;) s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), o--;
                s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings
            }
            s.breakpoints.sort(function (i, e) {
                return s.options.mobileFirst ? i - e : e - i
            })
        }
    }, e.prototype.reinit = function () {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
    }, e.prototype.resize = function () {
        var e = this;
        i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function () {
            e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
        }, 50))
    }, e.prototype.removeSlide = e.prototype.slickRemove = function (i, e, t) {
        var o = this;
        if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i, o.slideCount < 1 || i < 0 || i > o.slideCount - 1) return !1;
        o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit()
    }, e.prototype.setCSS = function (i) {
        var e, t, o = this, s = {};
        !0 === o.options.rtl && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", o.$slideTrack.css(s)))
    }, e.prototype.setDimensions = function () {
        var i = this;
        !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({padding: "0px " + i.options.centerPadding}) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), !0 === i.options.centerMode && i.$list.css({padding: i.options.centerPadding + " 0px"})), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
        var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
        !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e)
    }, e.prototype.setFade = function () {
        var e, t = this;
        t.$slides.each(function (o, s) {
            e = t.slideWidth * o * -1, !0 === t.options.rtl ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            }) : i(s).css({position: "relative", left: e, top: 0, zIndex: t.options.zIndex - 2, opacity: 0})
        }), t.$slides.eq(t.currentSlide).css({zIndex: t.options.zIndex - 1, opacity: 1})
    }, e.prototype.setHeight = function () {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.css("height", e)
        }
    }, e.prototype.setOption = e.prototype.slickSetOption = function () {
        var e, t, o, s, n, r = this, l = !1;
        if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), "single" === n) r.options[o] = s; else if ("multiple" === n) i.each(o, function (i, e) {
            r.options[i] = e
        }); else if ("responsive" === n) for (t in s) if ("array" !== i.type(r.options.responsive)) r.options.responsive = [s[t]]; else {
            for (e = r.options.responsive.length - 1; e >= 0;) r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), e--;
            r.options.responsive.push(s[t])
        }
        l && (r.unload(), r.reinit())
    }, e.prototype.setPosition = function () {
        var i = this;
        i.setDimensions(), i.setHeight(), !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), i.$slider.trigger("setPosition", [i])
    }, e.prototype.setProps = function () {
        var i = this, e = document.body.style;
        i.positionProp = !0 === i.options.vertical ? "top" : "left", "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0), i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType
    }, e.prototype.setSlideClasses = function (i) {
        var e, t, o, s, n = this;
        if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode) {
            var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
            e = Math.floor(n.options.slidesToShow / 2), !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), n.$slides.eq(i).addClass("slick-center")
        } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
    }, e.prototype.setupInfinite = function () {
        var e, t, o, s = this;
        if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, s.slideCount > s.options.slidesToShow)) {
            for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - o; e -= 1) t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
            for (e = 0; e < o + s.slideCount; e += 1) t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
            s.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
                i(this).attr("id", "")
            })
        }
    }, e.prototype.interrupt = function (i) {
        var e = this;
        i || e.autoPlay(), e.interrupted = i
    }, e.prototype.selectHandler = function (e) {
        var t = this, o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"),
            s = parseInt(o.attr("data-slick-index"));
        s || (s = 0), t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s)
    }, e.prototype.slideHandler = function (i, e, t) {
        var o, s, n, r, l, d = null, a = this;
        if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i)) if (!1 === e && a.asNavFor(i), o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
            a.postSlide(o)
        }) : a.postSlide(o)); else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
            a.postSlide(o)
        }) : a.postSlide(o)); else {
            if (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, s]), n = a.currentSlide, a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide), a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== t ? (a.fadeSlideOut(n), a.fadeSlide(s, function () {
                a.postSlide(s)
            })) : a.postSlide(s), void a.animateHeight();
            !0 !== t ? a.animateSlide(d, function () {
                a.postSlide(s)
            }) : a.postSlide(s)
        }
    }, e.prototype.startLoad = function () {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), i.$nextArrow.hide()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(), i.$slider.addClass("slick-loading")
    }, e.prototype.swipeDirection = function () {
        var i, e, t, o, s = this;
        return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
    }, e.prototype.swipeEnd = function (i) {
        var e, t, o = this;
        if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
        if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;
        if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe) {
            switch (t = o.swipeDirection()) {
                case"left":
                case"down":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), o.currentDirection = 0;
                    break;
                case"right":
                case"up":
                    e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), o.currentDirection = 1
            }
            "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [o, t]))
        } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {})
    }, e.prototype.swipeHandler = function (i) {
        var e = this;
        if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), i.data.action) {
            case"start":
                e.swipeStart(i);
                break;
            case"move":
                e.swipeMove(i);
                break;
            case"end":
                e.swipeEnd(i)
        }
    }, e.prototype.swipeMove = function (i) {
        var e, t, o, s, n, r, l = this;
        return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, !1) : void l.setCSS(l.swipeLeft))))
    }, e.prototype.swipeStart = function (i) {
        var e, t = this;
        if (t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) return t.touchObject = {}, !1;
        void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, t.dragging = !0
    }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function () {
        var i = this;
        null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.appendTo(i.$slideTrack), i.reinit())
    }, e.prototype.unload = function () {
        var e = this;
        i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, e.prototype.unslick = function (i) {
        var e = this;
        e.$slider.trigger("unslick", [e, i]), e.destroy()
    }, e.prototype.updateArrows = function () {
        var i = this;
        Math.floor(i.options.slidesToShow / 2), !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, e.prototype.updateDots = function () {
        var i = this;
        null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"))
    }, e.prototype.visibility = function () {
        var i = this;
        i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1)
    }, i.fn.slick = function () {
        var i, t, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = o.length;
        for (i = 0; i < r; i++) if ("object" == typeof s || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), void 0 !== t) return t;
        return o
    }
});


/*!
 * Cropper.js v1.3.4
 * https://github.com/fengyuanchen/cropperjs
 *
 * Copyright (c) 2015-2018 Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2018-03-31T06:49:16.394Z
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.Cropper = factory());
}(this, (function () {
    'use strict';

    var IN_BROWSER = typeof window !== 'undefined';
    var WINDOW = IN_BROWSER ? window : {};
    var NAMESPACE = 'cropper';

    // Actions
    var ACTION_ALL = 'all';
    var ACTION_CROP = 'crop';
    var ACTION_MOVE = 'move';
    var ACTION_ZOOM = 'zoom';
    var ACTION_EAST = 'e';
    var ACTION_WEST = 'w';
    var ACTION_SOUTH = 's';
    var ACTION_NORTH = 'n';
    var ACTION_NORTH_EAST = 'ne';
    var ACTION_NORTH_WEST = 'nw';
    var ACTION_SOUTH_EAST = 'se';
    var ACTION_SOUTH_WEST = 'sw';

    // Classes
    var CLASS_CROP = NAMESPACE + '-crop';
    var CLASS_DISABLED = NAMESPACE + '-disabled';
    var CLASS_HIDDEN = NAMESPACE + '-hidden';
    var CLASS_HIDE = NAMESPACE + '-hide';
    var CLASS_INVISIBLE = NAMESPACE + '-invisible';
    var CLASS_MODAL = NAMESPACE + '-modal';
    var CLASS_MOVE = NAMESPACE + '-move';

    // Data keys
    var DATA_ACTION = 'action';
    var DATA_PREVIEW = 'preview';

    // Drag modes
    var DRAG_MODE_CROP = 'crop';
    var DRAG_MODE_MOVE = 'move';
    var DRAG_MODE_NONE = 'none';

    // Events
    var EVENT_CROP = 'crop';
    var EVENT_CROP_END = 'cropend';
    var EVENT_CROP_MOVE = 'cropmove';
    var EVENT_CROP_START = 'cropstart';
    var EVENT_DBLCLICK = 'dblclick';
    var EVENT_LOAD = 'load';
    var EVENT_POINTER_DOWN = WINDOW.PointerEvent ? 'pointerdown' : 'touchstart mousedown';
    var EVENT_POINTER_MOVE = WINDOW.PointerEvent ? 'pointermove' : 'touchmove mousemove';
    var EVENT_POINTER_UP = WINDOW.PointerEvent ? 'pointerup pointercancel' : 'touchend touchcancel mouseup';
    var EVENT_READY = 'ready';
    var EVENT_RESIZE = 'resize';
    var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
    var EVENT_ZOOM = 'zoom';

    // RegExps
    var REGEXP_ACTIONS = /^(?:e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/;
    var REGEXP_DATA_URL = /^data:/;
    var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
    var REGEXP_TAG_NAME = /^(?:img|canvas)$/i;

    var DEFAULTS = {
        // Define the view mode of the cropper
        viewMode: 0, // 0, 1, 2, 3

        // Define the dragging mode of the cropper
        dragMode: DRAG_MODE_CROP, // 'crop', 'move' or 'none'

        // Define the aspect ratio of the crop box
        aspectRatio: NaN,

        // An object with the previous cropping result data
        data: null,

        // A selector for adding extra containers to preview
        preview: '',

        // Re-render the cropper when resize the window
        responsive: true,

        // Restore the cropped area after resize the window
        restore: true,

        // Check if the current image is a cross-origin image
        checkCrossOrigin: true,

        // Check the current image's Exif Orientation information
        checkOrientation: true,

        // Show the black modal
        modal: true,

        // Show the dashed lines for guiding
        guides: true,

        // Show the center indicator for guiding
        center: true,

        // Show the white modal to highlight the crop box
        highlight: true,

        // Show the grid background
        background: true,

        // Enable to crop the image automatically when initialize
        autoCrop: true,

        // Define the percentage of automatic cropping area when initializes
        autoCropArea: 0.8,

        // Enable to move the image
        movable: true,

        // Enable to rotate the image
        rotatable: true,

        // Enable to scale the image
        scalable: true,

        // Enable to zoom the image
        zoomable: true,

        // Enable to zoom the image by dragging touch
        zoomOnTouch: true,

        // Enable to zoom the image by wheeling mouse
        zoomOnWheel: true,

        // Define zoom ratio when zoom the image by wheeling mouse
        wheelZoomRatio: 0.1,

        // Enable to move the crop box
        cropBoxMovable: true,

        // Enable to resize the crop box
        cropBoxResizable: true,

        // Toggle drag mode between "crop" and "move" when click twice on the cropper
        toggleDragModeOnDblclick: true,

        // Size limitation
        minCanvasWidth: 0,
        minCanvasHeight: 0,
        minCropBoxWidth: 0,
        minCropBoxHeight: 0,
        minContainerWidth: 200,
        minContainerHeight: 100,

        // Shortcuts of events
        ready: null,
        cropstart: null,
        cropmove: null,
        cropend: null,
        crop: null,
        zoom: null
    };

    var TEMPLATE = '<div class="cropper-container" touch-action="none">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-action="e"></span>' + '<span class="cropper-line line-n" data-action="n"></span>' + '<span class="cropper-line line-w" data-action="w"></span>' + '<span class="cropper-line line-s" data-action="s"></span>' + '<span class="cropper-point point-e" data-action="e"></span>' + '<span class="cropper-point point-n" data-action="n"></span>' + '<span class="cropper-point point-w" data-action="w"></span>' + '<span class="cropper-point point-s" data-action="s"></span>' + '<span class="cropper-point point-ne" data-action="ne"></span>' + '<span class="cropper-point point-nw" data-action="nw"></span>' + '<span class="cropper-point point-sw" data-action="sw"></span>' + '<span class="cropper-point point-se" data-action="se"></span>' + '</div>' + '</div>';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    var createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var toConsumableArray = function (arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

            return arr2;
        } else {
            return Array.from(arr);
        }
    };

    /**
     * Check if the given value is not a number.
     */
    var isNaN = Number.isNaN || WINDOW.isNaN;

    /**
     * Check if the given value is a number.
     * @param {*} value - The value to check.
     * @returns {boolean} Returns `true` if the given value is a number, else `false`.
     */
    function isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    /**
     * Check if the given value is undefined.
     * @param {*} value - The value to check.
     * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
     */
    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    /**
     * Check if the given value is an object.
     * @param {*} value - The value to check.
     * @returns {boolean} Returns `true` if the given value is an object, else `false`.
     */
    function isObject(value) {
        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * Check if the given value is a plain object.
     * @param {*} value - The value to check.
     * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
     */

    function isPlainObject(value) {
        if (!isObject(value)) {
            return false;
        }

        try {
            var _constructor = value.constructor;
            var prototype = _constructor.prototype;


            return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
        } catch (e) {
            return false;
        }
    }

    /**
     * Check if the given value is a function.
     * @param {*} value - The value to check.
     * @returns {boolean} Returns `true` if the given value is a function, else `false`.
     */
    function isFunction(value) {
        return typeof value === 'function';
    }

    /**
     * Iterate the given data.
     * @param {*} data - The data to iterate.
     * @param {Function} callback - The process function for each element.
     * @returns {*} The original data.
     */
    function forEach(data, callback) {
        if (data && isFunction(callback)) {
            if (Array.isArray(data) || isNumber(data.length) /* array-like */) {
                var length = data.length;

                var i = void 0;

                for (i = 0; i < length; i += 1) {
                    if (callback.call(data, data[i], i, data) === false) {
                        break;
                    }
                }
            } else if (isObject(data)) {
                Object.keys(data).forEach(function (key) {
                    callback.call(data, data[key], key, data);
                });
            }
        }

        return data;
    }

    /**
     * Extend the given object.
     * @param {*} obj - The object to be extended.
     * @param {*} args - The rest objects which will be merged to the first object.
     * @returns {Object} The extended object.
     */
    var assign = Object.assign || function assign(obj) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (isObject(obj) && args.length > 0) {
            args.forEach(function (arg) {
                if (isObject(arg)) {
                    Object.keys(arg).forEach(function (key) {
                        obj[key] = arg[key];
                    });
                }
            });
        }

        return obj;
    };

    var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/i;

    /**
     * Normalize decimal number.
     * Check out {@link http://0.30000000000000004.com/}
     * @param {number} value - The value to normalize.
     * @param {number} [times=100000000000] - The times for normalizing.
     * @returns {number} Returns the normalized number.
     */
    function normalizeDecimalNumber(value) {
        var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;

        return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
    }

    var REGEXP_SUFFIX = /^(?:width|height|left|top|marginLeft|marginTop)$/;

    /**
     * Apply styles to the given element.
     * @param {Element} element - The target element.
     * @param {Object} styles - The styles for applying.
     */
    function setStyle(element, styles) {
        var style = element.style;


        forEach(styles, function (value, property) {
            if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
                value += 'px';
            }

            style[property] = value;
        });
    }

    /**
     * Check if the given element has a special class.
     * @param {Element} element - The element to check.
     * @param {string} value - The class to search.
     * @returns {boolean} Returns `true` if the special class was found.
     */
    function hasClass(element, value) {
        return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
    }

    /**
     * Add classes to the given element.
     * @param {Element} element - The target element.
     * @param {string} value - The classes to be added.
     */
    function addClass(element, value) {
        if (!value) {
            return;
        }

        if (isNumber(element.length)) {
            forEach(element, function (elem) {
                addClass(elem, value);
            });
            return;
        }

        if (element.classList) {
            element.classList.add(value);
            return;
        }

        var className = element.className.trim();

        if (!className) {
            element.className = value;
        } else if (className.indexOf(value) < 0) {
            element.className = className + ' ' + value;
        }
    }

    /**
     * Remove classes from the given element.
     * @param {Element} element - The target element.
     * @param {string} value - The classes to be removed.
     */
    function removeClass(element, value) {
        if (!value) {
            return;
        }

        if (isNumber(element.length)) {
            forEach(element, function (elem) {
                removeClass(elem, value);
            });
            return;
        }

        if (element.classList) {
            element.classList.remove(value);
            return;
        }

        if (element.className.indexOf(value) >= 0) {
            element.className = element.className.replace(value, '');
        }
    }

    /**
     * Add or remove classes from the given element.
     * @param {Element} element - The target element.
     * @param {string} value - The classes to be toggled.
     * @param {boolean} added - Add only.
     */
    function toggleClass(element, value, added) {
        if (!value) {
            return;
        }

        if (isNumber(element.length)) {
            forEach(element, function (elem) {
                toggleClass(elem, value, added);
            });
            return;
        }

        // IE10-11 doesn't support the second parameter of `classList.toggle`
        if (added) {
            addClass(element, value);
        } else {
            removeClass(element, value);
        }
    }

    var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;

    /**
     * Transform the given string from camelCase to kebab-case
     * @param {string} value - The value to transform.
     * @returns {string} The transformed value.
     */
    function hyphenate(value) {
        return value.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
    }

    /**
     * Get data from the given element.
     * @param {Element} element - The target element.
     * @param {string} name - The data key to get.
     * @returns {string} The data value.
     */
    function getData(element, name) {
        if (isObject(element[name])) {
            return element[name];
        } else if (element.dataset) {
            return element.dataset[name];
        }

        return element.getAttribute('data-' + hyphenate(name));
    }

    /**
     * Set data to the given element.
     * @param {Element} element - The target element.
     * @param {string} name - The data key to set.
     * @param {string} data - The data value.
     */
    function setData(element, name, data) {
        if (isObject(data)) {
            element[name] = data;
        } else if (element.dataset) {
            element.dataset[name] = data;
        } else {
            element.setAttribute('data-' + hyphenate(name), data);
        }
    }

    /**
     * Remove data from the given element.
     * @param {Element} element - The target element.
     * @param {string} name - The data key to remove.
     */
    function removeData(element, name) {
        if (isObject(element[name])) {
            try {
                delete element[name];
            } catch (e) {
                element[name] = undefined;
            }
        } else if (element.dataset) {
            // #128 Safari not allows to delete dataset property
            try {
                delete element.dataset[name];
            } catch (e) {
                element.dataset[name] = undefined;
            }
        } else {
            element.removeAttribute('data-' + hyphenate(name));
        }
    }

    var REGEXP_SPACES = /\s\s*/;
    var onceSupported = function () {
        var supported = false;

        if (IN_BROWSER) {
            var once = false;
            var listener = function listener() {
            };
            var options = Object.defineProperty({}, 'once', {
                get: function get$$1() {
                    supported = true;
                    return once;
                },


                /**
                 * This setter can fix a `TypeError` in strict mode
                 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
                 * @param {boolean} value - The value to set
                 */
                set: function set$$1(value) {
                    once = value;
                }
            });

            WINDOW.addEventListener('test', listener, options);
            WINDOW.removeEventListener('test', listener, options);
        }

        return supported;
    }();

    /**
     * Remove event listener from the target element.
     * @param {Element} element - The event target.
     * @param {string} type - The event type(s).
     * @param {Function} listener - The event listener.
     * @param {Object} options - The event options.
     */
    function removeListener(element, type, listener) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        var handler = listener;

        type.trim().split(REGEXP_SPACES).forEach(function (event) {
            if (!onceSupported) {
                var listeners = element.listeners;


                if (listeners && listeners[event] && listeners[event][listener]) {
                    handler = listeners[event][listener];
                    delete listeners[event][listener];

                    if (Object.keys(listeners[event]).length === 0) {
                        delete listeners[event];
                    }

                    if (Object.keys(listeners).length === 0) {
                        delete element.listeners;
                    }
                }
            }

            element.removeEventListener(event, handler, options);
        });
    }

    /**
     * Add event listener to the target element.
     * @param {Element} element - The event target.
     * @param {string} type - The event type(s).
     * @param {Function} listener - The event listener.
     * @param {Object} options - The event options.
     */
    function addListener(element, type, listener) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        var _handler = listener;

        type.trim().split(REGEXP_SPACES).forEach(function (event) {
            if (options.once && !onceSupported) {
                var _element$listeners = element.listeners,
                    listeners = _element$listeners === undefined ? {} : _element$listeners;


                _handler = function handler() {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    delete listeners[event][listener];
                    element.removeEventListener(event, _handler, options);
                    listener.apply(element, args);
                };

                if (!listeners[event]) {
                    listeners[event] = {};
                }

                if (listeners[event][listener]) {
                    element.removeEventListener(event, listeners[event][listener], options);
                }

                listeners[event][listener] = _handler;
                element.listeners = listeners;
            }

            element.addEventListener(event, _handler, options);
        });
    }

    /**
     * Dispatch event on the target element.
     * @param {Element} element - The event target.
     * @param {string} type - The event type(s).
     * @param {Object} data - The additional event data.
     * @returns {boolean} Indicate if the event is default prevented or not.
     */
    function dispatchEvent(element, type, data) {
        var event = void 0;

        // Event and CustomEvent on IE9-11 are global objects, not constructors
        if (isFunction(Event) && isFunction(CustomEvent)) {
            event = new CustomEvent(type, {
                detail: data,
                bubbles: true,
                cancelable: true
            });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, true, true, data);
        }

        return element.dispatchEvent(event);
    }

    /**
     * Get the offset base on the document.
     * @param {Element} element - The target element.
     * @returns {Object} The offset data.
     */
    function getOffset(element) {
        var box = element.getBoundingClientRect();

        return {
            left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
            top: box.top + (window.pageYOffset - document.documentElement.clientTop)
        };
    }

    var location = WINDOW.location;

    var REGEXP_ORIGINS = /^(https?:)\/\/([^:/?#]+):?(\d*)/i;

    /**
     * Check if the given URL is a cross origin URL.
     * @param {string} url - The target URL.
     * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
     */
    function isCrossOriginURL(url) {
        var parts = url.match(REGEXP_ORIGINS);

        return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
    }

    /**
     * Add timestamp to the given URL.
     * @param {string} url - The target URL.
     * @returns {string} The result URL.
     */
    function addTimestamp(url) {
        var timestamp = 'timestamp=' + new Date().getTime();

        return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
    }

    /**
     * Get transforms base on the given object.
     * @param {Object} obj - The target object.
     * @returns {string} A string contains transform values.
     */
    function getTransforms(_ref) {
        var rotate = _ref.rotate,
            scaleX = _ref.scaleX,
            scaleY = _ref.scaleY,
            translateX = _ref.translateX,
            translateY = _ref.translateY;

        var values = [];

        if (isNumber(translateX) && translateX !== 0) {
            values.push('translateX(' + translateX + 'px)');
        }

        if (isNumber(translateY) && translateY !== 0) {
            values.push('translateY(' + translateY + 'px)');
        }

        // Rotate should come first before scale to match orientation transform
        if (isNumber(rotate) && rotate !== 0) {
            values.push('rotate(' + rotate + 'deg)');
        }

        if (isNumber(scaleX) && scaleX !== 1) {
            values.push('scaleX(' + scaleX + ')');
        }

        if (isNumber(scaleY) && scaleY !== 1) {
            values.push('scaleY(' + scaleY + ')');
        }

        var transform = values.length ? values.join(' ') : 'none';

        return {
            WebkitTransform: transform,
            msTransform: transform,
            transform: transform
        };
    }

    /**
     * Get the max ratio of a group of pointers.
     * @param {string} pointers - The target pointers.
     * @returns {number} The result ratio.
     */
    function getMaxZoomRatio(pointers) {
        var pointers2 = assign({}, pointers);
        var ratios = [];

        forEach(pointers, function (pointer, pointerId) {
            delete pointers2[pointerId];

            forEach(pointers2, function (pointer2) {
                var x1 = Math.abs(pointer.startX - pointer2.startX);
                var y1 = Math.abs(pointer.startY - pointer2.startY);
                var x2 = Math.abs(pointer.endX - pointer2.endX);
                var y2 = Math.abs(pointer.endY - pointer2.endY);
                var z1 = Math.sqrt(x1 * x1 + y1 * y1);
                var z2 = Math.sqrt(x2 * x2 + y2 * y2);
                var ratio = (z2 - z1) / z1;

                ratios.push(ratio);
            });
        });

        ratios.sort(function (a, b) {
            return Math.abs(a) < Math.abs(b);
        });

        return ratios[0];
    }

    /**
     * Get a pointer from an event object.
     * @param {Object} event - The target event object.
     * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
     * @returns {Object} The result pointer contains start and/or end point coordinates.
     */
    function getPointer(_ref2, endOnly) {
        var pageX = _ref2.pageX,
            pageY = _ref2.pageY;

        var end = {
            endX: pageX,
            endY: pageY
        };

        return endOnly ? end : assign({
            startX: pageX,
            startY: pageY
        }, end);
    }

    /**
     * Get the center point coordinate of a group of pointers.
     * @param {Object} pointers - The target pointers.
     * @returns {Object} The center point coordinate.
     */
    function getPointersCenter(pointers) {
        var pageX = 0;
        var pageY = 0;
        var count = 0;

        forEach(pointers, function (_ref3) {
            var startX = _ref3.startX,
                startY = _ref3.startY;

            pageX += startX;
            pageY += startY;
            count += 1;
        });

        pageX /= count;
        pageY /= count;

        return {
            pageX: pageX,
            pageY: pageY
        };
    }

    /**
     * Check if the given value is a finite number.
     */
    var isFinite = Number.isFinite || WINDOW.isFinite;

    /**
     * Get the max sizes in a rectangle under the given aspect ratio.
     * @param {Object} data - The original sizes.
     * @param {string} [type='contain'] - The adjust type.
     * @returns {Object} The result sizes.
     */
    function getAdjustedSizes(_ref4) // or 'cover'
    {
        var aspectRatio = _ref4.aspectRatio,
            height = _ref4.height,
            width = _ref4.width;
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contain';

        var isValidNumber = function isValidNumber(value) {
            return isFinite(value) && value > 0;
        };

        if (isValidNumber(width) && isValidNumber(height)) {
            var adjustedWidth = height * aspectRatio;

            if (type === 'contain' && adjustedWidth > width || type === 'cover' && adjustedWidth < width) {
                height = width / aspectRatio;
            } else {
                width = height * aspectRatio;
            }
        } else if (isValidNumber(width)) {
            height = width / aspectRatio;
        } else if (isValidNumber(height)) {
            width = height * aspectRatio;
        }

        return {
            width: width,
            height: height
        };
    }

    /**
     * Get the new sizes of a rectangle after rotated.
     * @param {Object} data - The original sizes.
     * @returns {Object} The result sizes.
     */
    function getRotatedSizes(_ref5) {
        var width = _ref5.width,
            height = _ref5.height,
            degree = _ref5.degree;

        degree = Math.abs(degree) % 180;

        if (degree === 90) {
            return {
                width: height,
                height: width
            };
        }

        var arc = degree % 90 * Math.PI / 180;
        var sinArc = Math.sin(arc);
        var cosArc = Math.cos(arc);
        var newWidth = width * cosArc + height * sinArc;
        var newHeight = width * sinArc + height * cosArc;

        return degree > 90 ? {
            width: newHeight,
            height: newWidth
        } : {
            width: newWidth,
            height: newHeight
        };
    }

    /**
     * Get a canvas which drew the given image.
     * @param {HTMLImageElement} image - The image for drawing.
     * @param {Object} imageData - The image data.
     * @param {Object} canvasData - The canvas data.
     * @param {Object} options - The options.
     * @returns {HTMLCanvasElement} The result canvas.
     */
    function getSourceCanvas(image, _ref6, _ref7, _ref8) {
        var imageAspectRatio = _ref6.aspectRatio,
            imageNaturalWidth = _ref6.naturalWidth,
            imageNaturalHeight = _ref6.naturalHeight,
            _ref6$rotate = _ref6.rotate,
            rotate = _ref6$rotate === undefined ? 0 : _ref6$rotate,
            _ref6$scaleX = _ref6.scaleX,
            scaleX = _ref6$scaleX === undefined ? 1 : _ref6$scaleX,
            _ref6$scaleY = _ref6.scaleY,
            scaleY = _ref6$scaleY === undefined ? 1 : _ref6$scaleY;
        var aspectRatio = _ref7.aspectRatio,
            naturalWidth = _ref7.naturalWidth,
            naturalHeight = _ref7.naturalHeight;
        var _ref8$fillColor = _ref8.fillColor,
            fillColor = _ref8$fillColor === undefined ? 'transparent' : _ref8$fillColor,
            _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled,
            imageSmoothingEnabled = _ref8$imageSmoothingE === undefined ? true : _ref8$imageSmoothingE,
            _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality,
            imageSmoothingQuality = _ref8$imageSmoothingQ === undefined ? 'low' : _ref8$imageSmoothingQ,
            _ref8$maxWidth = _ref8.maxWidth,
            maxWidth = _ref8$maxWidth === undefined ? Infinity : _ref8$maxWidth,
            _ref8$maxHeight = _ref8.maxHeight,
            maxHeight = _ref8$maxHeight === undefined ? Infinity : _ref8$maxHeight,
            _ref8$minWidth = _ref8.minWidth,
            minWidth = _ref8$minWidth === undefined ? 0 : _ref8$minWidth,
            _ref8$minHeight = _ref8.minHeight,
            minHeight = _ref8$minHeight === undefined ? 0 : _ref8$minHeight;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var maxSizes = getAdjustedSizes({
            aspectRatio: aspectRatio,
            width: maxWidth,
            height: maxHeight
        });
        var minSizes = getAdjustedSizes({
            aspectRatio: aspectRatio,
            width: minWidth,
            height: minHeight
        }, 'cover');
        var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
        var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight));

        // Note: should always use image's natural sizes for drawing as
        // imageData.naturalWidth === canvasData.naturalHeight when rotate % 180 === 90
        var destMaxSizes = getAdjustedSizes({
            aspectRatio: imageAspectRatio,
            width: maxWidth,
            height: maxHeight
        });
        var destMinSizes = getAdjustedSizes({
            aspectRatio: imageAspectRatio,
            width: minWidth,
            height: minHeight
        }, 'cover');
        var destWidth = Math.min(destMaxSizes.width, Math.max(destMinSizes.width, imageNaturalWidth));
        var destHeight = Math.min(destMaxSizes.height, Math.max(destMinSizes.height, imageNaturalHeight));
        var params = [-destWidth / 2, -destHeight / 2, destWidth, destHeight];

        canvas.width = normalizeDecimalNumber(width);
        canvas.height = normalizeDecimalNumber(height);
        context.fillStyle = fillColor;
        context.fillRect(0, 0, width, height);
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(rotate * Math.PI / 180);
        context.scale(scaleX, scaleY);
        context.imageSmoothingEnabled = imageSmoothingEnabled;
        context.imageSmoothingQuality = imageSmoothingQuality;
        context.drawImage.apply(context, [image].concat(toConsumableArray(params.map(function (param) {
            return Math.floor(normalizeDecimalNumber(param));
        }))));
        context.restore();
        return canvas;
    }

    var fromCharCode = String.fromCharCode;

    /**
     * Get string from char code in data view.
     * @param {DataView} dataView - The data view for read.
     * @param {number} start - The start index.
     * @param {number} length - The read length.
     * @returns {string} The read result.
     */

    function getStringFromCharCode(dataView, start, length) {
        var str = '';
        var i = void 0;

        length += start;

        for (i = start; i < length; i += 1) {
            str += fromCharCode(dataView.getUint8(i));
        }

        return str;
    }

    var REGEXP_DATA_URL_HEAD = /^data:.*,/;

    /**
     * Transform Data URL to array buffer.
     * @param {string} dataURL - The Data URL to transform.
     * @returns {ArrayBuffer} The result array buffer.
     */
    function dataURLToArrayBuffer(dataURL) {
        var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
        var binary = atob(base64);
        var arrayBuffer = new ArrayBuffer(binary.length);
        var uint8 = new Uint8Array(arrayBuffer);

        forEach(uint8, function (value, i) {
            uint8[i] = binary.charCodeAt(i);
        });

        return arrayBuffer;
    }

    /**
     * Transform array buffer to Data URL.
     * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
     * @param {string} mimeType - The mime type of the Data URL.
     * @returns {string} The result Data URL.
     */
    function arrayBufferToDataURL(arrayBuffer, mimeType) {
        var uint8 = new Uint8Array(arrayBuffer);
        var data = '';

        // TypedArray.prototype.forEach is not supported in some browsers.
        forEach(uint8, function (value) {
            data += fromCharCode(value);
        });

        return 'data:' + mimeType + ';base64,' + btoa(data);
    }

    /**
     * Get orientation value from given array buffer.
     * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
     * @returns {number} The read orientation value.
     */
    function getOrientation(arrayBuffer) {
        var dataView = new DataView(arrayBuffer);
        var orientation = void 0;
        var littleEndian = void 0;
        var app1Start = void 0;
        var ifdStart = void 0;

        // Only handle JPEG image (start by 0xFFD8)
        if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
            var length = dataView.byteLength;
            var offset = 2;

            while (offset < length) {
                if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
                    app1Start = offset;
                    break;
                }

                offset += 1;
            }
        }

        if (app1Start) {
            var exifIDCode = app1Start + 4;
            var tiffOffset = app1Start + 10;

            if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
                var endianness = dataView.getUint16(tiffOffset);

                littleEndian = endianness === 0x4949;

                if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
                    if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                        var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

                        if (firstIFDOffset >= 0x00000008) {
                            ifdStart = tiffOffset + firstIFDOffset;
                        }
                    }
                }
            }
        }

        if (ifdStart) {
            var _length = dataView.getUint16(ifdStart, littleEndian);
            var _offset = void 0;
            var i = void 0;

            for (i = 0; i < _length; i += 1) {
                _offset = ifdStart + i * 12 + 2;

                if (dataView.getUint16(_offset, littleEndian) === 0x0112 /* Orientation */) {
                    // 8 is the offset of the current tag's value
                    _offset += 8;

                    // Get the original orientation value
                    orientation = dataView.getUint16(_offset, littleEndian);

                    // Override the orientation with its default value
                    dataView.setUint16(_offset, 1, littleEndian);
                    break;
                }
            }
        }

        return orientation;
    }

    /**
     * Parse Exif Orientation value.
     * @param {number} orientation - The orientation to parse.
     * @returns {Object} The parsed result.
     */
    function parseOrientation(orientation) {
        var rotate = 0;
        var scaleX = 1;
        var scaleY = 1;

        switch (orientation) {
            // Flip horizontal
            case 2:
                scaleX = -1;
                break;

            // Rotate left 180��
            case 3:
                rotate = -180;
                break;

            // Flip vertical
            case 4:
                scaleY = -1;
                break;

            // Flip vertical and rotate right 90��
            case 5:
                rotate = 90;
                scaleY = -1;
                break;

            // Rotate right 90��
            case 6:
                rotate = 90;
                break;

            // Flip horizontal and rotate right 90��
            case 7:
                rotate = 90;
                scaleX = -1;
                break;

            // Rotate left 90��
            case 8:
                rotate = -90;
                break;

            default:
        }

        return {
            rotate: rotate,
            scaleX: scaleX,
            scaleY: scaleY
        };
    }

    var render = {
        render: function render() {
            this.initContainer();
            this.initCanvas();
            this.initCropBox();
            this.renderCanvas();

            if (this.cropped) {
                this.renderCropBox();
            }
        },
        initContainer: function initContainer() {
            var element = this.element,
                options = this.options,
                container = this.container,
                cropper = this.cropper;


            addClass(cropper, CLASS_HIDDEN);
            removeClass(element, CLASS_HIDDEN);

            var containerData = {
                width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
                height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
            };

            this.containerData = containerData;

            setStyle(cropper, {
                width: containerData.width,
                height: containerData.height
            });

            addClass(element, CLASS_HIDDEN);
            removeClass(cropper, CLASS_HIDDEN);
        },


        // Canvas (image wrapper)
        initCanvas: function initCanvas() {
            var containerData = this.containerData,
                imageData = this.imageData;
            var viewMode = this.options.viewMode;

            var rotated = Math.abs(imageData.rotate) % 180 === 90;
            var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
            var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
            var aspectRatio = naturalWidth / naturalHeight;
            var canvasWidth = containerData.width;
            var canvasHeight = containerData.height;

            if (containerData.height * aspectRatio > containerData.width) {
                if (viewMode === 3) {
                    canvasWidth = containerData.height * aspectRatio;
                } else {
                    canvasHeight = containerData.width / aspectRatio;
                }
            } else if (viewMode === 3) {
                canvasHeight = containerData.width / aspectRatio;
            } else {
                canvasWidth = containerData.height * aspectRatio;
            }

            var canvasData = {
                aspectRatio: aspectRatio,
                naturalWidth: naturalWidth,
                naturalHeight: naturalHeight,
                width: canvasWidth,
                height: canvasHeight
            };

            canvasData.left = (containerData.width - canvasWidth) / 2;
            canvasData.top = (containerData.height - canvasHeight) / 2;
            canvasData.oldLeft = canvasData.left;
            canvasData.oldTop = canvasData.top;

            this.canvasData = canvasData;
            this.limited = viewMode === 1 || viewMode === 2;
            this.limitCanvas(true, true);
            this.initialImageData = assign({}, imageData);
            this.initialCanvasData = assign({}, canvasData);
        },
        limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
            var options = this.options,
                containerData = this.containerData,
                canvasData = this.canvasData,
                cropBoxData = this.cropBoxData;
            var viewMode = options.viewMode;
            var aspectRatio = canvasData.aspectRatio;

            var cropped = this.cropped && cropBoxData;

            if (sizeLimited) {
                var minCanvasWidth = Number(options.minCanvasWidth) || 0;
                var minCanvasHeight = Number(options.minCanvasHeight) || 0;

                if (viewMode > 1) {
                    minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
                    minCanvasHeight = Math.max(minCanvasHeight, containerData.height);

                    if (viewMode === 3) {
                        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                            minCanvasWidth = minCanvasHeight * aspectRatio;
                        } else {
                            minCanvasHeight = minCanvasWidth / aspectRatio;
                        }
                    }
                } else if (viewMode > 0) {
                    if (minCanvasWidth) {
                        minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
                    } else if (minCanvasHeight) {
                        minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
                    } else if (cropped) {
                        minCanvasWidth = cropBoxData.width;
                        minCanvasHeight = cropBoxData.height;

                        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                            minCanvasWidth = minCanvasHeight * aspectRatio;
                        } else {
                            minCanvasHeight = minCanvasWidth / aspectRatio;
                        }
                    }
                }

                var _getAdjustedSizes = getAdjustedSizes({
                    aspectRatio: aspectRatio,
                    width: minCanvasWidth,
                    height: minCanvasHeight
                });

                minCanvasWidth = _getAdjustedSizes.width;
                minCanvasHeight = _getAdjustedSizes.height;


                canvasData.minWidth = minCanvasWidth;
                canvasData.minHeight = minCanvasHeight;
                canvasData.maxWidth = Infinity;
                canvasData.maxHeight = Infinity;
            }

            if (positionLimited) {
                if (viewMode) {
                    var newCanvasLeft = containerData.width - canvasData.width;
                    var newCanvasTop = containerData.height - canvasData.height;

                    canvasData.minLeft = Math.min(0, newCanvasLeft);
                    canvasData.minTop = Math.min(0, newCanvasTop);
                    canvasData.maxLeft = Math.max(0, newCanvasLeft);
                    canvasData.maxTop = Math.max(0, newCanvasTop);

                    if (cropped && this.limited) {
                        canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
                        canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
                        canvasData.maxLeft = cropBoxData.left;
                        canvasData.maxTop = cropBoxData.top;

                        if (viewMode === 2) {
                            if (canvasData.width >= containerData.width) {
                                canvasData.minLeft = Math.min(0, newCanvasLeft);
                                canvasData.maxLeft = Math.max(0, newCanvasLeft);
                            }

                            if (canvasData.height >= containerData.height) {
                                canvasData.minTop = Math.min(0, newCanvasTop);
                                canvasData.maxTop = Math.max(0, newCanvasTop);
                            }
                        }
                    }
                } else {
                    canvasData.minLeft = -canvasData.width;
                    canvasData.minTop = -canvasData.height;
                    canvasData.maxLeft = containerData.width;
                    canvasData.maxTop = containerData.height;
                }
            }
        },
        renderCanvas: function renderCanvas(changed, transformed) {
            var canvasData = this.canvasData,
                imageData = this.imageData;


            if (transformed) {
                var _getRotatedSizes = getRotatedSizes({
                        width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
                        height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
                        degree: imageData.rotate || 0
                    }),
                    naturalWidth = _getRotatedSizes.width,
                    naturalHeight = _getRotatedSizes.height;

                var width = canvasData.width * (naturalWidth / canvasData.naturalWidth);
                var height = canvasData.height * (naturalHeight / canvasData.naturalHeight);

                canvasData.left -= (width - canvasData.width) / 2;
                canvasData.top -= (height - canvasData.height) / 2;
                canvasData.width = width;
                canvasData.height = height;
                canvasData.aspectRatio = naturalWidth / naturalHeight;
                canvasData.naturalWidth = naturalWidth;
                canvasData.naturalHeight = naturalHeight;
                this.limitCanvas(true, false);
            }

            if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
                canvasData.left = canvasData.oldLeft;
            }

            if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
                canvasData.top = canvasData.oldTop;
            }

            canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
            canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);

            this.limitCanvas(false, true);

            canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
            canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
            canvasData.oldLeft = canvasData.left;
            canvasData.oldTop = canvasData.top;

            setStyle(this.canvas, assign({
                width: canvasData.width,
                height: canvasData.height
            }, getTransforms({
                translateX: canvasData.left,
                translateY: canvasData.top
            })));

            this.renderImage(changed);

            if (this.cropped && this.limited) {
                this.limitCropBox(true, true);
            }
        },
        renderImage: function renderImage(changed) {
            var canvasData = this.canvasData,
                imageData = this.imageData;

            var width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
            var height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);

            assign(imageData, {
                width: width,
                height: height,
                left: (canvasData.width - width) / 2,
                top: (canvasData.height - height) / 2
            });
            setStyle(this.image, assign({
                width: imageData.width,
                height: imageData.height
            }, getTransforms(assign({
                translateX: imageData.left,
                translateY: imageData.top
            }, imageData))));

            if (changed) {
                this.output();
            }
        },
        initCropBox: function initCropBox() {
            var options = this.options,
                canvasData = this.canvasData;
            var aspectRatio = options.aspectRatio;

            var autoCropArea = Number(options.autoCropArea) || 0.8;
            var cropBoxData = {
                width: canvasData.width,
                height: canvasData.height
            };

            if (aspectRatio) {
                if (canvasData.height * aspectRatio > canvasData.width) {
                    cropBoxData.height = cropBoxData.width / aspectRatio;
                } else {
                    cropBoxData.width = cropBoxData.height * aspectRatio;
                }
            }

            this.cropBoxData = cropBoxData;
            this.limitCropBox(true, true);

            // Initialize auto crop area
            cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
            cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);

            // The width/height of auto crop area must large than "minWidth/Height"
            cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
            cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
            cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
            cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
            cropBoxData.oldLeft = cropBoxData.left;
            cropBoxData.oldTop = cropBoxData.top;

            this.initialCropBoxData = assign({}, cropBoxData);
        },
        limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
            var options = this.options,
                containerData = this.containerData,
                canvasData = this.canvasData,
                cropBoxData = this.cropBoxData,
                limited = this.limited;
            var aspectRatio = options.aspectRatio;


            if (sizeLimited) {
                var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
                var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
                var maxCropBoxWidth = Math.min(containerData.width, limited ? canvasData.width : containerData.width);
                var maxCropBoxHeight = Math.min(containerData.height, limited ? canvasData.height : containerData.height);

                // The min/maxCropBoxWidth/Height must be less than container's width/height
                minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
                minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);

                if (aspectRatio) {
                    if (minCropBoxWidth && minCropBoxHeight) {
                        if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
                            minCropBoxHeight = minCropBoxWidth / aspectRatio;
                        } else {
                            minCropBoxWidth = minCropBoxHeight * aspectRatio;
                        }
                    } else if (minCropBoxWidth) {
                        minCropBoxHeight = minCropBoxWidth / aspectRatio;
                    } else if (minCropBoxHeight) {
                        minCropBoxWidth = minCropBoxHeight * aspectRatio;
                    }

                    if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
                        maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
                    } else {
                        maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
                    }
                }

                // The minWidth/Height must be less than maxWidth/Height
                cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
                cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
                cropBoxData.maxWidth = maxCropBoxWidth;
                cropBoxData.maxHeight = maxCropBoxHeight;
            }

            if (positionLimited) {
                if (limited) {
                    cropBoxData.minLeft = Math.max(0, canvasData.left);
                    cropBoxData.minTop = Math.max(0, canvasData.top);
                    cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
                    cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
                } else {
                    cropBoxData.minLeft = 0;
                    cropBoxData.minTop = 0;
                    cropBoxData.maxLeft = containerData.width - cropBoxData.width;
                    cropBoxData.maxTop = containerData.height - cropBoxData.height;
                }
            }
        },
        renderCropBox: function renderCropBox() {
            var options = this.options,
                containerData = this.containerData,
                cropBoxData = this.cropBoxData;


            if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
                cropBoxData.left = cropBoxData.oldLeft;
            }

            if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
                cropBoxData.top = cropBoxData.oldTop;
            }

            cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
            cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);

            this.limitCropBox(false, true);

            cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
            cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
            cropBoxData.oldLeft = cropBoxData.left;
            cropBoxData.oldTop = cropBoxData.top;

            if (options.movable && options.cropBoxMovable) {
                // Turn to move the canvas when the crop box is equal to the container
                setData(this.face, DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? ACTION_MOVE : ACTION_ALL);
            }

            setStyle(this.cropBox, assign({
                width: cropBoxData.width,
                height: cropBoxData.height
            }, getTransforms({
                translateX: cropBoxData.left,
                translateY: cropBoxData.top
            })));

            if (this.cropped && this.limited) {
                this.limitCanvas(true, true);
            }

            if (!this.disabled) {
                this.output();
            }
        },
        output: function output() {
            this.preview();
            dispatchEvent(this.element, EVENT_CROP, this.getData());
        }
    };

    var preview = {
        initPreview: function initPreview() {
            var crossOrigin = this.crossOrigin;
            var preview = this.options.preview;

            var url = crossOrigin ? this.crossOriginUrl : this.url;
            var image = document.createElement('img');

            if (crossOrigin) {
                image.crossOrigin = crossOrigin;
            }

            image.src = url;
            this.viewBox.appendChild(image);
            this.viewBoxImage = image;

            if (!preview) {
                return;
            }

            var previews = preview;

            if (typeof preview === 'string') {
                previews = this.element.ownerDocument.querySelectorAll(preview);
            } else if (preview.querySelector) {
                previews = [preview];
            }

            this.previews = previews;

            forEach(previews, function (el) {
                var img = document.createElement('img');

                // Save the original size for recover
                setData(el, DATA_PREVIEW, {
                    width: el.offsetWidth,
                    height: el.offsetHeight,
                    html: el.innerHTML
                });

                if (crossOrigin) {
                    img.crossOrigin = crossOrigin;
                }

                img.src = url;

                /**
                 * Override img element styles
                 * Add `display:block` to avoid margin top issue
                 * Add `height:auto` to override `height` attribute on IE8
                 * (Occur only when margin-top <= -height)
                 */
                img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';

                el.innerHTML = '';
                el.appendChild(img);
            });
        },
        resetPreview: function resetPreview() {
            forEach(this.previews, function (element) {
                var data = getData(element, DATA_PREVIEW);

                setStyle(element, {
                    width: data.width,
                    height: data.height
                });

                element.innerHTML = data.html;
                removeData(element, DATA_PREVIEW);
            });
        },
        preview: function preview() {
            var imageData = this.imageData,
                canvasData = this.canvasData,
                cropBoxData = this.cropBoxData;
            var cropBoxWidth = cropBoxData.width,
                cropBoxHeight = cropBoxData.height;
            var width = imageData.width,
                height = imageData.height;

            var left = cropBoxData.left - canvasData.left - imageData.left;
            var top = cropBoxData.top - canvasData.top - imageData.top;

            if (!this.cropped || this.disabled) {
                return;
            }

            setStyle(this.viewBoxImage, assign({
                width: width,
                height: height
            }, getTransforms(assign({
                translateX: -left,
                translateY: -top
            }, imageData))));

            forEach(this.previews, function (element) {
                var data = getData(element, DATA_PREVIEW);
                var originalWidth = data.width;
                var originalHeight = data.height;
                var newWidth = originalWidth;
                var newHeight = originalHeight;
                var ratio = 1;

                if (cropBoxWidth) {
                    ratio = originalWidth / cropBoxWidth;
                    newHeight = cropBoxHeight * ratio;
                }

                if (cropBoxHeight && newHeight > originalHeight) {
                    ratio = originalHeight / cropBoxHeight;
                    newWidth = cropBoxWidth * ratio;
                    newHeight = originalHeight;
                }

                setStyle(element, {
                    width: newWidth,
                    height: newHeight
                });

                setStyle(element.getElementsByTagName('img')[0], assign({
                    width: width * ratio,
                    height: height * ratio
                }, getTransforms(assign({
                    translateX: -left * ratio,
                    translateY: -top * ratio
                }, imageData))));
            });
        }
    };

    var events = {
        bind: function bind() {
            var element = this.element,
                options = this.options,
                cropper = this.cropper;


            if (isFunction(options.cropstart)) {
                addListener(element, EVENT_CROP_START, options.cropstart);
            }

            if (isFunction(options.cropmove)) {
                addListener(element, EVENT_CROP_MOVE, options.cropmove);
            }

            if (isFunction(options.cropend)) {
                addListener(element, EVENT_CROP_END, options.cropend);
            }

            if (isFunction(options.crop)) {
                addListener(element, EVENT_CROP, options.crop);
            }

            if (isFunction(options.zoom)) {
                addListener(element, EVENT_ZOOM, options.zoom);
            }

            addListener(cropper, EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));

            if (options.zoomable && options.zoomOnWheel) {
                addListener(cropper, EVENT_WHEEL, this.onWheel = this.wheel.bind(this));
            }

            if (options.toggleDragModeOnDblclick) {
                addListener(cropper, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
            }

            addListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
            addListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));

            if (options.responsive) {
                addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));
            }
        },
        unbind: function unbind() {
            var element = this.element,
                options = this.options,
                cropper = this.cropper;


            if (isFunction(options.cropstart)) {
                removeListener(element, EVENT_CROP_START, options.cropstart);
            }

            if (isFunction(options.cropmove)) {
                removeListener(element, EVENT_CROP_MOVE, options.cropmove);
            }

            if (isFunction(options.cropend)) {
                removeListener(element, EVENT_CROP_END, options.cropend);
            }

            if (isFunction(options.crop)) {
                removeListener(element, EVENT_CROP, options.crop);
            }

            if (isFunction(options.zoom)) {
                removeListener(element, EVENT_ZOOM, options.zoom);
            }

            removeListener(cropper, EVENT_POINTER_DOWN, this.onCropStart);

            if (options.zoomable && options.zoomOnWheel) {
                removeListener(cropper, EVENT_WHEEL, this.onWheel);
            }

            if (options.toggleDragModeOnDblclick) {
                removeListener(cropper, EVENT_DBLCLICK, this.onDblclick);
            }

            removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove);
            removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd);

            if (options.responsive) {
                removeListener(window, EVENT_RESIZE, this.onResize);
            }
        }
    };

    var handlers = {
        resize: function resize() {
            var options = this.options,
                container = this.container,
                containerData = this.containerData;

            var minContainerWidth = Number(options.minContainerWidth) || 200;
            var minContainerHeight = Number(options.minContainerHeight) || 100;

            if (this.disabled || containerData.width <= minContainerWidth || containerData.height <= minContainerHeight) {
                return;
            }

            var ratio = container.offsetWidth / containerData.width;

            // Resize when width changed or height changed
            if (ratio !== 1 || container.offsetHeight !== containerData.height) {
                var canvasData = void 0;
                var cropBoxData = void 0;

                if (options.restore) {
                    canvasData = this.getCanvasData();
                    cropBoxData = this.getCropBoxData();
                }

                this.render();

                if (options.restore) {
                    this.setCanvasData(forEach(canvasData, function (n, i) {
                        canvasData[i] = n * ratio;
                    }));
                    this.setCropBoxData(forEach(cropBoxData, function (n, i) {
                        cropBoxData[i] = n * ratio;
                    }));
                }
            }
        },
        dblclick: function dblclick() {
            if (this.disabled || this.options.dragMode === DRAG_MODE_NONE) {
                return;
            }

            this.setDragMode(hasClass(this.dragBox, CLASS_CROP) ? DRAG_MODE_MOVE : DRAG_MODE_CROP);
        },
        wheel: function wheel(e) {
            var _this = this;

            var ratio = Number(this.options.wheelZoomRatio) || 0.1;
            var delta = 1;

            if (this.disabled) {
                return;
            }

            e.preventDefault();

            // Limit wheel speed to prevent zoom too fast (#21)
            if (this.wheeling) {
                return;
            }

            this.wheeling = true;

            setTimeout(function () {
                _this.wheeling = false;
            }, 50);

            if (e.deltaY) {
                delta = e.deltaY > 0 ? 1 : -1;
            } else if (e.wheelDelta) {
                delta = -e.wheelDelta / 120;
            } else if (e.detail) {
                delta = e.detail > 0 ? 1 : -1;
            }

            this.zoom(-delta * ratio, e);
        },
        cropStart: function cropStart(e) {
            if (this.disabled) {
                return;
            }

            var options = this.options,
                pointers = this.pointers;

            var action = void 0;

            if (e.changedTouches) {
                // Handle touch event
                forEach(e.changedTouches, function (touch) {
                    pointers[touch.identifier] = getPointer(touch);
                });
            } else {
                // Handle mouse event and pointer event
                pointers[e.pointerId || 0] = getPointer(e);
            }

            if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
                action = ACTION_ZOOM;
            } else {
                action = getData(e.target, DATA_ACTION);
            }

            if (!REGEXP_ACTIONS.test(action)) {
                return;
            }

            if (dispatchEvent(this.element, EVENT_CROP_START, {
                    originalEvent: e,
                    action: action
                }) === false) {
                return;
            }

            e.preventDefault();

            this.action = action;
            this.cropping = false;

            if (action === ACTION_CROP) {
                this.cropping = true;
                addClass(this.dragBox, CLASS_MODAL);
            }
        },
        cropMove: function cropMove(e) {
            var action = this.action;


            if (this.disabled || !action) {
                return;
            }

            var pointers = this.pointers;


            e.preventDefault();

            if (dispatchEvent(this.element, EVENT_CROP_MOVE, {
                    originalEvent: e,
                    action: action
                }) === false) {
                return;
            }

            if (e.changedTouches) {
                forEach(e.changedTouches, function (touch) {
                    assign(pointers[touch.identifier], getPointer(touch, true));
                });
            } else {
                assign(pointers[e.pointerId || 0], getPointer(e, true));
            }

            this.change(e);
        },
        cropEnd: function cropEnd(e) {
            if (this.disabled) {
                return;
            }

            var action = this.action,
                pointers = this.pointers;


            if (e.changedTouches) {
                forEach(e.changedTouches, function (touch) {
                    delete pointers[touch.identifier];
                });
            } else {
                delete pointers[e.pointerId || 0];
            }

            if (!action) {
                return;
            }

            e.preventDefault();

            if (!Object.keys(pointers).length) {
                this.action = '';
            }

            if (this.cropping) {
                this.cropping = false;
                toggleClass(this.dragBox, CLASS_MODAL, this.cropped && this.options.modal);
            }

            dispatchEvent(this.element, EVENT_CROP_END, {
                originalEvent: e,
                action: action
            });
        }
    };

    var change = {
        change: function change(e) {
            var options = this.options,
                canvasData = this.canvasData,
                containerData = this.containerData,
                cropBoxData = this.cropBoxData,
                pointers = this.pointers;
            var action = this.action;
            var aspectRatio = options.aspectRatio;
            var left = cropBoxData.left,
                top = cropBoxData.top,
                width = cropBoxData.width,
                height = cropBoxData.height;

            var right = left + width;
            var bottom = top + height;
            var minLeft = 0;
            var minTop = 0;
            var maxWidth = containerData.width;
            var maxHeight = containerData.height;
            var renderable = true;
            var offset = void 0;

            // Locking aspect ratio in "free mode" by holding shift key
            if (!aspectRatio && e.shiftKey) {
                aspectRatio = width && height ? width / height : 1;
            }

            if (this.limited) {
                minLeft = cropBoxData.minLeft;
                minTop = cropBoxData.minTop;

                maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
                maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
            }

            var pointer = pointers[Object.keys(pointers)[0]];
            var range = {
                x: pointer.endX - pointer.startX,
                y: pointer.endY - pointer.startY
            };
            var check = function check(side) {
                switch (side) {
                    case ACTION_EAST:
                        if (right + range.x > maxWidth) {
                            range.x = maxWidth - right;
                        }

                        break;

                    case ACTION_WEST:
                        if (left + range.x < minLeft) {
                            range.x = minLeft - left;
                        }

                        break;

                    case ACTION_NORTH:
                        if (top + range.y < minTop) {
                            range.y = minTop - top;
                        }

                        break;

                    case ACTION_SOUTH:
                        if (bottom + range.y > maxHeight) {
                            range.y = maxHeight - bottom;
                        }

                        break;

                    default:
                }
            };

            switch (action) {
                // Move crop box
                case ACTION_ALL:
                    left += range.x;
                    top += range.y;
                    break;

                // Resize crop box
                case ACTION_EAST:
                    if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
                        renderable = false;
                        break;
                    }

                    check(ACTION_EAST);
                    width += range.x;

                    if (aspectRatio) {
                        height = width / aspectRatio;
                        top -= range.x / aspectRatio / 2;
                    }

                    if (width < 0) {
                        action = ACTION_WEST;
                        width = 0;
                    }

                    break;

                case ACTION_NORTH:
                    if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
                        renderable = false;
                        break;
                    }

                    check(ACTION_NORTH);
                    height -= range.y;
                    top += range.y;

                    if (aspectRatio) {
                        width = height * aspectRatio;
                        left += range.y * aspectRatio / 2;
                    }

                    if (height < 0) {
                        action = ACTION_SOUTH;
                        height = 0;
                    }

                    break;

                case ACTION_WEST:
                    if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
                        renderable = false;
                        break;
                    }

                    check(ACTION_WEST);
                    width -= range.x;
                    left += range.x;

                    if (aspectRatio) {
                        height = width / aspectRatio;
                        top += range.x / aspectRatio / 2;
                    }

                    if (width < 0) {
                        action = ACTION_EAST;
                        width = 0;
                    }

                    break;

                case ACTION_SOUTH:
                    if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
                        renderable = false;
                        break;
                    }

                    check(ACTION_SOUTH);
                    height += range.y;

                    if (aspectRatio) {
                        width = height * aspectRatio;
                        left -= range.y * aspectRatio / 2;
                    }

                    if (height < 0) {
                        action = ACTION_NORTH;
                        height = 0;
                    }

                    break;

                case ACTION_NORTH_EAST:
                    if (aspectRatio) {
                        if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
                            renderable = false;
                            break;
                        }

                        check(ACTION_NORTH);
                        height -= range.y;
                        top += range.y;
                        width = height * aspectRatio;
                    } else {
                        check(ACTION_NORTH);
                        check(ACTION_EAST);

                        if (range.x >= 0) {
                            if (right < maxWidth) {
                                width += range.x;
                            } else if (range.y <= 0 && top <= minTop) {
                                renderable = false;
                            }
                        } else {
                            width += range.x;
                        }

                        if (range.y <= 0) {
                            if (top > minTop) {
                                height -= range.y;
                                top += range.y;
                            }
                        } else {
                            height -= range.y;
                            top += range.y;
                        }
                    }

                    if (width < 0 && height < 0) {
                        action = ACTION_SOUTH_WEST;
                        height = 0;
                        width = 0;
                    } else if (width < 0) {
                        action = ACTION_NORTH_WEST;
                        width = 0;
                    } else if (height < 0) {
                        action = ACTION_SOUTH_EAST;
                        height = 0;
                    }

                    break;

                case ACTION_NORTH_WEST:
                    if (aspectRatio) {
                        if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
                            renderable = false;
                            break;
                        }

                        check(ACTION_NORTH);
                        height -= range.y;
                        top += range.y;
                        width = height * aspectRatio;
                        left += range.y * aspectRatio;
                    } else {
                        check(ACTION_NORTH);
                        check(ACTION_WEST);

                        if (range.x <= 0) {
                            if (left > minLeft) {
                                width -= range.x;
                                left += range.x;
                            } else if (range.y <= 0 && top <= minTop) {
                                renderable = false;
                            }
                        } else {
                            width -= range.x;
                            left += range.x;
                        }

                        if (range.y <= 0) {
                            if (top > minTop) {
                                height -= range.y;
                                top += range.y;
                            }
                        } else {
                            height -= range.y;
                            top += range.y;
                        }
                    }

                    if (width < 0 && height < 0) {
                        action = ACTION_SOUTH_EAST;
                        height = 0;
                        width = 0;
                    } else if (width < 0) {
                        action = ACTION_NORTH_EAST;
                        width = 0;
                    } else if (height < 0) {
                        action = ACTION_SOUTH_WEST;
                        height = 0;
                    }

                    break;

                case ACTION_SOUTH_WEST:
                    if (aspectRatio) {
                        if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
                            renderable = false;
                            break;
                        }

                        check(ACTION_WEST);
                        width -= range.x;
                        left += range.x;
                        height = width / aspectRatio;
                    } else {
                        check(ACTION_SOUTH);
                        check(ACTION_WEST);

                        if (range.x <= 0) {
                            if (left > minLeft) {
                                width -= range.x;
                                left += range.x;
                            } else if (range.y >= 0 && bottom >= maxHeight) {
                                renderable = false;
                            }
                        } else {
                            width -= range.x;
                            left += range.x;
                        }

                        if (range.y >= 0) {
                            if (bottom < maxHeight) {
                                height += range.y;
                            }
                        } else {
                            height += range.y;
                        }
                    }

                    if (width < 0 && height < 0) {
                        action = ACTION_NORTH_EAST;
                        height = 0;
                        width = 0;
                    } else if (width < 0) {
                        action = ACTION_SOUTH_EAST;
                        width = 0;
                    } else if (height < 0) {
                        action = ACTION_NORTH_WEST;
                        height = 0;
                    }

                    break;

                case ACTION_SOUTH_EAST:
                    if (aspectRatio) {
                        if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
                            renderable = false;
                            break;
                        }

                        check(ACTION_EAST);
                        width += range.x;
                        height = width / aspectRatio;
                    } else {
                        check(ACTION_SOUTH);
                        check(ACTION_EAST);

                        if (range.x >= 0) {
                            if (right < maxWidth) {
                                width += range.x;
                            } else if (range.y >= 0 && bottom >= maxHeight) {
                                renderable = false;
                            }
                        } else {
                            width += range.x;
                        }

                        if (range.y >= 0) {
                            if (bottom < maxHeight) {
                                height += range.y;
                            }
                        } else {
                            height += range.y;
                        }
                    }

                    if (width < 0 && height < 0) {
                        action = ACTION_NORTH_WEST;
                        height = 0;
                        width = 0;
                    } else if (width < 0) {
                        action = ACTION_SOUTH_WEST;
                        width = 0;
                    } else if (height < 0) {
                        action = ACTION_NORTH_EAST;
                        height = 0;
                    }

                    break;

                // Move canvas
                case ACTION_MOVE:
                    this.move(range.x, range.y);
                    renderable = false;
                    break;

                // Zoom canvas
                case ACTION_ZOOM:
                    this.zoom(getMaxZoomRatio(pointers), e);
                    renderable = false;
                    break;

                // Create crop box
                case ACTION_CROP:
                    if (!range.x || !range.y) {
                        renderable = false;
                        break;
                    }

                    offset = getOffset(this.cropper);
                    left = pointer.startX - offset.left;
                    top = pointer.startY - offset.top;
                    width = cropBoxData.minWidth;
                    height = cropBoxData.minHeight;

                    if (range.x > 0) {
                        action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
                    } else if (range.x < 0) {
                        left -= width;
                        action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
                    }

                    if (range.y < 0) {
                        top -= height;
                    }

                    // Show the crop box if is hidden
                    if (!this.cropped) {
                        removeClass(this.cropBox, CLASS_HIDDEN);
                        this.cropped = true;

                        if (this.limited) {
                            this.limitCropBox(true, true);
                        }
                    }

                    break;

                default:
            }

            if (renderable) {
                cropBoxData.width = width;
                cropBoxData.height = height;
                cropBoxData.left = left;
                cropBoxData.top = top;
                this.action = action;
                this.renderCropBox();
            }

            // Override
            forEach(pointers, function (p) {
                p.startX = p.endX;
                p.startY = p.endY;
            });
        }
    };

    var methods = {
        // Show the crop box manually
        crop: function crop() {
            if (this.ready && !this.cropped && !this.disabled) {
                this.cropped = true;
                this.limitCropBox(true, true);

                if (this.options.modal) {
                    addClass(this.dragBox, CLASS_MODAL);
                }

                removeClass(this.cropBox, CLASS_HIDDEN);
                this.setCropBoxData(this.initialCropBoxData);
            }

            return this;
        },


        // Reset the image and crop box to their initial states
        reset: function reset() {
            if (this.ready && !this.disabled) {
                this.imageData = assign({}, this.initialImageData);
                this.canvasData = assign({}, this.initialCanvasData);
                this.cropBoxData = assign({}, this.initialCropBoxData);
                this.renderCanvas();

                if (this.cropped) {
                    this.renderCropBox();
                }
            }

            return this;
        },


        // Clear the crop box
        clear: function clear() {
            if (this.cropped && !this.disabled) {
                assign(this.cropBoxData, {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                });

                this.cropped = false;
                this.renderCropBox();
                this.limitCanvas(true, true);

                // Render canvas after crop box rendered
                this.renderCanvas();
                removeClass(this.dragBox, CLASS_MODAL);
                addClass(this.cropBox, CLASS_HIDDEN);
            }

            return this;
        },


        /**
         * Replace the image's src and rebuild the cropper
         * @param {string} url - The new URL.
         * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
         * @returns {Cropper} this
         */
        replace: function replace(url) {
            var hasSameSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!this.disabled && url) {
                if (this.isImg) {
                    this.element.src = url;
                }

                if (hasSameSize) {
                    this.url = url;
                    this.image.src = url;

                    if (this.ready) {
                        this.viewBoxImage.src = url;

                        forEach(this.previews, function (element) {
                            element.getElementsByTagName('img')[0].src = url;
                        });
                    }
                } else {
                    if (this.isImg) {
                        this.replaced = true;
                    }

                    this.options.data = null;
                    this.uncreate();
                    this.load(url);
                }
            }

            return this;
        },


        // Enable (unfreeze) the cropper
        enable: function enable() {
            if (this.ready && this.disabled) {
                this.disabled = false;
                removeClass(this.cropper, CLASS_DISABLED);
            }

            return this;
        },


        // Disable (freeze) the cropper
        disable: function disable() {
            if (this.ready && !this.disabled) {
                this.disabled = true;
                addClass(this.cropper, CLASS_DISABLED);
            }

            return this;
        },


        /**
         * Destroy the cropper and remove the instance from the image
         * @returns {Cropper} this
         */
        destroy: function destroy() {
            var element = this.element;


            if (!getData(element, NAMESPACE)) {
                return this;
            }

            if (this.isImg && this.replaced) {
                element.src = this.originalUrl;
            }

            this.uncreate();
            removeData(element, NAMESPACE);

            return this;
        },


        /**
         * Move the canvas with relative offsets
         * @param {number} offsetX - The relative offset distance on the x-axis.
         * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
         * @returns {Cropper} this
         */
        move: function move(offsetX) {
            var offsetY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : offsetX;
            var _canvasData = this.canvasData,
                left = _canvasData.left,
                top = _canvasData.top;


            return this.moveTo(isUndefined(offsetX) ? offsetX : left + Number(offsetX), isUndefined(offsetY) ? offsetY : top + Number(offsetY));
        },


        /**
         * Move the canvas to an absolute point
         * @param {number} x - The x-axis coordinate.
         * @param {number} [y=x] - The y-axis coordinate.
         * @returns {Cropper} this
         */
        moveTo: function moveTo(x) {
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
            var canvasData = this.canvasData;

            var changed = false;

            x = Number(x);
            y = Number(y);

            if (this.ready && !this.disabled && this.options.movable) {
                if (isNumber(x)) {
                    canvasData.left = x;
                    changed = true;
                }

                if (isNumber(y)) {
                    canvasData.top = y;
                    changed = true;
                }

                if (changed) {
                    this.renderCanvas(true);
                }
            }

            return this;
        },


        /**
         * Zoom the canvas with a relative ratio
         * @param {number} ratio - The target ratio.
         * @param {Event} _originalEvent - The original event if any.
         * @returns {Cropper} this
         */
        zoom: function zoom(ratio, _originalEvent) {
            var canvasData = this.canvasData;


            ratio = Number(ratio);

            if (ratio < 0) {
                ratio = 1 / (1 - ratio);
            } else {
                ratio = 1 + ratio;
            }

            return this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, null, _originalEvent);
        },


        /**
         * Zoom the canvas to an absolute ratio
         * @param {number} ratio - The target ratio.
         * @param {Object} pivot - The zoom pivot point coordinate.
         * @param {Event} _originalEvent - The original event if any.
         * @returns {Cropper} this
         */
        zoomTo: function zoomTo(ratio, pivot, _originalEvent) {
            var options = this.options,
                canvasData = this.canvasData;
            var width = canvasData.width,
                height = canvasData.height,
                naturalWidth = canvasData.naturalWidth,
                naturalHeight = canvasData.naturalHeight;


            ratio = Number(ratio);

            if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
                var newWidth = naturalWidth * ratio;
                var newHeight = naturalHeight * ratio;

                if (dispatchEvent(this.element, EVENT_ZOOM, {
                        originalEvent: _originalEvent,
                        oldRatio: width / naturalWidth,
                        ratio: newWidth / naturalWidth
                    }) === false) {
                    return this;
                }

                if (_originalEvent) {
                    var pointers = this.pointers;

                    var offset = getOffset(this.cropper);
                    var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
                        pageX: _originalEvent.pageX,
                        pageY: _originalEvent.pageY
                    };

                    // Zoom from the triggering point of the event
                    canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
                    canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
                } else if (isPlainObject(pivot) && isNumber(pivot.x) && isNumber(pivot.y)) {
                    canvasData.left -= (newWidth - width) * ((pivot.x - canvasData.left) / width);
                    canvasData.top -= (newHeight - height) * ((pivot.y - canvasData.top) / height);
                } else {
                    // Zoom from the center of the canvas
                    canvasData.left -= (newWidth - width) / 2;
                    canvasData.top -= (newHeight - height) / 2;
                }

                canvasData.width = newWidth;
                canvasData.height = newHeight;
                this.renderCanvas(true);
            }

            return this;
        },


        /**
         * Rotate the canvas with a relative degree
         * @param {number} degree - The rotate degree.
         * @returns {Cropper} this
         */
        rotate: function rotate(degree) {
            return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
        },


        /**
         * Rotate the canvas to an absolute degree
         * @param {number} degree - The rotate degree.
         * @returns {Cropper} this
         */
        rotateTo: function rotateTo(degree) {
            degree = Number(degree);

            if (isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
                this.imageData.rotate = degree % 360;
                this.renderCanvas(true, true);
            }

            return this;
        },


        /**
         * Scale the image on the x-axis.
         * @param {number} scaleX - The scale ratio on the x-axis.
         * @returns {Cropper} this
         */
        scaleX: function scaleX(_scaleX) {
            var scaleY = this.imageData.scaleY;


            return this.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
        },


        /**
         * Scale the image on the y-axis.
         * @param {number} scaleY - The scale ratio on the y-axis.
         * @returns {Cropper} this
         */
        scaleY: function scaleY(_scaleY) {
            var scaleX = this.imageData.scaleX;


            return this.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
        },


        /**
         * Scale the image
         * @param {number} scaleX - The scale ratio on the x-axis.
         * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
         * @returns {Cropper} this
         */
        scale: function scale(scaleX) {
            var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
            var imageData = this.imageData;

            var transformed = false;

            scaleX = Number(scaleX);
            scaleY = Number(scaleY);

            if (this.ready && !this.disabled && this.options.scalable) {
                if (isNumber(scaleX)) {
                    imageData.scaleX = scaleX;
                    transformed = true;
                }

                if (isNumber(scaleY)) {
                    imageData.scaleY = scaleY;
                    transformed = true;
                }

                if (transformed) {
                    this.renderCanvas(true, true);
                }
            }

            return this;
        },


        /**
         * Get the cropped area position and size data (base on the original image)
         * @param {boolean} [rounded=false] - Indicate if round the data values or not.
         * @returns {Object} The result cropped data.
         */
        getData: function getData$$1() {
            var rounded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var options = this.options,
                imageData = this.imageData,
                canvasData = this.canvasData,
                cropBoxData = this.cropBoxData;

            var data = void 0;

            if (this.ready && this.cropped) {
                data = {
                    x: cropBoxData.left - canvasData.left,
                    y: cropBoxData.top - canvasData.top,
                    width: cropBoxData.width,
                    height: cropBoxData.height
                };

                var ratio = imageData.width / imageData.naturalWidth;

                forEach(data, function (n, i) {
                    n /= ratio;
                    data[i] = rounded ? Math.round(n) : n;
                });
            } else {
                data = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
            }

            if (options.rotatable) {
                data.rotate = imageData.rotate || 0;
            }

            if (options.scalable) {
                data.scaleX = imageData.scaleX || 1;
                data.scaleY = imageData.scaleY || 1;
            }

            return data;
        },


        /**
         * Set the cropped area position and size with new data
         * @param {Object} data - The new data.
         * @returns {Cropper} this
         */
        setData: function setData$$1(data) {
            var options = this.options,
                imageData = this.imageData,
                canvasData = this.canvasData;

            var cropBoxData = {};

            if (this.ready && !this.disabled && isPlainObject(data)) {
                var transformed = false;

                if (options.rotatable) {
                    if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
                        imageData.rotate = data.rotate;
                        transformed = true;
                    }
                }

                if (options.scalable) {
                    if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
                        imageData.scaleX = data.scaleX;
                        transformed = true;
                    }

                    if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
                        imageData.scaleY = data.scaleY;
                        transformed = true;
                    }
                }

                if (transformed) {
                    this.renderCanvas(true, true);
                }

                var ratio = imageData.width / imageData.naturalWidth;

                if (isNumber(data.x)) {
                    cropBoxData.left = data.x * ratio + canvasData.left;
                }

                if (isNumber(data.y)) {
                    cropBoxData.top = data.y * ratio + canvasData.top;
                }

                if (isNumber(data.width)) {
                    cropBoxData.width = data.width * ratio;
                }

                if (isNumber(data.height)) {
                    cropBoxData.height = data.height * ratio;
                }

                this.setCropBoxData(cropBoxData);
            }

            return this;
        },


        /**
         * Get the container size data.
         * @returns {Object} The result container data.
         */
        getContainerData: function getContainerData() {
            return this.ready ? assign({}, this.containerData) : {};
        },


        /**
         * Get the image position and size data.
         * @returns {Object} The result image data.
         */
        getImageData: function getImageData() {
            return this.sized ? assign({}, this.imageData) : {};
        },


        /**
         * Get the canvas position and size data.
         * @returns {Object} The result canvas data.
         */
        getCanvasData: function getCanvasData() {
            var canvasData = this.canvasData;

            var data = {};

            if (this.ready) {
                forEach(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
                    data[n] = canvasData[n];
                });
            }

            return data;
        },


        /**
         * Set the canvas position and size with new data.
         * @param {Object} data - The new canvas data.
         * @returns {Cropper} this
         */
        setCanvasData: function setCanvasData(data) {
            var canvasData = this.canvasData;
            var aspectRatio = canvasData.aspectRatio;


            if (this.ready && !this.disabled && isPlainObject(data)) {
                if (isNumber(data.left)) {
                    canvasData.left = data.left;
                }

                if (isNumber(data.top)) {
                    canvasData.top = data.top;
                }

                if (isNumber(data.width)) {
                    canvasData.width = data.width;
                    canvasData.height = data.width / aspectRatio;
                } else if (isNumber(data.height)) {
                    canvasData.height = data.height;
                    canvasData.width = data.height * aspectRatio;
                }

                this.renderCanvas(true);
            }

            return this;
        },


        /**
         * Get the crop box position and size data.
         * @returns {Object} The result crop box data.
         */
        getCropBoxData: function getCropBoxData() {
            var cropBoxData = this.cropBoxData;

            var data = void 0;

            if (this.ready && this.cropped) {
                data = {
                    left: cropBoxData.left,
                    top: cropBoxData.top,
                    width: cropBoxData.width,
                    height: cropBoxData.height
                };
            }

            return data || {};
        },


        /**
         * Set the crop box position and size with new data.
         * @param {Object} data - The new crop box data.
         * @returns {Cropper} this
         */
        setCropBoxData: function setCropBoxData(data) {
            var cropBoxData = this.cropBoxData;
            var aspectRatio = this.options.aspectRatio;

            var widthChanged = void 0;
            var heightChanged = void 0;

            if (this.ready && this.cropped && !this.disabled && isPlainObject(data)) {
                if (isNumber(data.left)) {
                    cropBoxData.left = data.left;
                }

                if (isNumber(data.top)) {
                    cropBoxData.top = data.top;
                }

                if (isNumber(data.width) && data.width !== cropBoxData.width) {
                    widthChanged = true;
                    cropBoxData.width = data.width;
                }

                if (isNumber(data.height) && data.height !== cropBoxData.height) {
                    heightChanged = true;
                    cropBoxData.height = data.height;
                }

                if (aspectRatio) {
                    if (widthChanged) {
                        cropBoxData.height = cropBoxData.width / aspectRatio;
                    } else if (heightChanged) {
                        cropBoxData.width = cropBoxData.height * aspectRatio;
                    }
                }

                this.renderCropBox();
            }

            return this;
        },


        /**
         * Get a canvas drawn the cropped image.
         * @param {Object} [options={}] - The config options.
         * @returns {HTMLCanvasElement} - The result canvas.
         */
        getCroppedCanvas: function getCroppedCanvas() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (!this.ready || !window.HTMLCanvasElement) {
                return null;
            }

            var canvasData = this.canvasData;

            var source = getSourceCanvas(this.image, this.imageData, canvasData, options);

            // Returns the source canvas if it is not cropped.
            if (!this.cropped) {
                return source;
            }

            var _getData = this.getData(),
                initialX = _getData.x,
                initialY = _getData.y,
                initialWidth = _getData.width,
                initialHeight = _getData.height;

            var ratio = source.width / Math.floor(canvasData.naturalWidth);

            if (ratio !== 1) {
                initialX *= ratio;
                initialY *= ratio;
                initialWidth *= ratio;
                initialHeight *= ratio;
            }

            var aspectRatio = initialWidth / initialHeight;
            var maxSizes = getAdjustedSizes({
                aspectRatio: aspectRatio,
                width: options.maxWidth || Infinity,
                height: options.maxHeight || Infinity
            });
            var minSizes = getAdjustedSizes({
                aspectRatio: aspectRatio,
                width: options.minWidth || 0,
                height: options.minHeight || 0
            }, 'cover');

            var _getAdjustedSizes = getAdjustedSizes({
                    aspectRatio: aspectRatio,
                    width: options.width || (ratio !== 1 ? source.width : initialWidth),
                    height: options.height || (ratio !== 1 ? source.height : initialHeight)
                }),
                width = _getAdjustedSizes.width,
                height = _getAdjustedSizes.height;

            width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
            height = Math.min(maxSizes.height, Math.max(minSizes.height, height));

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            canvas.width = normalizeDecimalNumber(width);
            canvas.height = normalizeDecimalNumber(height);

            context.fillStyle = options.fillColor || 'transparent';
            context.fillRect(0, 0, width, height);

            var _options$imageSmoothi = options.imageSmoothingEnabled,
                imageSmoothingEnabled = _options$imageSmoothi === undefined ? true : _options$imageSmoothi,
                imageSmoothingQuality = options.imageSmoothingQuality;


            context.imageSmoothingEnabled = imageSmoothingEnabled;

            if (imageSmoothingQuality) {
                context.imageSmoothingQuality = imageSmoothingQuality;
            }

            // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
            var sourceWidth = source.width;
            var sourceHeight = source.height;

            // Source canvas parameters
            var srcX = initialX;
            var srcY = initialY;
            var srcWidth = void 0;
            var srcHeight = void 0;

            // Destination canvas parameters
            var dstX = void 0;
            var dstY = void 0;
            var dstWidth = void 0;
            var dstHeight = void 0;

            if (srcX <= -initialWidth || srcX > sourceWidth) {
                srcX = 0;
                srcWidth = 0;
                dstX = 0;
                dstWidth = 0;
            } else if (srcX <= 0) {
                dstX = -srcX;
                srcX = 0;
                srcWidth = Math.min(sourceWidth, initialWidth + srcX);
                dstWidth = srcWidth;
            } else if (srcX <= sourceWidth) {
                dstX = 0;
                srcWidth = Math.min(initialWidth, sourceWidth - srcX);
                dstWidth = srcWidth;
            }

            if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
                srcY = 0;
                srcHeight = 0;
                dstY = 0;
                dstHeight = 0;
            } else if (srcY <= 0) {
                dstY = -srcY;
                srcY = 0;
                srcHeight = Math.min(sourceHeight, initialHeight + srcY);
                dstHeight = srcHeight;
            } else if (srcY <= sourceHeight) {
                dstY = 0;
                srcHeight = Math.min(initialHeight, sourceHeight - srcY);
                dstHeight = srcHeight;
            }

            var params = [srcX, srcY, srcWidth, srcHeight];

            // Avoid "IndexSizeError"
            if (dstWidth > 0 && dstHeight > 0) {
                var scale = width / initialWidth;

                params.push(dstX * scale, dstY * scale, dstWidth * scale, dstHeight * scale);
            }

            // All the numerical parameters should be integer for `drawImage`
            // https://github.com/fengyuanchen/cropper/issues/476
            context.drawImage.apply(context, [source].concat(toConsumableArray(params.map(function (param) {
                return Math.floor(normalizeDecimalNumber(param));
            }))));

            return canvas;
        },


        /**
         * Change the aspect ratio of the crop box.
         * @param {number} aspectRatio - The new aspect ratio.
         * @returns {Cropper} this
         */
        setAspectRatio: function setAspectRatio(aspectRatio) {
            var options = this.options;


            if (!this.disabled && !isUndefined(aspectRatio)) {
                // 0 -> NaN
                options.aspectRatio = Math.max(0, aspectRatio) || NaN;

                if (this.ready) {
                    this.initCropBox();

                    if (this.cropped) {
                        this.renderCropBox();
                    }
                }
            }

            return this;
        },


        /**
         * Change the drag mode.
         * @param {string} mode - The new drag mode.
         * @returns {Cropper} this
         */
        setDragMode: function setDragMode(mode) {
            var options = this.options,
                dragBox = this.dragBox,
                face = this.face;


            if (this.ready && !this.disabled) {
                var croppable = mode === DRAG_MODE_CROP;
                var movable = options.movable && mode === DRAG_MODE_MOVE;

                mode = croppable || movable ? mode : DRAG_MODE_NONE;

                options.dragMode = mode;
                setData(dragBox, DATA_ACTION, mode);
                toggleClass(dragBox, CLASS_CROP, croppable);
                toggleClass(dragBox, CLASS_MOVE, movable);

                if (!options.cropBoxMovable) {
                    // Sync drag mode to crop box when it is not movable
                    setData(face, DATA_ACTION, mode);
                    toggleClass(face, CLASS_CROP, croppable);
                    toggleClass(face, CLASS_MOVE, movable);
                }
            }

            return this;
        }
    };

    var AnotherCropper = WINDOW.Cropper;

    var Cropper = function () {
        /**
         * Create a new Cropper.
         * @param {Element} element - The target element for cropping.
         * @param {Object} [options={}] - The configuration options.
         */
        function Cropper(element) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            classCallCheck(this, Cropper);

            if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
                throw new Error('The first argument is required and must be an <img> or <canvas> element.');
            }

            this.element = element;
            this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
            this.cropped = false;
            this.disabled = false;
            this.pointers = {};
            this.ready = false;
            this.reloading = false;
            this.replaced = false;
            this.sized = false;
            this.sizing = false;
            this.init();
        }

        createClass(Cropper, [{
            key: 'init',
            value: function init() {
                var element = this.element;

                var tagName = element.tagName.toLowerCase();
                var url = void 0;

                if (getData(element, NAMESPACE)) {
                    return;
                }

                setData(element, NAMESPACE, this);

                if (tagName === 'img') {
                    this.isImg = true;

                    // e.g.: "img/picture.jpg"
                    url = element.getAttribute('src') || '';
                    this.originalUrl = url;

                    // Stop when it's a blank image
                    if (!url) {
                        return;
                    }

                    // e.g.: "http://example.com/img/picture.jpg"
                    url = element.src;
                } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
                    url = element.toDataURL();
                }

                this.load(url);
            }
        }, {
            key: 'load',
            value: function load(url) {
                var _this = this;

                if (!url) {
                    return;
                }

                this.url = url;
                this.imageData = {};

                var element = this.element,
                    options = this.options;


                if (!options.checkOrientation || !window.ArrayBuffer) {
                    this.clone();
                    return;
                }

                // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
                if (REGEXP_DATA_URL.test(url)) {
                    if (REGEXP_DATA_URL_JPEG.test(url)) {
                        this.read(dataURLToArrayBuffer(url));
                    } else {
                        this.clone();
                    }

                    return;
                }

                var xhr = new XMLHttpRequest();

                this.reloading = true;
                this.xhr = xhr;

                var done = function done() {
                    _this.reloading = false;
                    _this.xhr = null;
                };

                xhr.ontimeout = done;
                xhr.onabort = done;
                xhr.onerror = function () {
                    done();
                    _this.clone();
                };

                xhr.onload = function () {
                    done();
                    _this.read(xhr.response);
                };

                // Bust cache when there is a "crossOrigin" property
                if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
                    url = addTimestamp(url);
                }

                xhr.open('get', url);
                xhr.responseType = 'arraybuffer';
                xhr.withCredentials = element.crossOrigin === 'use-credentials';
                xhr.send();
            }
        }, {
            key: 'read',
            value: function read(arrayBuffer) {
                var options = this.options,
                    imageData = this.imageData;

                var orientation = getOrientation(arrayBuffer);
                var rotate = 0;
                var scaleX = 1;
                var scaleY = 1;

                if (orientation > 1) {
                    this.url = arrayBufferToDataURL(arrayBuffer, 'image/jpeg');

                    var _parseOrientation = parseOrientation(orientation);

                    rotate = _parseOrientation.rotate;
                    scaleX = _parseOrientation.scaleX;
                    scaleY = _parseOrientation.scaleY;
                }

                if (options.rotatable) {
                    imageData.rotate = rotate;
                }

                if (options.scalable) {
                    imageData.scaleX = scaleX;
                    imageData.scaleY = scaleY;
                }

                this.clone();
            }
        }, {
            key: 'clone',
            value: function clone() {
                var element = this.element,
                    url = this.url;

                var crossOrigin = void 0;
                var crossOriginUrl = void 0;

                if (this.options.checkCrossOrigin && isCrossOriginURL(url)) {
                    crossOrigin = element.crossOrigin;


                    if (crossOrigin) {
                        crossOriginUrl = url;
                    } else {
                        crossOrigin = 'anonymous';

                        // Bust cache when there is not a "crossOrigin" property
                        crossOriginUrl = addTimestamp(url);
                    }
                }

                this.crossOrigin = crossOrigin;
                this.crossOriginUrl = crossOriginUrl;

                var image = document.createElement('img');

                if (crossOrigin) {
                    image.crossOrigin = crossOrigin;
                }

                image.src = crossOriginUrl || url;

                var start = this.start.bind(this);
                var stop = this.stop.bind(this);

                this.image = image;
                this.onStart = start;
                this.onStop = stop;

                if (this.isImg) {
                    if (element.complete) {
                        // start asynchronously to keep `this.cropper` is accessible in `ready` event handler.
                        this.timeout = setTimeout(start, 0);
                    } else {
                        addListener(element, EVENT_LOAD, start, {
                            once: true
                        });
                    }
                } else {
                    image.onload = start;
                    image.onerror = stop;
                    addClass(image, CLASS_HIDE);
                    element.parentNode.insertBefore(image, element.nextSibling);
                }
            }
        }, {
            key: 'start',
            value: function start(event) {
                var _this2 = this;

                var image = this.isImg ? this.element : this.image;

                if (event) {
                    image.onload = null;
                    image.onerror = null;
                }

                this.sizing = true;

                var IS_SAFARI = WINDOW.navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(WINDOW.navigator.userAgent);
                var done = function done(naturalWidth, naturalHeight) {
                    assign(_this2.imageData, {
                        naturalWidth: naturalWidth,
                        naturalHeight: naturalHeight,
                        aspectRatio: naturalWidth / naturalHeight
                    });
                    _this2.sizing = false;
                    _this2.sized = true;
                    _this2.build();
                };

                // Modern browsers (except Safari)
                if (image.naturalWidth && !IS_SAFARI) {
                    done(image.naturalWidth, image.naturalHeight);
                    return;
                }

                var sizingImage = document.createElement('img');
                var body = document.body || document.documentElement;

                this.sizingImage = sizingImage;

                sizingImage.onload = function () {
                    done(sizingImage.width, sizingImage.height);

                    if (!IS_SAFARI) {
                        body.removeChild(sizingImage);
                    }
                };

                sizingImage.src = image.src;

                // iOS Safari will convert the image automatically
                // with its orientation once append it into DOM (#279)
                if (!IS_SAFARI) {
                    sizingImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
                    body.appendChild(sizingImage);
                }
            }
        }, {
            key: 'stop',
            value: function stop() {
                var image = this.image;


                image.onload = null;
                image.onerror = null;
                image.parentNode.removeChild(image);
                this.image = null;
            }
        }, {
            key: 'build',
            value: function build() {
                if (!this.sized || this.ready) {
                    return;
                }

                var element = this.element,
                    options = this.options,
                    image = this.image;

                // Create cropper elements

                var container = element.parentNode;
                var template = document.createElement('div');

                template.innerHTML = TEMPLATE;

                var cropper = template.querySelector('.' + NAMESPACE + '-container');
                var canvas = cropper.querySelector('.' + NAMESPACE + '-canvas');
                var dragBox = cropper.querySelector('.' + NAMESPACE + '-drag-box');
                var cropBox = cropper.querySelector('.' + NAMESPACE + '-crop-box');
                var face = cropBox.querySelector('.' + NAMESPACE + '-face');

                this.container = container;
                this.cropper = cropper;
                this.canvas = canvas;
                this.dragBox = dragBox;
                this.cropBox = cropBox;
                this.viewBox = cropper.querySelector('.' + NAMESPACE + '-view-box');
                this.face = face;

                canvas.appendChild(image);

                // Hide the original image
                addClass(element, CLASS_HIDDEN);

                // Inserts the cropper after to the current image
                container.insertBefore(cropper, element.nextSibling);

                // Show the image if is hidden
                if (!this.isImg) {
                    removeClass(image, CLASS_HIDE);
                }

                this.initPreview();
                this.bind();

                options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
                options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;

                addClass(cropBox, CLASS_HIDDEN);

                if (!options.guides) {
                    addClass(cropBox.getElementsByClassName(NAMESPACE + '-dashed'), CLASS_HIDDEN);
                }

                if (!options.center) {
                    addClass(cropBox.getElementsByClassName(NAMESPACE + '-center'), CLASS_HIDDEN);
                }

                if (options.background) {
                    addClass(cropper, NAMESPACE + '-bg');
                }

                if (!options.highlight) {
                    addClass(face, CLASS_INVISIBLE);
                }

                if (options.cropBoxMovable) {
                    addClass(face, CLASS_MOVE);
                    setData(face, DATA_ACTION, ACTION_ALL);
                }

                if (!options.cropBoxResizable) {
                    addClass(cropBox.getElementsByClassName(NAMESPACE + '-line'), CLASS_HIDDEN);
                    addClass(cropBox.getElementsByClassName(NAMESPACE + '-point'), CLASS_HIDDEN);
                }

                this.render();
                this.ready = true;
                this.setDragMode(options.dragMode);

                if (options.autoCrop) {
                    this.crop();
                }

                this.setData(options.data);

                if (isFunction(options.ready)) {
                    addListener(element, EVENT_READY, options.ready, {
                        once: true
                    });
                }

                dispatchEvent(element, EVENT_READY);
            }
        }, {
            key: 'unbuild',
            value: function unbuild() {
                if (!this.ready) {
                    return;
                }

                this.ready = false;
                this.unbind();
                this.resetPreview();
                this.cropper.parentNode.removeChild(this.cropper);
                removeClass(this.element, CLASS_HIDDEN);
            }
        }, {
            key: 'uncreate',
            value: function uncreate() {
                var element = this.element;


                if (this.ready) {
                    this.unbuild();
                    this.ready = false;
                    this.cropped = false;
                } else if (this.sizing) {
                    this.sizingImage.onload = null;
                    this.sizing = false;
                    this.sized = false;
                } else if (this.reloading) {
                    this.xhr.abort();
                } else if (this.isImg) {
                    if (element.complete) {
                        clearTimeout(this.timeout);
                    } else {
                        removeListener(element, EVENT_LOAD, this.onStart);
                    }
                } else if (this.image) {
                    this.stop();
                }
            }

            /**
             * Get the no conflict cropper class.
             * @returns {Cropper} The cropper class.
             */

        }], [{
            key: 'noConflict',
            value: function noConflict() {
                window.Cropper = AnotherCropper;
                return Cropper;
            }

            /**
             * Change the default options.
             * @param {Object} options - The new default options.
             */

        }, {
            key: 'setDefaults',
            value: function setDefaults(options) {
                assign(DEFAULTS, isPlainObject(options) && options);
            }
        }]);
        return Cropper;
    }();

    assign(Cropper.prototype, render, preview, events, handlers, change, methods);

    return Cropper;

})));
/*!
 * jQuery Cropper v1.0.0
 * https://github.com/fengyuanchen/jquery-cropper
 *
 * Copyright (c) 2018 Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2018-04-01T06:20:13.168Z
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery'), require('cropperjs')) :
        typeof define === 'function' && define.amd ? define(['jquery', 'cropperjs'], factory) :
            (factory(global.jQuery, global.Cropper));
}(this, (function ($, Cropper) {
    'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
    Cropper = Cropper && Cropper.hasOwnProperty('default') ? Cropper['default'] : Cropper;

    if ($.fn) {
        var AnotherCropper = $.fn.cropper;
        var NAMESPACE = 'cropper';

        $.fn.cropper = function jQueryCropper(option) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            var result = void 0;

            this.each(function (i, element) {
                var $element = $(element);
                var isDestroy = option === 'destroy';
                var cropper = $element.data(NAMESPACE);

                if (!cropper) {
                    if (isDestroy) {
                        return;
                    }

                    var options = $.extend({}, $element.data(), $.isPlainObject(option) && option);

                    cropper = new Cropper(element, options);
                    $element.data(NAMESPACE, cropper);
                }

                if (typeof option === 'string') {
                    var fn = cropper[option];

                    if ($.isFunction(fn)) {
                        result = fn.apply(cropper, args);

                        if (result === cropper) {
                            result = undefined;
                        }

                        if (isDestroy) {
                            $element.removeData(NAMESPACE);
                        }
                    }
                }
            });

            return result !== undefined ? result : this;
        };

        $.fn.cropper.Constructor = Cropper;
        $.fn.cropper.setDefaults = Cropper.setDefaults;
        $.fn.cropper.noConflict = function noConflict() {
            $.fn.cropper = AnotherCropper;
            return this;
        };
    }

})));

/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function (e, t) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t()
}("undefined" != typeof window ? window : this, function () {
    function e() {
    }

    var t = e.prototype;
    return t.on = function (e, t) {
        if (e && t) {
            var i = this._events = this._events || {}, n = i[e] = i[e] || [];
            return n.indexOf(t) == -1 && n.push(t), this
        }
    }, t.once = function (e, t) {
        if (e && t) {
            this.on(e, t);
            var i = this._onceEvents = this._onceEvents || {}, n = i[e] = i[e] || {};
            return n[t] = !0, this
        }
    }, t.off = function (e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            var n = i.indexOf(t);
            return n != -1 && i.splice(n, 1), this
        }
    }, t.emitEvent = function (e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            i = i.slice(0), t = t || [];
            for (var n = this._onceEvents && this._onceEvents[e], o = 0; o < i.length; o++) {
                var r = i[o], s = n && n[r];
                s && (this.off(e, r), delete n[r]), r.apply(this, t)
            }
            return this
        }
    }, t.allOff = function () {
        delete this._events, delete this._onceEvents
    }, e
}), function (e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (i) {
        return t(e, i)
    }) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.imagesLoaded = t(e, e.EvEmitter)
}("undefined" != typeof window ? window : this, function (e, t) {
    function i(e, t) {
        for (var i in t) e[i] = t[i];
        return e
    }

    function n(e) {
        if (Array.isArray(e)) return e;
        var t = "object" == typeof e && "number" == typeof e.length;
        return t ? d.call(e) : [e]
    }

    function o(e, t, r) {
        if (!(this instanceof o)) return new o(e, t, r);
        var s = e;
        return "string" == typeof e && (s = document.querySelectorAll(e)), s ? (this.elements = n(s), this.options = i({}, this.options), "function" == typeof t ? r = t : i(this.options, t), r && this.on("always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(this.check.bind(this))) : void a.error("Bad element for imagesLoaded " + (s || e))
    }

    function r(e) {
        this.img = e
    }

    function s(e, t) {
        this.url = e, this.element = t, this.img = new Image
    }

    var h = e.jQuery, a = e.console, d = Array.prototype.slice;
    o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function () {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, o.prototype.addElementImages = function (e) {
        "IMG" == e.nodeName && this.addImage(e), this.options.background === !0 && this.addElementBackgroundImages(e);
        var t = e.nodeType;
        if (t && u[t]) {
            for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var o = i[n];
                this.addImage(o)
            }
            if ("string" == typeof this.options.background) {
                var r = e.querySelectorAll(this.options.background);
                for (n = 0; n < r.length; n++) {
                    var s = r[n];
                    this.addElementBackgroundImages(s)
                }
            }
        }
    };
    var u = {1: !0, 9: !0, 11: !0};
    return o.prototype.addElementBackgroundImages = function (e) {
        var t = getComputedStyle(e);
        if (t) for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) {
            var o = n && n[2];
            o && this.addBackground(o, e), n = i.exec(t.backgroundImage)
        }
    }, o.prototype.addImage = function (e) {
        var t = new r(e);
        this.images.push(t)
    }, o.prototype.addBackground = function (e, t) {
        var i = new s(e, t);
        this.images.push(i)
    }, o.prototype.check = function () {
        function e(e, i, n) {
            setTimeout(function () {
                t.progress(e, i, n)
            })
        }

        var t = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function (t) {
            t.once("progress", e), t.check()
        }) : void this.complete()
    }, o.prototype.progress = function (e, t, i) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [this, e, t]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, e, t)
    }, o.prototype.complete = function () {
        var e = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var t = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[t](this)
        }
    }, r.prototype = Object.create(t.prototype), r.prototype.check = function () {
        var e = this.getIsImageComplete();
        return e ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, r.prototype.getIsImageComplete = function () {
        return this.img.complete && this.img.naturalWidth
    }, r.prototype.confirm = function (e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.img, t])
    }, r.prototype.handleEvent = function (e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }, r.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, r.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, r.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype = Object.create(r.prototype), s.prototype.check = function () {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var e = this.getIsImageComplete();
        e && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, s.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype.confirm = function (e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.element, t])
    }, o.makeJQueryPlugin = function (t) {
        t = t || e.jQuery, t && (h = t, h.fn.imagesLoaded = function (e, t) {
            var i = new o(this, e, t);
            return i.jqDeferred.promise(h(this))
        })
    }, o.makeJQueryPlugin(), o
});

/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

!function (t, e) {
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function (i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery)
}(window, function (t, e) {
    "use strict";

    function i(i, s, a) {
        function u(t, e, o) {
            var n, s = "$()." + i + '("' + e + '")';
            return t.each(function (t, u) {
                var h = a.data(u, i);
                if (!h) return void r(i + " not initialized. Cannot call methods, i.e. " + s);
                var d = h[e];
                if (!d || "_" == e.charAt(0)) return void r(s + " is not a valid method");
                var l = d.apply(h, o);
                n = void 0 === n ? l : n
            }), void 0 !== n ? n : t
        }

        function h(t, e) {
            t.each(function (t, o) {
                var n = a.data(o, i);
                n ? (n.option(e), n._init()) : (n = new s(o, e), a.data(o, i, n))
            })
        }

        a = a || e || t.jQuery, a && (s.prototype.option || (s.prototype.option = function (t) {
            a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t))
        }), a.fn[i] = function (t) {
            if ("string" == typeof t) {
                var e = n.call(arguments, 1);
                return u(this, t, e)
            }
            return h(this, t), this
        }, o(a))
    }

    function o(t) {
        !t || t && t.bridget || (t.bridget = i)
    }

    var n = Array.prototype.slice, s = t.console, r = "undefined" == typeof s ? function () {
    } : function (t) {
        s.error(t)
    };
    return o(e || t.jQuery), i
}), function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function () {
    function t() {
    }

    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var i = this._events = this._events || {}, o = i[t] = i[t] || [];
            return o.indexOf(e) == -1 && o.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {}, o = i[t] = i[t] || {};
            return o[e] = !0, this
        }
    }, e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var o = i.indexOf(e);
            return o != -1 && i.splice(o, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            i = i.slice(0), e = e || [];
            for (var o = this._onceEvents && this._onceEvents[t], n = 0; n < i.length; n++) {
                var s = i[n], r = o && o[s];
                r && (this.off(t, s), delete o[s]), s.apply(this, e)
            }
            return this
        }
    }, e.allOff = function () {
        delete this._events, delete this._onceEvents
    }, t
}), function (t, e) {
    "function" == typeof define && define.amd ? define("get-size/get-size", e) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e()
}(window, function () {
    "use strict";

    function t(t) {
        var e = parseFloat(t), i = t.indexOf("%") == -1 && !isNaN(e);
        return i && e
    }

    function e() {
    }

    function i() {
        for (var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        }, e = 0; e < h; e++) {
            var i = u[e];
            t[i] = 0
        }
        return t
    }

    function o(t) {
        var e = getComputedStyle(t);
        return e || a("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"), e
    }

    function n() {
        if (!d) {
            d = !0;
            var e = document.createElement("div");
            e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style.boxSizing = "border-box";
            var i = document.body || document.documentElement;
            i.appendChild(e);
            var n = o(e);
            r = 200 == Math.round(t(n.width)), s.isBoxSizeOuter = r, i.removeChild(e)
        }
    }

    function s(e) {
        if (n(), "string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType) {
            var s = o(e);
            if ("none" == s.display) return i();
            var a = {};
            a.width = e.offsetWidth, a.height = e.offsetHeight;
            for (var d = a.isBorderBox = "border-box" == s.boxSizing, l = 0; l < h; l++) {
                var f = u[l], c = s[f], m = parseFloat(c);
                a[f] = isNaN(m) ? 0 : m
            }
            var p = a.paddingLeft + a.paddingRight, y = a.paddingTop + a.paddingBottom,
                g = a.marginLeft + a.marginRight, v = a.marginTop + a.marginBottom,
                _ = a.borderLeftWidth + a.borderRightWidth, z = a.borderTopWidth + a.borderBottomWidth, I = d && r,
                x = t(s.width);
            x !== !1 && (a.width = x + (I ? 0 : p + _));
            var S = t(s.height);
            return S !== !1 && (a.height = S + (I ? 0 : y + z)), a.innerWidth = a.width - (p + _), a.innerHeight = a.height - (y + z), a.outerWidth = a.width + g, a.outerHeight = a.height + v, a
        }
    }

    var r, a = "undefined" == typeof console ? e : function (t) {
            console.error(t)
        },
        u = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
        h = u.length, d = !1;
    return s
}), function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e()
}(window, function () {
    "use strict";
    var t = function () {
        var t = window.Element.prototype;
        if (t.matches) return "matches";
        if (t.matchesSelector) return "matchesSelector";
        for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var o = e[i], n = o + "MatchesSelector";
            if (t[n]) return n
        }
    }();
    return function (e, i) {
        return e[t](i)
    }
}), function (t, e) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function (i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector)
}(window, function (t, e) {
    var i = {};
    i.extend = function (t, e) {
        for (var i in e) t[i] = e[i];
        return t
    }, i.modulo = function (t, e) {
        return (t % e + e) % e
    };
    var o = Array.prototype.slice;
    i.makeArray = function (t) {
        if (Array.isArray(t)) return t;
        if (null === t || void 0 === t) return [];
        var e = "object" == typeof t && "number" == typeof t.length;
        return e ? o.call(t) : [t]
    }, i.removeFrom = function (t, e) {
        var i = t.indexOf(e);
        i != -1 && t.splice(i, 1)
    }, i.getParent = function (t, i) {
        for (; t.parentNode && t != document.body;) if (t = t.parentNode, e(t, i)) return t
    }, i.getQueryElement = function (t) {
        return "string" == typeof t ? document.querySelector(t) : t
    }, i.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, i.filterFindElements = function (t, o) {
        t = i.makeArray(t);
        var n = [];
        return t.forEach(function (t) {
            if (t instanceof HTMLElement) {
                if (!o) return void n.push(t);
                e(t, o) && n.push(t);
                for (var i = t.querySelectorAll(o), s = 0; s < i.length; s++) n.push(i[s])
            }
        }), n
    }, i.debounceMethod = function (t, e, i) {
        i = i || 100;
        var o = t.prototype[e], n = e + "Timeout";
        t.prototype[e] = function () {
            var t = this[n];
            clearTimeout(t);
            var e = arguments, s = this;
            this[n] = setTimeout(function () {
                o.apply(s, e), delete s[n]
            }, i)
        }
    }, i.docReady = function (t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e ? setTimeout(t) : document.addEventListener("DOMContentLoaded", t)
    }, i.toDashed = function (t) {
        return t.replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + "-" + i
        }).toLowerCase()
    };
    var n = t.console;
    return i.htmlInit = function (e, o) {
        i.docReady(function () {
            var s = i.toDashed(o), r = "data-" + s, a = document.querySelectorAll("[" + r + "]"),
                u = document.querySelectorAll(".js-" + s), h = i.makeArray(a).concat(i.makeArray(u)),
                d = r + "-options", l = t.jQuery;
            h.forEach(function (t) {
                var i, s = t.getAttribute(r) || t.getAttribute(d);
                try {
                    i = s && JSON.parse(s)
                } catch (a) {
                    return void(n && n.error("Error parsing " + r + " on " + t.className + ": " + a))
                }
                var u = new e(t, i);
                l && l.data(t, o, u)
            })
        })
    }, i
}), function (t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, t.Outlayer.Item = e(t.EvEmitter, t.getSize))
}(window, function (t, e) {
    "use strict";

    function i(t) {
        for (var e in t) return !1;
        return e = null, !0
    }

    function o(t, e) {
        t && (this.element = t, this.layout = e, this.position = {x: 0, y: 0}, this._create())
    }

    function n(t) {
        return t.replace(/([A-Z])/g, function (t) {
            return "-" + t.toLowerCase()
        })
    }

    var s = document.documentElement.style, r = "string" == typeof s.transition ? "transition" : "WebkitTransition",
        a = "string" == typeof s.transform ? "transform" : "WebkitTransform",
        u = {WebkitTransition: "webkitTransitionEnd", transition: "transitionend"}[r], h = {
            transform: a,
            transition: r,
            transitionDuration: r + "Duration",
            transitionProperty: r + "Property",
            transitionDelay: r + "Delay"
        }, d = o.prototype = Object.create(t.prototype);
    d.constructor = o, d._create = function () {
        this._transn = {ingProperties: {}, clean: {}, onEnd: {}}, this.css({position: "absolute"})
    }, d.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, d.getSize = function () {
        this.size = e(this.element)
    }, d.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
            var o = h[i] || i;
            e[o] = t[i]
        }
    }, d.getPosition = function () {
        var t = getComputedStyle(this.element), e = this.layout._getOption("originLeft"),
            i = this.layout._getOption("originTop"), o = t[e ? "left" : "right"], n = t[i ? "top" : "bottom"],
            s = parseFloat(o), r = parseFloat(n), a = this.layout.size;
        o.indexOf("%") != -1 && (s = s / 100 * a.width), n.indexOf("%") != -1 && (r = r / 100 * a.height), s = isNaN(s) ? 0 : s, r = isNaN(r) ? 0 : r, s -= e ? a.paddingLeft : a.paddingRight, r -= i ? a.paddingTop : a.paddingBottom, this.position.x = s, this.position.y = r
    }, d.layoutPosition = function () {
        var t = this.layout.size, e = {}, i = this.layout._getOption("originLeft"),
            o = this.layout._getOption("originTop"), n = i ? "paddingLeft" : "paddingRight", s = i ? "left" : "right",
            r = i ? "right" : "left", a = this.position.x + t[n];
        e[s] = this.getXValue(a), e[r] = "";
        var u = o ? "paddingTop" : "paddingBottom", h = o ? "top" : "bottom", d = o ? "bottom" : "top",
            l = this.position.y + t[u];
        e[h] = this.getYValue(l), e[d] = "", this.css(e), this.emitEvent("layout", [this])
    }, d.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px"
    }, d.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px"
    }, d._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x, o = this.position.y, n = t == this.position.x && e == this.position.y;
        if (this.setPosition(t, e), n && !this.isTransitioning) return void this.layoutPosition();
        var s = t - i, r = e - o, a = {};
        a.transform = this.getTranslate(s, r), this.transition({
            to: a,
            onTransitionEnd: {transform: this.layoutPosition},
            isCleaning: !0
        })
    }, d.getTranslate = function (t, e) {
        var i = this.layout._getOption("originLeft"), o = this.layout._getOption("originTop");
        return t = i ? t : -t, e = o ? e : -e, "translate3d(" + t + "px, " + e + "px, 0)"
    }, d.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition()
    }, d.moveTo = d._transitionTo, d.setPosition = function (t, e) {
        this.position.x = parseFloat(t), this.position.y = parseFloat(e)
    }, d._nonTransition = function (t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this)
    }, d.transition = function (t) {
        if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
            this.css(t.from);
            var o = this.element.offsetHeight;
            o = null
        }
        this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
    };
    var l = "opacity," + n(a);
    d.enableTransition = function () {
        if (!this.isTransitioning) {
            var t = this.layout.options.transitionDuration;
            t = "number" == typeof t ? t + "ms" : t, this.css({
                transitionProperty: l,
                transitionDuration: t,
                transitionDelay: this.staggerDelay || 0
            }), this.element.addEventListener(u, this, !1)
        }
    }, d.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t)
    }, d.onotransitionend = function (t) {
        this.ontransitionend(t)
    };
    var f = {"-webkit-transform": "transform"};
    d.ontransitionend = function (t) {
        if (t.target === this.element) {
            var e = this._transn, o = f[t.propertyName] || t.propertyName;
            if (delete e.ingProperties[o], i(e.ingProperties) && this.disableTransition(), o in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[o]), o in e.onEnd) {
                var n = e.onEnd[o];
                n.call(this), delete e.onEnd[o]
            }
            this.emitEvent("transitionEnd", [this])
        }
    }, d.disableTransition = function () {
        this.removeTransitionStyles(), this.element.removeEventListener(u, this, !1), this.isTransitioning = !1
    }, d._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e)
    };
    var c = {transitionProperty: "", transitionDuration: "", transitionDelay: ""};
    return d.removeTransitionStyles = function () {
        this.css(c)
    }, d.stagger = function (t) {
        t = isNaN(t) ? 0 : t, this.staggerDelay = t + "ms"
    }, d.removeElem = function () {
        this.element.parentNode.removeChild(this.element), this.css({display: ""}), this.emitEvent("remove", [this])
    }, d.remove = function () {
        return r && parseFloat(this.layout.options.transitionDuration) ? (this.once("transitionEnd", function () {
            this.removeElem()
        }), void this.hide()) : void this.removeElem()
    }, d.reveal = function () {
        delete this.isHidden, this.css({display: ""});
        var t = this.layout.options, e = {}, i = this.getHideRevealTransitionEndProperty("visibleStyle");
        e[i] = this.onRevealTransitionEnd, this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, d.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal")
    }, d.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i
    }, d.hide = function () {
        this.isHidden = !0, this.css({display: ""});
        var t = this.layout.options, e = {}, i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        e[i] = this.onHideTransitionEnd, this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, d.onHideTransitionEnd = function () {
        this.isHidden && (this.css({display: "none"}), this.emitEvent("hide"))
    }, d.destroy = function () {
        this.css({position: "", left: "", right: "", top: "", bottom: "", transition: "", transform: ""})
    }, o
}), function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function (i, o, n, s) {
        return e(t, i, o, n, s)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item)
}(window, function (t, e, i, o, n) {
    "use strict";

    function s(t, e) {
        var i = o.getQueryElement(t);
        if (!i) return void(u && u.error("Bad element for " + this.constructor.namespace + ": " + (i || t)));
        this.element = i, h && (this.$element = h(this.element)), this.options = o.extend({}, this.constructor.defaults), this.option(e);
        var n = ++l;
        this.element.outlayerGUID = n, f[n] = this, this._create();
        var s = this._getOption("initLayout");
        s && this.layout()
    }

    function r(t) {
        function e() {
            t.apply(this, arguments)
        }

        return e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e
    }

    function a(t) {
        if ("number" == typeof t) return t;
        var e = t.match(/(^\d*\.?\d*)(\w*)/), i = e && e[1], o = e && e[2];
        if (!i.length) return 0;
        i = parseFloat(i);
        var n = m[o] || 1;
        return i * n
    }

    var u = t.console, h = t.jQuery, d = function () {
    }, l = 0, f = {};
    s.namespace = "outlayer", s.Item = n, s.defaults = {
        containerStyle: {position: "relative"},
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {opacity: 0, transform: "scale(0.001)"},
        visibleStyle: {opacity: 1, transform: "scale(1)"}
    };
    var c = s.prototype;
    o.extend(c, e.prototype), c.option = function (t) {
        o.extend(this.options, t)
    }, c._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e] ? this.options[e] : this.options[t]
    }, s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    }, c._create = function () {
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), o.extend(this.element.style, this.options.containerStyle);
        var t = this._getOption("resize");
        t && this.bindResize()
    }, c.reloadItems = function () {
        this.items = this._itemize(this.element.children)
    }, c._itemize = function (t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, o = [], n = 0; n < e.length; n++) {
            var s = e[n], r = new i(s, this);
            o.push(r)
        }
        return o
    }, c._filterFindItemElements = function (t) {
        return o.filterFindElements(t, this.options.itemSelector)
    }, c.getItemElements = function () {
        return this.items.map(function (t) {
            return t.element
        })
    }, c.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"), e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), this._isLayoutInited = !0
    }, c._init = c.layout, c._resetLayout = function () {
        this.getSize()
    }, c.getSize = function () {
        this.size = i(this.element)
    }, c._getMeasurement = function (t, e) {
        var o, n = this.options[t];
        n ? ("string" == typeof n ? o = this.element.querySelector(n) : n instanceof HTMLElement && (o = n), this[t] = o ? i(o)[e] : n) : this[t] = 0
    }, c.layoutItems = function (t, e) {
        t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
    }, c._getItemsForLayout = function (t) {
        return t.filter(function (t) {
            return !t.isIgnored
        })
    }, c._layoutItems = function (t, e) {
        if (this._emitCompleteOnItems("layout", t), t && t.length) {
            var i = [];
            t.forEach(function (t) {
                var o = this._getItemLayoutPosition(t);
                o.item = t, o.isInstant = e || t.isLayoutInstant, i.push(o)
            }, this), this._processLayoutQueue(i)
        }
    }, c._getItemLayoutPosition = function () {
        return {x: 0, y: 0}
    }, c._processLayoutQueue = function (t) {
        this.updateStagger(), t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e)
        }, this)
    }, c.updateStagger = function () {
        var t = this.options.stagger;
        return null === t || void 0 === t ? void(this.stagger = 0) : (this.stagger = a(t), this.stagger)
    }, c._positionItem = function (t, e, i, o, n) {
        o ? t.goTo(e, i) : (t.stagger(n * this.stagger), t.moveTo(e, i))
    }, c._postLayout = function () {
        this.resizeContainer()
    }, c.resizeContainer = function () {
        var t = this._getOption("resizeContainer");
        if (t) {
            var e = this._getContainerSize();
            e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1))
        }
    }, c._getContainerSize = d, c._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
        }
    }, c._emitCompleteOnItems = function (t, e) {
        function i() {
            n.dispatchEvent(t + "Complete", null, [e])
        }

        function o() {
            r++, r == s && i()
        }

        var n = this, s = e.length;
        if (!e || !s) return void i();
        var r = 0;
        e.forEach(function (e) {
            e.once(t, o)
        })
    }, c.dispatchEvent = function (t, e, i) {
        var o = e ? [e].concat(i) : i;
        if (this.emitEvent(t, o), h) if (this.$element = this.$element || h(this.element), e) {
            var n = h.Event(e);
            n.type = t, this.$element.trigger(n, i)
        } else this.$element.trigger(t, i)
    }, c.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }, c.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }, c.stamp = function (t) {
        t = this._find(t), t && (this.stamps = this.stamps.concat(t), t.forEach(this.ignore, this))
    }, c.unstamp = function (t) {
        t = this._find(t), t && t.forEach(function (t) {
            o.removeFrom(this.stamps, t), this.unignore(t)
        }, this)
    }, c._find = function (t) {
        if (t) return "string" == typeof t && (t = this.element.querySelectorAll(t)), t = o.makeArray(t)
    }, c._manageStamps = function () {
        this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this))
    }, c._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(), e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        }
    }, c._manageStamp = d, c._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(), o = this._boundingRect, n = i(t), s = {
            left: e.left - o.left - n.marginLeft,
            top: e.top - o.top - n.marginTop,
            right: o.right - e.right - n.marginRight,
            bottom: o.bottom - e.bottom - n.marginBottom
        };
        return s
    }, c.handleEvent = o.handleEvent, c.bindResize = function () {
        t.addEventListener("resize", this), this.isResizeBound = !0
    }, c.unbindResize = function () {
        t.removeEventListener("resize", this), this.isResizeBound = !1
    }, c.onresize = function () {
        this.resize()
    }, o.debounceMethod(s, "onresize", 100), c.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    }, c.needsResizeLayout = function () {
        var t = i(this.element), e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth
    }, c.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e
    }, c.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e))
    }, c.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
        }
    }, c.reveal = function (t) {
        if (this._emitCompleteOnItems("reveal", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function (t, i) {
                t.stagger(i * e), t.reveal()
            })
        }
    }, c.hide = function (t) {
        if (this._emitCompleteOnItems("hide", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function (t, i) {
                t.stagger(i * e), t.hide()
            })
        }
    }, c.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e)
    }, c.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e)
    }, c.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
            var i = this.items[e];
            if (i.element == t) return i
        }
    }, c.getItems = function (t) {
        t = o.makeArray(t);
        var e = [];
        return t.forEach(function (t) {
            var i = this.getItem(t);
            i && e.push(i)
        }, this), e
    }, c.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e), e && e.length && e.forEach(function (t) {
            t.remove(), o.removeFrom(this.items, t)
        }, this)
    }, c.destroy = function () {
        var t = this.element.style;
        t.height = "", t.position = "", t.width = "", this.items.forEach(function (t) {
            t.destroy()
        }), this.unbindResize();
        var e = this.element.outlayerGUID;
        delete f[e], delete this.element.outlayerGUID, h && h.removeData(this.element, this.constructor.namespace)
    }, s.data = function (t) {
        t = o.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && f[e]
    }, s.create = function (t, e) {
        var i = r(s);
        return i.defaults = o.extend({}, s.defaults), o.extend(i.defaults, e), i.compatOptions = o.extend({}, s.compatOptions), i.namespace = t, i.data = s.data, i.Item = r(n), o.htmlInit(i, t), h && h.bridget && h.bridget(t, i), i
    };
    var m = {ms: 1, s: 1e3};
    return s.Item = n, s
}), function (t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/item", ["outlayer/outlayer"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer")) : (t.Isotope = t.Isotope || {}, t.Isotope.Item = e(t.Outlayer))
}(window, function (t) {
    "use strict";

    function e() {
        t.Item.apply(this, arguments)
    }

    var i = e.prototype = Object.create(t.Item.prototype), o = i._create;
    i._create = function () {
        this.id = this.layout.itemGUID++, o.call(this), this.sortData = {}
    }, i.updateSortData = function () {
        if (!this.isIgnored) {
            this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
            var t = this.layout.options.getSortData, e = this.layout._sorters;
            for (var i in t) {
                var o = e[i];
                this.sortData[i] = o(this.element, this)
            }
        }
    };
    var n = i.destroy;
    return i.destroy = function () {
        n.apply(this, arguments), this.css({display: ""})
    }, e
}), function (t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], e) : "object" == typeof module && module.exports ? module.exports = e(require("get-size"), require("outlayer")) : (t.Isotope = t.Isotope || {}, t.Isotope.LayoutMode = e(t.getSize, t.Outlayer))
}(window, function (t, e) {
    "use strict";

    function i(t) {
        this.isotope = t, t && (this.options = t.options[this.namespace], this.element = t.element, this.items = t.filteredItems, this.size = t.size)
    }

    var o = i.prototype,
        n = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout", "_getOption"];
    return n.forEach(function (t) {
        o[t] = function () {
            return e.prototype[t].apply(this.isotope, arguments)
        }
    }), o.needsVerticalResizeLayout = function () {
        var e = t(this.isotope.element), i = this.isotope.size && e;
        return i && e.innerHeight != this.isotope.size.innerHeight
    }, o._getMeasurement = function () {
        this.isotope._getMeasurement.apply(this, arguments)
    }, o.getColumnWidth = function () {
        this.getSegmentSize("column", "Width")
    }, o.getRowHeight = function () {
        this.getSegmentSize("row", "Height")
    }, o.getSegmentSize = function (t, e) {
        var i = t + e, o = "outer" + e;
        if (this._getMeasurement(i, o), !this[i]) {
            var n = this.getFirstItemSize();
            this[i] = n && n[o] || this.isotope.size["inner" + e]
        }
    }, o.getFirstItemSize = function () {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element)
    }, o.layout = function () {
        this.isotope.layout.apply(this.isotope, arguments)
    }, o.getSize = function () {
        this.isotope.getSize(), this.size = this.isotope.size
    }, i.modes = {}, i.create = function (t, e) {
        function n() {
            i.apply(this, arguments)
        }

        return n.prototype = Object.create(o), n.prototype.constructor = n, e && (n.options = e), n.prototype.namespace = t, i.modes[t] = n, n
    }, i
}), function (t, e) {
    "function" == typeof define && define.amd ? define("masonry-layout/masonry", ["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
}(window, function (t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var o = i.prototype;
    return o._resetLayout = function () {
        this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(), this.colYs = [];
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        this.maxY = 0, this.horizontalColIndex = 0
    }, o.measureColumns = function () {
        if (this.getContainerWidth(), !this.columnWidth) {
            var t = this.items[0], i = t && t.element;
            this.columnWidth = i && e(i).outerWidth || this.containerWidth
        }
        var o = this.columnWidth += this.gutter, n = this.containerWidth + this.gutter, s = n / o, r = o - n % o,
            a = r && r < 1 ? "round" : "floor";
        s = Math[a](s), this.cols = Math.max(s, 1)
    }, o.getContainerWidth = function () {
        var t = this._getOption("fitWidth"), i = t ? this.element.parentNode : this.element, o = e(i);
        this.containerWidth = o && o.innerWidth
    }, o._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth, i = e && e < 1 ? "round" : "ceil",
            o = Math[i](t.size.outerWidth / this.columnWidth);
        o = Math.min(o, this.cols);
        for (var n = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition", s = this[n](o, t), r = {
            x: this.columnWidth * s.col,
            y: s.y
        }, a = s.y + t.size.outerHeight, u = o + s.col, h = s.col; h < u; h++) this.colYs[h] = a;
        return r
    }, o._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t), i = Math.min.apply(Math, e);
        return {col: e.indexOf(i), y: i}
    }, o._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, o = 0; o < i; o++) e[o] = this._getColGroupY(o, t);
        return e
    }, o._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i)
    }, o._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols, o = t > 1 && i + t > this.cols;
        i = o ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return this.horizontalColIndex = n ? i + t : this.horizontalColIndex, {col: i, y: this._getColGroupY(i, t)}
    }, o._manageStamp = function (t) {
        var i = e(t), o = this._getElementOffset(t), n = this._getOption("originLeft"), s = n ? o.left : o.right,
            r = s + i.outerWidth, a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var u = Math.floor(r / this.columnWidth);
        u -= r % this.columnWidth ? 0 : 1, u = Math.min(this.cols - 1, u);
        for (var h = this._getOption("originTop"), d = (h ? o.top : o.bottom) + i.outerHeight, l = a; l <= u; l++) this.colYs[l] = Math.max(d, this.colYs[l])
    }, o._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {height: this.maxY};
        return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()), t
    }, o._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
        return (this.cols - t) * this.columnWidth - this.gutter
    }, o.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth
    }, i
}), function (t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-modes/masonry", ["../layout-mode", "masonry-layout/masonry"], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode"), require("masonry-layout")) : e(t.Isotope.LayoutMode, t.Masonry)
}(window, function (t, e) {
    "use strict";
    var i = t.create("masonry"), o = i.prototype, n = {_getElementOffset: !0, layout: !0, _getMeasurement: !0};
    for (var s in e.prototype) n[s] || (o[s] = e.prototype[s]);
    var r = o.measureColumns;
    o.measureColumns = function () {
        this.items = this.isotope.filteredItems, r.call(this)
    };
    var a = o._getOption;
    return o._getOption = function (t) {
        return "fitWidth" == t ? void 0 !== this.options.isFitWidth ? this.options.isFitWidth : this.options.fitWidth : a.apply(this.isotope, arguments)
    }, i
}), function (t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-modes/fit-rows", ["../layout-mode"], e) : "object" == typeof exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode)
}(window, function (t) {
    "use strict";
    var e = t.create("fitRows"), i = e.prototype;
    return i._resetLayout = function () {
        this.x = 0, this.y = 0, this.maxY = 0, this._getMeasurement("gutter", "outerWidth")
    }, i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter, i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && (this.x = 0, this.y = this.maxY);
        var o = {x: this.x, y: this.y};
        return this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight), this.x += e, o
    }, i._getContainerSize = function () {
        return {height: this.maxY}
    }, e
}), function (t, e) {
    "function" == typeof define && define.amd ? define("isotope-layout/js/layout-modes/vertical", ["../layout-mode"], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode)
}(window, function (t) {
    "use strict";
    var e = t.create("vertical", {horizontalAlignment: 0}), i = e.prototype;
    return i._resetLayout = function () {
        this.y = 0
    }, i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = (this.isotope.size.innerWidth - t.size.outerWidth) * this.options.horizontalAlignment, i = this.y;
        return this.y += t.size.outerHeight, {x: e, y: i}
    }, i._getContainerSize = function () {
        return {height: this.y}
    }, e
}), function (t, e) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "desandro-matches-selector/matches-selector", "fizzy-ui-utils/utils", "isotope-layout/js/item", "isotope-layout/js/layout-mode", "isotope-layout/js/layout-modes/masonry", "isotope-layout/js/layout-modes/fit-rows", "isotope-layout/js/layout-modes/vertical"], function (i, o, n, s, r, a) {
        return e(t, i, o, n, s, r, a)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("fizzy-ui-utils"), require("isotope-layout/js/item"), require("isotope-layout/js/layout-mode"), require("isotope-layout/js/layout-modes/masonry"), require("isotope-layout/js/layout-modes/fit-rows"), require("isotope-layout/js/layout-modes/vertical")) : t.Isotope = e(t, t.Outlayer, t.getSize, t.matchesSelector, t.fizzyUIUtils, t.Isotope.Item, t.Isotope.LayoutMode)
}(window, function (t, e, i, o, n, s, r) {
    function a(t, e) {
        return function (i, o) {
            for (var n = 0; n < t.length; n++) {
                var s = t[n], r = i.sortData[s], a = o.sortData[s];
                if (r > a || r < a) {
                    var u = void 0 !== e[s] ? e[s] : e, h = u ? 1 : -1;
                    return (r > a ? 1 : -1) * h
                }
            }
            return 0
        }
    }

    var u = t.jQuery, h = String.prototype.trim ? function (t) {
        return t.trim()
    } : function (t) {
        return t.replace(/^\s+|\s+$/g, "")
    }, d = e.create("isotope", {layoutMode: "masonry", isJQueryFiltering: !0, sortAscending: !0});
    d.Item = s, d.LayoutMode = r;
    var l = d.prototype;
    l._create = function () {
        this.itemGUID = 0, this._sorters = {}, this._getSorters(), e.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
        for (var t in r.modes) this._initLayoutMode(t)
    }, l.reloadItems = function () {
        this.itemGUID = 0, e.prototype.reloadItems.call(this)
    }, l._itemize = function () {
        for (var t = e.prototype._itemize.apply(this, arguments), i = 0; i < t.length; i++) {
            var o = t[i];
            o.id = this.itemGUID++
        }
        return this._updateItemsSortData(t), t
    }, l._initLayoutMode = function (t) {
        var e = r.modes[t], i = this.options[t] || {};
        this.options[t] = e.options ? n.extend(e.options, i) : i, this.modes[t] = new e(this)
    }, l.layout = function () {
        return !this._isLayoutInited && this._getOption("initLayout") ? void this.arrange() : void this._layout()
    }, l._layout = function () {
        var t = this._getIsInstant();
        this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, t), this._isLayoutInited = !0
    }, l.arrange = function (t) {
        this.option(t), this._getIsInstant();
        var e = this._filter(this.items);
        this.filteredItems = e.matches, this._bindArrangeComplete(), this._isInstant ? this._noTransition(this._hideReveal, [e]) : this._hideReveal(e), this._sort(), this._layout()
    }, l._init = l.arrange, l._hideReveal = function (t) {
        this.reveal(t.needReveal), this.hide(t.needHide)
    }, l._getIsInstant = function () {
        var t = this._getOption("layoutInstant"), e = void 0 !== t ? t : !this._isLayoutInited;
        return this._isInstant = e, e
    }, l._bindArrangeComplete = function () {
        function t() {
            e && i && o && n.dispatchEvent("arrangeComplete", null, [n.filteredItems])
        }

        var e, i, o, n = this;
        this.once("layoutComplete", function () {
            e = !0, t()
        }), this.once("hideComplete", function () {
            i = !0, t()
        }), this.once("revealComplete", function () {
            o = !0, t()
        })
    }, l._filter = function (t) {
        var e = this.options.filter;
        e = e || "*";
        for (var i = [], o = [], n = [], s = this._getFilterTest(e), r = 0; r < t.length; r++) {
            var a = t[r];
            if (!a.isIgnored) {
                var u = s(a);
                u && i.push(a), u && a.isHidden ? o.push(a) : u || a.isHidden || n.push(a)
            }
        }
        return {matches: i, needReveal: o, needHide: n}
    }, l._getFilterTest = function (t) {
        return u && this.options.isJQueryFiltering ? function (e) {
            return u(e.element).is(t);
        } : "function" == typeof t ? function (e) {
            return t(e.element)
        } : function (e) {
            return o(e.element, t)
        }
    }, l.updateSortData = function (t) {
        var e;
        t ? (t = n.makeArray(t), e = this.getItems(t)) : e = this.items, this._getSorters(), this._updateItemsSortData(e)
    }, l._getSorters = function () {
        var t = this.options.getSortData;
        for (var e in t) {
            var i = t[e];
            this._sorters[e] = f(i)
        }
    }, l._updateItemsSortData = function (t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
            var o = t[i];
            o.updateSortData()
        }
    };
    var f = function () {
        function t(t) {
            if ("string" != typeof t) return t;
            var i = h(t).split(" "), o = i[0], n = o.match(/^\[(.+)\]$/), s = n && n[1], r = e(s, o),
                a = d.sortDataParsers[i[1]];
            return t = a ? function (t) {
                return t && a(r(t))
            } : function (t) {
                return t && r(t)
            }
        }

        function e(t, e) {
            return t ? function (e) {
                return e.getAttribute(t)
            } : function (t) {
                var i = t.querySelector(e);
                return i && i.textContent
            }
        }

        return t
    }();
    d.sortDataParsers = {
        parseInt: function (t) {
            return parseInt(t, 10)
        }, parseFloat: function (t) {
            return parseFloat(t)
        }
    }, l._sort = function () {
        if (this.options.sortBy) {
            var t = n.makeArray(this.options.sortBy);
            this._getIsSameSortBy(t) || (this.sortHistory = t.concat(this.sortHistory));
            var e = a(this.sortHistory, this.options.sortAscending);
            this.filteredItems.sort(e)
        }
    }, l._getIsSameSortBy = function (t) {
        for (var e = 0; e < t.length; e++) if (t[e] != this.sortHistory[e]) return !1;
        return !0
    }, l._mode = function () {
        var t = this.options.layoutMode, e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return e.options = this.options[t], e
    }, l._resetLayout = function () {
        e.prototype._resetLayout.call(this), this._mode()._resetLayout()
    }, l._getItemLayoutPosition = function (t) {
        return this._mode()._getItemLayoutPosition(t)
    }, l._manageStamp = function (t) {
        this._mode()._manageStamp(t)
    }, l._getContainerSize = function () {
        return this._mode()._getContainerSize()
    }, l.needsResizeLayout = function () {
        return this._mode().needsResizeLayout()
    }, l.appended = function (t) {
        var e = this.addItems(t);
        if (e.length) {
            var i = this._filterRevealAdded(e);
            this.filteredItems = this.filteredItems.concat(i)
        }
    }, l.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
            this._resetLayout(), this._manageStamps();
            var i = this._filterRevealAdded(e);
            this.layoutItems(this.filteredItems), this.filteredItems = i.concat(this.filteredItems), this.items = e.concat(this.items)
        }
    }, l._filterRevealAdded = function (t) {
        var e = this._filter(t);
        return this.hide(e.needHide), this.reveal(e.matches), this.layoutItems(e.matches, !0), e.matches
    }, l.insert = function (t) {
        var e = this.addItems(t);
        if (e.length) {
            var i, o, n = e.length;
            for (i = 0; i < n; i++) o = e[i], this.element.appendChild(o.element);
            var s = this._filter(e).matches;
            for (i = 0; i < n; i++) e[i].isLayoutInstant = !0;
            for (this.arrange(), i = 0; i < n; i++) delete e[i].isLayoutInstant;
            this.reveal(s)
        }
    };
    var c = l.remove;
    return l.remove = function (t) {
        t = n.makeArray(t);
        var e = this.getItems(t);
        c.call(this, t);
        for (var i = e && e.length, o = 0; i && o < i; o++) {
            var s = e[o];
            n.removeFrom(this.filteredItems, s)
        }
    }, l.shuffle = function () {
        for (var t = 0; t < this.items.length; t++) {
            var e = this.items[t];
            e.sortData.random = Math.random()
        }
        this.options.sortBy = "random", this._sort(), this._layout()
    }, l._noTransition = function (t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var o = t.apply(this, e);
        return this.options.transitionDuration = i, o
    }, l.getFilteredItemElements = function () {
        return this.filteredItems.map(function (t) {
            return t.element
        })
    }, d
});


/*!
 * fullPage 2.9.7
 * https://github.com/alvarotrigo/fullPage.js
 * @license MIT licensed
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
(function (global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports === "object" && exports) {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function ($, window, document, Math, undefined) {
    'use strict';

    // keeping central set of classnames and selectors
    var WRAPPER = 'fullpage-wrapper';
    var WRAPPER_SEL = '.' + WRAPPER;

    // slimscroll
    var SCROLLABLE = 'fp-scrollable';
    var SCROLLABLE_SEL = '.' + SCROLLABLE;

    // util
    var RESPONSIVE = 'fp-responsive';
    var NO_TRANSITION = 'fp-notransition';
    var DESTROYED = 'fp-destroyed';
    var ENABLED = 'fp-enabled';
    var VIEWING_PREFIX = 'fp-viewing';
    var ACTIVE = 'active';
    var ACTIVE_SEL = '.' + ACTIVE;
    var COMPLETELY = 'fp-completely';
    var COMPLETELY_SEL = '.' + COMPLETELY;

    // section
    var SECTION_DEFAULT_SEL = '.section';
    var SECTION = 'fp-section';
    var SECTION_SEL = '.' + SECTION;
    var SECTION_ACTIVE_SEL = SECTION_SEL + ACTIVE_SEL;
    var SECTION_FIRST_SEL = SECTION_SEL + ':first';
    var SECTION_LAST_SEL = SECTION_SEL + ':last';
    var TABLE_CELL = 'fp-tableCell';
    var TABLE_CELL_SEL = '.' + TABLE_CELL;
    var AUTO_HEIGHT = 'fp-auto-height';
    var AUTO_HEIGHT_SEL = '.fp-auto-height';
    var NORMAL_SCROLL = 'fp-normal-scroll';
    var NORMAL_SCROLL_SEL = '.fp-normal-scroll';

    // section nav
    var SECTION_NAV = 'fp-nav';
    var SECTION_NAV_SEL = '#' + SECTION_NAV;
    var SECTION_NAV_TOOLTIP = 'fp-tooltip';
    var SECTION_NAV_TOOLTIP_SEL = '.' + SECTION_NAV_TOOLTIP;
    var SHOW_ACTIVE_TOOLTIP = 'fp-show-active';

    // slide
    var SLIDE_DEFAULT_SEL = '.slide';
    var SLIDE = 'fp-slide';
    var SLIDE_SEL = '.' + SLIDE;
    var SLIDE_ACTIVE_SEL = SLIDE_SEL + ACTIVE_SEL;
    var SLIDES_WRAPPER = 'fp-slides';
    var SLIDES_WRAPPER_SEL = '.' + SLIDES_WRAPPER;
    var SLIDES_CONTAINER = 'fp-slidesContainer';
    var SLIDES_CONTAINER_SEL = '.' + SLIDES_CONTAINER;
    var TABLE = 'fp-table';

    // slide nav
    var SLIDES_NAV = 'fp-slidesNav';
    var SLIDES_NAV_SEL = '.' + SLIDES_NAV;
    var SLIDES_NAV_LINK_SEL = SLIDES_NAV_SEL + ' a';
    var SLIDES_ARROW = 'fp-controlArrow';
    var SLIDES_ARROW_SEL = '.' + SLIDES_ARROW;
    var SLIDES_PREV = 'fp-prev';
    var SLIDES_PREV_SEL = '.' + SLIDES_PREV;
    var SLIDES_ARROW_PREV = SLIDES_ARROW + ' ' + SLIDES_PREV;
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
    var SLIDES_NEXT = 'fp-next';
    var SLIDES_NEXT_SEL = '.' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT = SLIDES_ARROW + ' ' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

    var $window = $(window);
    var $document = $(document);

    $.fn.fullpage = function (options) {
        //only once my friend!
        if ($('html').hasClass(ENABLED)) {
            displayWarnings();
            return;
        }

        // common jQuery objects
        var $htmlBody = $('html, body');
        var $body = $('body');

        var FP = $.fn.fullpage;

        // Creating some defaults, extending them with any options that were provided
        options = $.extend({
            //navigation
            menu: false,
            anchors: [],
            lockAnchors: false,
            navigation: false,
            navigationPosition: 'right',
            navigationTooltips: [],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            scrollBar: false,
            hybrid: false,

            //scrolling
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 1000,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            continuousHorizontal: false,
            scrollHorizontally: false,
            interlockedSlides: false,
            dragAndMove: false,
            offsetSections: false,
            resetSliders: false,
            fadingEffect: false,
            normalScrollElements: null,
            scrollOverflow: false,
            scrollOverflowReset: false,
            scrollOverflowHandler: $.fn.fp_scrolloverflow ? $.fn.fp_scrolloverflow.iscrollHandler : null,
            scrollOverflowOptions: null,
            touchSensitivity: 5,
            normalScrollElementTouchThreshold: 5,
            bigSectionsDestination: null,

            //Accessibility
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,

            //design
            controlArrows: true,
            controlArrowColor: '#fff',
            verticalCentered: true,
            sectionsColor: [],
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            responsive: 0, //backwards compabitility with responsiveWiddth
            responsiveWidth: 0,
            responsiveHeight: 0,
            responsiveSlides: false,
            parallax: false,
            parallaxOptions: {
                type: 'reveal',
                percentage: 62,
                property: 'translate'
            },

            //Custom selectors
            sectionSelector: SECTION_DEFAULT_SEL,
            slideSelector: SLIDE_DEFAULT_SEL,

            //events
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null,
            afterResponsive: null,

            lazyLoading: true
        }, options);

        //flag to avoid very fast sliding for landscape sliders
        var slideMoving = false;

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var container = $(this);
        var windowsHeight = $window.height();
        var isResizing = false;
        var isWindowFocused = true;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var canScroll = true;
        var scrollings = [];
        var controlPressed;
        var startingSection;
        var isScrollAllowed = {};
        isScrollAllowed.m = {'up': true, 'down': true, 'left': true, 'right': true};
        isScrollAllowed.k = $.extend(true, {}, isScrollAllowed.m);
        var MSPointer = getMSPointer();
        var events = {
            touchmove: 'ontouchmove' in window ? 'touchmove' : MSPointer.move,
            touchstart: 'ontouchstart' in window ? 'touchstart' : MSPointer.down
        };
        var scrollBarHandler;

        // taken from https://github.com/udacity/ud891/blob/gh-pages/lesson2-focus/07-modals-and-keyboard-traps/solution/modal.js
        var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

        //timeouts
        var resizeId;
        var afterSectionLoadsId;
        var afterSlideLoadsId;
        var scrollId;
        var scrollId2;
        var keydownId;
        var originals = $.extend(true, {}, options); //deep copy

        displayWarnings();

        //easeInOutCubic animation included in the plugin
        $.extend($.easing, {
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        });

        /**
         * Sets the autoScroll option.
         * It changes the scroll bar visibility and the history of the site as a result.
         */
        function setAutoScrolling(value, type) {
            //removing the transformation
            if (!value) {
                silentScroll(0);
            }

            setVariableState('autoScrolling', value, type);

            var element = $(SECTION_ACTIVE_SEL);

            if (options.autoScrolling && !options.scrollBar) {
                $htmlBody.css({
                    'overflow': 'hidden',
                    'height': '100%'
                });

                setRecordHistory(originals.recordHistory, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });

                if (element.length) {
                    //moving the container up
                    silentScroll(element.position().top);
                }

            } else {
                $htmlBody.css({
                    'overflow': 'visible',
                    'height': 'initial'
                });

                setRecordHistory(false, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': '',
                    'touch-action': ''
                });

                //scrolling the page to the section with no animation
                if (element.length) {
                    $htmlBody.scrollTop(element.position().top);
                }
            }
        }

        /**
         * Defines wheter to record the history for each hash change in the URL.
         */
        function setRecordHistory(value, type) {
            setVariableState('recordHistory', value, type);
        }

        /**
         * Defines the scrolling speed
         */
        function setScrollingSpeed(value, type) {
            setVariableState('scrollingSpeed', value, type);
        }

        /**
         * Sets fitToSection
         */
        function setFitToSection(value, type) {
            setVariableState('fitToSection', value, type);
        }

        /**
         * Sets lockAnchors
         */
        function setLockAnchors(value) {
            options.lockAnchors = value;
        }

        /**
         * Adds or remove the possibility of scrolling through sections by using the mouse wheel or the trackpad.
         */
        function setMouseWheelScrolling(value) {
            if (value) {
                addMouseWheelHandler();
                addMiddleWheelHandler();
            } else {
                removeMouseWheelHandler();
                removeMiddleWheelHandler();
            }
        }

        /**
         * Adds or remove the possibility of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
         * Optionally a second parameter can be used to specify the direction for which the action will be applied.
         *
         * @param directions string containing the direction or directions separated by comma.
         */
        function setAllowScrolling(value, directions) {
            if (typeof directions !== 'undefined') {
                directions = directions.replace(/ /g, '').split(',');

                $.each(directions, function (index, direction) {
                    setIsScrollAllowed(value, direction, 'm');
                });
            }
            else {
                setIsScrollAllowed(value, 'all', 'm');

                if (value) {
                    setMouseWheelScrolling(true);
                    addTouchHandler();
                } else {
                    setMouseWheelScrolling(false);
                    removeTouchHandler();
                }
            }
        }

        /**
         * Adds or remove the possibility of scrolling through sections by using the keyboard arrow keys
         */
        function setKeyboardScrolling(value, directions) {
            if (typeof directions !== 'undefined') {
                directions = directions.replace(/ /g, '').split(',');

                $.each(directions, function (index, direction) {
                    setIsScrollAllowed(value, direction, 'k');
                });
            } else {
                setIsScrollAllowed(value, 'all', 'k');
                options.keyboardScrolling = value;
            }
        }

        /**
         * Moves the page up one section.
         */
        function moveSectionUp() {
            var prev = $(SECTION_ACTIVE_SEL).prev(SECTION_SEL);

            //looping to the bottom if there's no more sections above
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $(SECTION_SEL).last();
            }

            if (prev.length) {
                scrollPage(prev, null, true);
            }
        }

        /**
         * Moves the page down one section.
         */
        function moveSectionDown() {
            var next = $(SECTION_ACTIVE_SEL).next(SECTION_SEL);

            //looping to the top if there's no more sections below
            if (!next.length &&
                (options.loopBottom || options.continuousVertical)) {
                next = $(SECTION_SEL).first();
            }

            if (next.length) {
                scrollPage(next, null, false);
            }
        }

        /**
         * Moves the page to the given section and slide with no animation.
         * Anchors or index positions can be used as params.
         */
        function silentMoveTo(sectionAnchor, slideAnchor) {
            setScrollingSpeed(0, 'internal');
            moveTo(sectionAnchor, slideAnchor);
            setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        /**
         * Moves the page to the given section and slide.
         * Anchors or index positions can be used as params.
         */
        function moveTo(sectionAnchor, slideAnchor) {
            var destiny = getSectionByAnchor(sectionAnchor);

            if (typeof slideAnchor !== 'undefined') {
                scrollPageAndSlide(sectionAnchor, slideAnchor);
            } else if (destiny.length > 0) {
                scrollPage(destiny);
            }
        }

        /**
         * Slides right the slider of the active section.
         * Optional `section` param.
         */
        function moveSlideRight(section) {
            moveSlide('right', section);
        }

        /**
         * Slides left the slider of the active section.
         * Optional `section` param.
         */
        function moveSlideLeft(section) {
            moveSlide('left', section);
        }

        /**
         * When resizing is finished, we adjust the slides sizes and positions
         */
        function reBuild(resizing) {
            if (container.hasClass(DESTROYED)) {
                return;
            }  //nothing to do if the plugin was destroyed

            isResizing = true;

            windowsHeight = $window.height();  //updating global var

            $(SECTION_SEL).each(function () {
                var slidesWrap = $(this).find(SLIDES_WRAPPER_SEL);
                var slides = $(this).find(SLIDE_SEL);

                //adjusting the height of the table-cell for IE and Firefox
                if (options.verticalCentered) {
                    //$(this).find(TABLE_CELL_SEL).css('height', getTableHeight($(this)) + 'px');
                }

                //$(this).css('height', windowsHeight + 'px');

                //adjusting the position fo the FULL WIDTH slides...
                if (slides.length > 1) {
                    landscapeScroll(slidesWrap, slidesWrap.find(SLIDE_ACTIVE_SEL));
                }
            });

            if (options.scrollOverflow) {
                scrollBarHandler.createScrollBarForAll();
            }

            var activeSection = $(SECTION_ACTIVE_SEL);
            var sectionIndex = activeSection.index(SECTION_SEL);

            //isn't it the first section?
            if (sectionIndex) {
                //adjusting the position for the current section
                silentMoveTo(sectionIndex + 1);
            }

            isResizing = false;
            $.isFunction(options.afterResize) && resizing && options.afterResize.call(container);
            $.isFunction(options.afterReBuild) && !resizing && options.afterReBuild.call(container);
        }

        /**
         * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height`
         * are smaller than the set limit values.
         */
        function setResponsive(active) {
            var isResponsive = $body.hasClass(RESPONSIVE);

            if (active) {
                if (!isResponsive) {
                    setAutoScrolling(false, 'internal');
                    setFitToSection(false, 'internal');
                    $(SECTION_NAV_SEL).hide();
                    $body.addClass(RESPONSIVE);
                    $.isFunction(options.afterResponsive) && options.afterResponsive.call(container, active);
                }
            }
            else if (isResponsive) {
                setAutoScrolling(originals.autoScrolling, 'internal');
                setFitToSection(originals.autoScrolling, 'internal');
                $(SECTION_NAV_SEL).show();
                $body.removeClass(RESPONSIVE);
                $.isFunction(options.afterResponsive) && options.afterResponsive.call(container, active);
            }
        }

        if ($(this).length) {
            //public functions
            FP.version = '2.9.6';
            FP.setAutoScrolling = setAutoScrolling;
            FP.setRecordHistory = setRecordHistory;
            FP.setScrollingSpeed = setScrollingSpeed;
            FP.setFitToSection = setFitToSection;
            FP.setLockAnchors = setLockAnchors;
            FP.setMouseWheelScrolling = setMouseWheelScrolling;
            FP.setAllowScrolling = setAllowScrolling;
            FP.setKeyboardScrolling = setKeyboardScrolling;
            FP.moveSectionUp = moveSectionUp;
            FP.moveSectionDown = moveSectionDown;
            FP.silentMoveTo = silentMoveTo;
            FP.moveTo = moveTo;
            FP.moveSlideRight = moveSlideRight;
            FP.moveSlideLeft = moveSlideLeft;
            FP.fitToSection = fitToSection;
            FP.reBuild = reBuild;
            FP.setResponsive = setResponsive;
            FP.destroy = destroy;

            //functions we want to share across files but which are not
            //mean to be used on their own by developers
            FP.shared = {
                afterRenderActions: afterRenderActions
            };

            init();

            bindEvents();
        }

        function init() {
            //if css3 is not supported, it will use jQuery animations
            if (options.css3) {
                options.css3 = support3d();
            }

            options.scrollBar = options.scrollBar || options.hybrid;

            setOptionsFromDOM();
            prepareDom();
            setAllowScrolling(true);
            setAutoScrolling(options.autoScrolling, 'internal');
            responsive();

            //setting the class for the body element
            setBodyClass();

            if (document.readyState === 'complete') {
                scrollToAnchor();
            }
            $window.on('load', scrollToAnchor);
        }

        function bindEvents() {
            $window
            //when scrolling...
                .on('scroll', scrollHandler)

                //detecting any change on the URL to scroll to the given anchor link
                //(a way to detect back history button as we play with the hashes on the URL)
                .on('hashchange', hashChangeHandler)

                //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
                .blur(blurHandler)

                //when resizing the site, we adjust the heights of the sections, slimScroll...
                .resize(resizeHandler);

            $document
            //Sliding with arrow keys, both, vertical and horizontal
                .keydown(keydownHandler)

                //to prevent scrolling while zooming
                .keyup(keyUpHandler)

                //Scrolls to the section when clicking the navigation bullet
                .on('click touchstart', SECTION_NAV_SEL + ' a', sectionBulletHandler)

                //Scrolls the slider to the given slide destination for the given section
                .on('click touchstart', SLIDES_NAV_LINK_SEL, slideBulletHandler)

                .on('click', SECTION_NAV_TOOLTIP_SEL, tooltipTextHandler);

            //Scrolling horizontally when clicking on the slider controls.
            $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, slideArrowHandler);

            /**
             * Applying normalScroll elements.
             * Ignoring the scrolls over the specified selectors.
             */
            if (options.normalScrollElements) {
                $document.on('mouseenter touchstart', options.normalScrollElements, function () {
                    setAllowScrolling(false);
                });

                $document.on('mouseleave touchend', options.normalScrollElements, function () {
                    setAllowScrolling(true);
                });
            }
        }

        /**
         * Setting options from DOM elements if they are not provided.
         */
        function setOptionsFromDOM() {
            var sections = container.find(options.sectionSelector);

            //no anchors option? Checking for them in the DOM attributes
            if (!options.anchors.length) {
                options.anchors = sections.filter('[data-anchor]').map(function () {
                    return $(this).data('anchor').toString();
                }).get();
            }

            //no tooltips option? Checking for them in the DOM attributes
            if (!options.navigationTooltips.length) {
                options.navigationTooltips = sections.filter('[data-tooltip]').map(function () {
                    return $(this).data('tooltip').toString();
                }).get();
            }
        }

        /**
         * Works over the DOM structure to set it up for the current fullpage options.
         */
        function prepareDom() {
            container.css({
                'height': '100%',
                'position': 'relative'
            });

            //adding a class to recognize the container internally in the code
            container.addClass(WRAPPER);
            $('html').addClass(ENABLED);

            //due to https://github.com/alvarotrigo/fullPage.js/issues/1502
            windowsHeight = $window.height();

            container.removeClass(DESTROYED); //in case it was destroyed before initializing it again

            addInternalSelectors();

            //styling the sections / slides / menu
            $(SECTION_SEL).each(function (index) {
                var section = $(this);
                var slides = section.find(SLIDE_SEL);
                var numSlides = slides.length;

                //caching the original styles to add them back on destroy('all')
                section.data('fp-styles', section.attr('style'));

                styleSection(section, index);
                styleMenu(section, index);

                // if there's any slide
                if (numSlides > 0) {
                    styleSlides(section, slides, numSlides);
                } else {
                    if (options.verticalCentered) {
                        addTableClass(section);
                    }
                }
            });

            //fixed elements need to be moved out of the plugin container due to problems with CSS3.
            if (options.fixedElements && options.css3) {
                $(options.fixedElements).appendTo($body);
            }

            //vertical centered of the navigation + active bullet
            if (options.navigation) {
                addVerticalNavigation();
            }

            enableYoutubeAPI();

            if (options.scrollOverflow) {
                scrollBarHandler = options.scrollOverflowHandler.init(options);
            } else {
                afterRenderActions();
            }
        }

        /**
         * Styles the horizontal slides for a section.
         */
        function styleSlides(section, slides, numSlides) {
            var sliderWidth = numSlides * 100;
            var slideWidth = 100 / numSlides;

            slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
            slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');

            section.find(SLIDES_CONTAINER_SEL).css('width', sliderWidth + '%');

            if (numSlides > 1) {
                if (options.controlArrows) {
                    createSlideArrows(section);
                }

                if (options.slidesNavigation) {
                    addSlidesNavigation(section, numSlides);
                }
            }

            slides.each(function (index) {
                $(this).css('width', slideWidth + '%');

                if (options.verticalCentered) {
                    addTableClass($(this));
                }
            });

            var startingSlide = section.find(SLIDE_ACTIVE_SEL);

            //if the slide won't be an starting point, the default will be the first one
            //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            if (startingSlide.length && ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && startingSlide.index() !== 0))) {
                silentLandscapeScroll(startingSlide, 'internal');
            } else {
                slides.eq(0).addClass(ACTIVE);
            }
        }

        /**
         * Styling vertical sections
         */
        function styleSection(section, index) {
            //if no active section is defined, the 1st one will be the default one
            if (!index && $(SECTION_ACTIVE_SEL).length === 0) {
                section.addClass(ACTIVE);
            }
            startingSection = $(SECTION_ACTIVE_SEL);

            section.css('height', windowsHeight + 'px');

            if (options.paddingTop) {
                section.css('padding-top', options.paddingTop);
            }

            if (options.paddingBottom) {
                section.css('padding-bottom', options.paddingBottom);
            }

            if (typeof options.sectionsColor[index] !== 'undefined') {
                section.css('background-color', options.sectionsColor[index]);
            }

            if (typeof options.anchors[index] !== 'undefined') {
                section.attr('data-anchor', options.anchors[index]);
            }
        }

        /**
         * Sets the data-anchor attributes to the menu elements and activates the current one.
         */
        function styleMenu(section, index) {
            if (typeof options.anchors[index] !== 'undefined') {
                //activating the menu / nav element on load
                if (section.hasClass(ACTIVE)) {
                    activateMenuAndNav(options.anchors[index], index);
                }
            }

            //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
            if (options.menu && options.css3 && $(options.menu).closest(WRAPPER_SEL).length) {
                $(options.menu).appendTo($body);
            }
        }

        /**
         * Adds internal classes to be able to provide customizable selectors
         * keeping the link with the style sheet.
         */
        function addInternalSelectors() {
            container.find(options.sectionSelector).addClass(SECTION);
            container.find(options.slideSelector).addClass(SLIDE);
        }

        /**
         * Creates the control arrows for the given section
         */
        function createSlideArrows(section) {
            section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');

            if (options.controlArrowColor != '#fff') {
                section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent ' + options.controlArrowColor);
                section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent ' + options.controlArrowColor + ' transparent transparent');
            }

            if (!options.loopHorizontal) {
                section.find(SLIDES_ARROW_PREV_SEL).hide();
            }
        }

        /**
         * Creates a vertical navigation bar.
         */
        function addVerticalNavigation() {
            $body.append('<div id="' + SECTION_NAV + '"><ul></ul></div>');
            var nav = $(SECTION_NAV_SEL);

            nav.addClass(function () {
                return options.showActiveTooltip ? SHOW_ACTIVE_TOOLTIP + ' ' + options.navigationPosition : options.navigationPosition;
            });

            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }

                var li = '<li><a href="#' + link + '"><span></span></a>';

                // Only add tooltip if needed (defined by user)
                var tooltip = options.navigationTooltips[i];

                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' ' + options.navigationPosition + '">' + tooltip + '</div>';
                }

                li += '</li>';

                nav.find('ul').append(li);
            }

            //centering it vertically
            $(SECTION_NAV_SEL).css('margin-top', '-' + ($(SECTION_NAV_SEL).height() / 2) + 'px');

            //activating the current active section
            $(SECTION_NAV_SEL).find('li').eq($(SECTION_ACTIVE_SEL).index(SECTION_SEL)).find('a').addClass(ACTIVE);
        }

        /*
        * Enables the Youtube videos API so we can control their flow if necessary.
        */
        function enableYoutubeAPI() {
            container.find('iframe[src*="youtube.com/embed/"]').each(function () {
                addURLParam($(this), 'enablejsapi=1');
            });
        }

        /**
         * Adds a new parameter and its value to the `src` of a given element
         */
        function addURLParam(element, newParam) {
            var originalSrc = element.attr('src');
            element.attr('src', originalSrc + getUrlParamSign(originalSrc) + newParam);
        }

        /*
        * Returns the prefix sign to use for a new parameter in an existen URL.
        *
        * @return {String}  ? | &
        */
        function getUrlParamSign(url) {
            return (!/\?/.test(url)) ? '?' : '&';
        }

        /**
         * Actions and callbacks to fire afterRender
         */
        function afterRenderActions() {
            var section = $(SECTION_ACTIVE_SEL);

            section.addClass(COMPLETELY);

            lazyLoad(section);
            playMedia(section);

            if (options.scrollOverflow) {
                options.scrollOverflowHandler.afterLoad();
            }

            if (isDestinyTheStartingSection()) {
                $.isFunction(options.afterLoad) && options.afterLoad.call(section, section.data('anchor'), (section.index(SECTION_SEL) + 1));
            }

            $.isFunction(options.afterRender) && options.afterRender.call(container);
        }

        /**
         * Determines if the URL anchor destiny is the starting section (the one using 'active' class before initialization)
         */
        function isDestinyTheStartingSection() {
            var destinationSection = getSectionByAnchor(getAnchorsURL().section);
            return !destinationSection || destinationSection.length && destinationSection.index() === startingSection.index();
        }


        var isScrolling = false;
        var lastScroll = 0;

        //when scrolling...
        function scrollHandler() {
            var currentSection;

            if (!options.autoScrolling || options.scrollBar) {
                var currentScroll = $window.scrollTop();
                var scrollDirection = getScrollDirection(currentScroll);
                var visibleSectionIndex = 0;
                var screen_mid = currentScroll + ($window.height() / 2.0);
                var isAtBottom = $body.height() - $window.height() === currentScroll;
                var sections = document.querySelectorAll(SECTION_SEL);

                //when using `auto-height` for a small last section it won't be centered in the viewport
                if (isAtBottom) {
                    visibleSectionIndex = sections.length - 1;
                }
                //is at top? when using `auto-height` for a small first section it won't be centered in the viewport
                else if (!currentScroll) {
                    visibleSectionIndex = 0;
                }

                //taking the section which is showing more content in the viewport
                else {
                    for (var i = 0; i < sections.length; ++i) {
                        var section = sections[i];

                        // Pick the the last section which passes the middle line of the screen.
                        if (section.offsetTop <= screen_mid) {
                            visibleSectionIndex = i;
                        }
                    }
                }

                if (isCompletelyInViewPort(scrollDirection)) {
                    if (!$(SECTION_ACTIVE_SEL).hasClass(COMPLETELY)) {
                        $(SECTION_ACTIVE_SEL).addClass(COMPLETELY).siblings().removeClass(COMPLETELY);
                    }
                }

                //geting the last one, the current one on the screen
                currentSection = $(sections).eq(visibleSectionIndex);

                //setting the visible section as active when manually scrolling
                //executing only once the first time we reach the section
                if (!currentSection.hasClass(ACTIVE)) {
                    isScrolling = true;
                    var leavingSection = $(SECTION_ACTIVE_SEL);
                    var leavingSectionIndex = leavingSection.index(SECTION_SEL) + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink = currentSection.data('anchor');
                    var sectionIndex = currentSection.index(SECTION_SEL) + 1;
                    var activeSlide = currentSection.find(SLIDE_ACTIVE_SEL);
                    var slideIndex;
                    var slideAnchorLink;

                    if (activeSlide.length) {
                        slideAnchorLink = activeSlide.data('anchor');
                        slideIndex = activeSlide.index();
                    }

                    if (canScroll) {
                        currentSection.addClass(ACTIVE).siblings().removeClass(ACTIVE);

                        $.isFunction(options.onLeave) && options.onLeave.call(leavingSection, leavingSectionIndex, sectionIndex, yMovement);
                        $.isFunction(options.afterLoad) && options.afterLoad.call(currentSection, anchorLink, sectionIndex);

                        stopMedia(leavingSection);
                        lazyLoad(currentSection);
                        playMedia(currentSection);

                        activateMenuAndNav(anchorLink, sectionIndex - 1);

                        if (options.anchors.length) {
                            //needed to enter in hashChange event when using the menu with anchor links
                            lastScrolledDestiny = anchorLink;
                        }
                        setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                    }

                    //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function () {
                        isScrolling = false;
                    }, 100);
                }

                if (options.fitToSection) {
                    //for the auto adjust of the viewport to fit a whole section
                    clearTimeout(scrollId2);

                    scrollId2 = setTimeout(function () {
                        //checking it again in case it changed during the delay
                        if (options.fitToSection &&

                            //is the destination element bigger than the viewport?
                            $(SECTION_ACTIVE_SEL).outerHeight() <= windowsHeight
                        ) {
                            fitToSection();
                        }
                    }, options.fitToSectionDelay);
                }
            }
        }

        /**
         * Fits the site to the nearest active section
         */
        function fitToSection() {
            //checking fitToSection again in case it was set to false before the timeout delay
            if (canScroll) {
                //allows to scroll to an active section and
                //if the section is already active, we prevent firing callbacks
                isResizing = true;

                scrollPage($(SECTION_ACTIVE_SEL));
                isResizing = false;
            }
        }

        /**
         * Determines whether the active section has seen in its whole or not.
         */
        function isCompletelyInViewPort(movement) {
            var top = $(SECTION_ACTIVE_SEL).position().top;
            var bottom = top + $window.height();

            if (movement == 'up') {
                return bottom >= ($window.scrollTop() + $window.height());
            }
            return top <= $window.scrollTop();
        }

        /**
         * Gets the directon of the the scrolling fired by the scroll event.
         */
        function getScrollDirection(currentScroll) {
            var direction = currentScroll > lastScroll ? 'down' : 'up';

            lastScroll = currentScroll;

            //needed for auto-height sections to determine if we want to scroll to the top or bottom of the destination
            previousDestTop = currentScroll;

            return direction;
        }

        /**
         * Determines the way of scrolling up or down:
         * by 'automatically' scrolling a section or by using the default and normal scrolling.
         */
        function scrolling(type) {
            if (!isScrollAllowed.m[type]) {
                return;
            }

            var scrollSection = (type === 'down') ? moveSectionDown : moveSectionUp;

            if (options.scrollOverflow) {
                var scrollable = options.scrollOverflowHandler.scrollable($(SECTION_ACTIVE_SEL));
                var check = (type === 'down') ? 'bottom' : 'top';

                if (scrollable.length > 0) {
                    //is the scrollbar at the start/end of the scroll?
                    if (options.scrollOverflowHandler.isScrolled(check, scrollable)) {
                        scrollSection();
                    } else {
                        return true;
                    }
                } else {
                    // moved up/down
                    scrollSection();
                }
            } else {
                // moved up/down
                scrollSection();
            }
        }

        /*
        * Preventing bouncing in iOS #2285
        */
        function preventBouncing(event) {
            var e = event.originalEvent;
            if (options.autoScrolling && isReallyTouch(e)) {
                //preventing the easing on iOS devices
                event.preventDefault();
            }
        }

        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * This way, the touchstart and the touch moves shows an small difference between them which is the
        * used one to determine the direction.
        */
        function touchMoveHandler(event) {
            var e = event.originalEvent;
            var activeSection = $(e.target).closest(SECTION_SEL);

            // additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
            if (isReallyTouch(e)) {

                if (options.autoScrolling) {
                    //preventing the easing on iOS devices
                    event.preventDefault();
                }

                var touchEvents = getEventsPage(e);

                touchEndY = touchEvents.y;
                touchEndX = touchEvents.x;

                //if movement in the X axys is greater than in the Y and the currect section has slides...
                if (activeSection.find(SLIDES_WRAPPER_SEL).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                    //is the movement greater than the minimum resistance to scroll?
                    if (!slideMoving && Math.abs(touchStartX - touchEndX) > ($window.outerWidth() / 100 * options.touchSensitivity)) {
                        if (touchStartX > touchEndX) {
                            if (isScrollAllowed.m.right) {
                                moveSlideRight(activeSection); //next
                            }
                        } else {
                            if (isScrollAllowed.m.left) {
                                moveSlideLeft(activeSection); //prev
                            }
                        }
                    }
                }

                //vertical scrolling (only when autoScrolling is enabled)
                else if (options.autoScrolling && canScroll) {

                    //is the movement greater than the minimum resistance to scroll?
                    if (Math.abs(touchStartY - touchEndY) > ($window.height() / 100 * options.touchSensitivity)) {
                        if (touchStartY > touchEndY) {
                            scrolling('down');
                        } else if (touchEndY > touchStartY) {
                            scrolling('up');
                        }
                    }
                }
            }
        }

        /**
         * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
         * this way we make sure that is really a touch event what IE is detecting.
         */
        function isReallyTouch(e) {
            //if is not IE   ||  IE is detecting `touch` or `pen`
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        /**
         * Handler for the touch start event.
         */
        function touchStartHandler(event) {
            var e = event.originalEvent;

            //stopping the auto scroll to adjust to a section
            if (options.fitToSection) {
                $htmlBody.stop();
            }

            if (isReallyTouch(e)) {
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        /**
         * Gets the average of the last `number` elements of the given array.
         */
        function getAverage(elements, number) {
            var sum = 0;

            //taking `number` elements from the end to make the average, if there are not enought, 1
            var lastElements = elements.slice(Math.max(elements.length - number, 1));

            for (var i = 0; i < lastElements.length; i++) {
                sum = sum + lastElements[i];
            }

            return Math.ceil(sum / number);
        }

        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        var prevTime = new Date().getTime();

        function MouseWheelHandler(e) {
            var curTime = new Date().getTime();
            var isNormalScroll = $(COMPLETELY_SEL).hasClass(NORMAL_SCROLL);

            //autoscrolling and not zooming?
            if (options.autoScrolling && !controlPressed && !isNormalScroll) {
                // cross-browser wheel delta
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));

                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);

                //Limiting the array to 150 (lets not waste memory!)
                if (scrollings.length > 149) {
                    scrollings.shift();
                }

                //keeping record of the previous scrollings
                scrollings.push(Math.abs(value));

                //preventing to scroll the site on mouse wheel when scrollbar is present
                if (options.scrollBar) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                }

                //time difference between the last scroll and the current one
                var timeDiff = curTime - prevTime;
                prevTime = curTime;

                //haven't they scrolled in a while?
                //(enough to be consider a different scrolling action to scroll another section)
                if (timeDiff > 200) {
                    //emptying the array, we dont care about old scrollings for our averages
                    scrollings = [];
                }

                if (canScroll) {
                    var averageEnd = getAverage(scrollings, 10);
                    var averageMiddle = getAverage(scrollings, 70);
                    var isAccelerating = averageEnd >= averageMiddle;

                    //to avoid double swipes...
                    if (isAccelerating && isScrollingVertically) {
                        //scrolling down?
                        if (delta < 0) {
                            scrolling('down');

                            //scrolling up?
                        } else {
                            scrolling('up');
                        }
                    }
                }

                return false;
            }

            if (options.fitToSection) {
                //stopping the auto scroll to adjust to a section
                $htmlBody.stop();
            }
        }

        /**
         * Slides a slider to the given direction.
         * Optional `section` param.
         */
        function moveSlide(direction, section) {
            var activeSection = typeof section === 'undefined' ? $(SECTION_ACTIVE_SEL) : section;
            var slides = activeSection.find(SLIDES_WRAPPER_SEL);
            var numSlides = slides.find(SLIDE_SEL).length;

            // more than one slide needed and nothing should be sliding
            if (!slides.length || slideMoving || numSlides < 2) {
                return;
            }

            var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
            var destiny = null;

            if (direction === 'left') {
                destiny = currentSlide.prev(SLIDE_SEL);
            } else {
                destiny = currentSlide.next(SLIDE_SEL);
            }

            //isn't there a next slide in the secuence?
            if (!destiny.length) {
                //respect loopHorizontal settin
                if (!options.loopHorizontal) return;

                if (direction === 'left') {
                    destiny = currentSlide.siblings(':last');
                } else {
                    destiny = currentSlide.siblings(':first');
                }
            }

            slideMoving = true;

            landscapeScroll(slides, destiny, direction);
        }

        /**
         * Maintains the active slides in the viewport
         * (Because the `scroll` animation might get lost with some actions, such as when using continuousVertical)
         */
        function keepSlidesPosition() {
            $(SLIDE_ACTIVE_SEL).each(function () {
                silentLandscapeScroll($(this), 'internal');
            });
        }

        var previousDestTop = 0;

        /**
         * Returns the destination Y position based on the scrolling direction and
         * the height of the section.
         */
        function getDestinationPosition(element) {
            var elemPosition = element.position();

            //top of the desination will be at the top of the viewport
            var position = elemPosition.top;
            var isScrollingDown = elemPosition.top > previousDestTop;
            var sectionBottom = position - windowsHeight + element.outerHeight();
            var bigSectionsDestination = options.bigSectionsDestination;

            //is the destination element bigger than the viewport?
            if (element.outerHeight() > windowsHeight) {
                //scrolling up?
                if (!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom') {
                    position = sectionBottom;
                }
            }

            //sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
            else if (isScrollingDown || (isResizing && element.is(':last-child'))) {
                //The bottom of the destination will be at the bottom of the viewport
                position = sectionBottom;
            }

            /*
            Keeping record of the last scrolled position to determine the scrolling direction.
            No conventional methods can be used as the scroll bar might not be present
            AND the section might not be active if it is auto-height and didnt reach the middle
            of the viewport.
            */
            previousDestTop = position;
            return position;
        }

        /**
         * Scrolls the site to the given element and scrolls to the slide if a callback is given.
         */
        function scrollPage(element, callback, isMovementUp) {
            if (typeof element === 'undefined') {
                return;
            } //there's no element to scroll, leaving the function

            var dtop = getDestinationPosition(element);
            var slideAnchorLink;
            var slideIndex;

            //local variables
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dtop: dtop,
                yMovement: getYmovement(element),
                anchorLink: element.data('anchor'),
                sectionIndex: element.index(SECTION_SEL),
                activeSlide: element.find(SLIDE_ACTIVE_SEL),
                activeSection: $(SECTION_ACTIVE_SEL),
                leavingSection: $(SECTION_ACTIVE_SEL).index(SECTION_SEL) + 1,

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };

            //quiting when destination scroll is the same as the current one
            if ((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $window.scrollTop() === v.dtop && !element.hasClass(AUTO_HEIGHT))) {
                return;
            }

            if (v.activeSlide.length) {
                slideAnchorLink = v.activeSlide.data('anchor');
                slideIndex = v.activeSlide.index();
            }

            //callback (onLeave) if the site is not just resizing and readjusting the slides
            if ($.isFunction(options.onLeave) && !v.localIsResizing) {
                var direction = v.yMovement;

                //required for continousVertical
                if (typeof isMovementUp !== 'undefined') {
                    direction = isMovementUp ? 'up' : 'down';
                }

                if (options.onLeave.call(v.activeSection, v.leavingSection, (v.sectionIndex + 1), direction) === false) {
                    return;
                }
            }

            // If continuousVertical && we need to wrap around
            if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
                ((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
                    (v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

                v = createInfiniteSections(v);
            }

            //pausing media of the leaving section (if we are not just resizing, as destinatino will be the same one)
            if (!v.localIsResizing) {
                stopMedia(v.activeSection);
            }

            if (options.scrollOverflow) {
                options.scrollOverflowHandler.beforeLeave();
            }

            element.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            lazyLoad(element);

            if (options.scrollOverflow) {
                options.scrollOverflowHandler.onLeave();
            }

            //preventing from activating the MouseWheelHandler event
            //more than once if the page is scrolling
            canScroll = false;

            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

            performMovement(v);

            //flag to avoid callingn `scrollPage()` twice in case of using anchor links
            lastScrolledDestiny = v.anchorLink;

            //avoid firing it twice (as it does also on scroll)
            activateMenuAndNav(v.anchorLink, v.sectionIndex);
        }

        /**
         * Performs the vertical movement (by CSS3 or by jQuery)
         */
        function performMovement(v) {
            // using CSS3 translate functionality
            if (options.css3 && options.autoScrolling && !options.scrollBar) {

                // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
                // that's why we round it to 0.
                var translate3d = 'translate3d(0px, -' + Math.round(v.dtop) + 'px, 0px)';
                transformContainer(translate3d, true);

                //even when the scrollingSpeed is 0 there's a little delay, which might cause the
                //scrollingSpeed to change in case of using silentMoveTo();
                if (options.scrollingSpeed) {
                    clearTimeout(afterSectionLoadsId);
                    afterSectionLoadsId = setTimeout(function () {
                        afterSectionLoads(v);
                    }, options.scrollingSpeed);
                } else {
                    afterSectionLoads(v);
                }
            }

            // using jQuery animate
            else {
                var scrollSettings = getScrollSettings(v);

                $(scrollSettings.element).animate(
                    scrollSettings.options,
                    options.scrollingSpeed, options.easing).promise().done(function () { //only one single callback in case of animating  `html, body`
                    if (options.scrollBar) {

                        /* Hack!
                        The timeout prevents setting the most dominant section in the viewport as "active" when the user
                        scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.

                        When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
                        */
                        setTimeout(function () {
                            afterSectionLoads(v);
                        }, 30);
                    } else {
                        afterSectionLoads(v);
                    }
                });
            }
        }

        /**
         * Gets the scrolling settings depending on the plugin autoScrolling option
         */
        function getScrollSettings(v) {
            var scroll = {};

            if (options.autoScrolling && !options.scrollBar) {
                scroll.options = {'top': -v.dtop};
                scroll.element = WRAPPER_SEL;
            } else {
                scroll.options = {'scrollTop': v.dtop};
                scroll.element = 'html, body';
            }

            return scroll;
        }

        /**
         * Adds sections before or after the current one to create the infinite effect.
         */
        function createInfiniteSections(v) {
            // Scrolling down
            if (!v.isMovementUp) {
                // Move all previous sections to after the active section
                $(SECTION_ACTIVE_SEL).after(v.activeSection.prevAll(SECTION_SEL).get().reverse());
            }
            else { // Scrolling up
                // Move all next sections to before the active section
                $(SECTION_ACTIVE_SEL).before(v.activeSection.nextAll(SECTION_SEL));
            }

            // Maintain the displayed position (now that we changed the element order)
            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();

            // save for later the elements that still need to be reordered
            v.wrapAroundElements = v.activeSection;

            // Recalculate animation variables
            v.dtop = v.element.position().top;
            v.yMovement = getYmovement(v.element);

            //sections will temporally have another position in the DOM
            //updating this values in case we need them
            v.leavingSection = v.activeSection.index(SECTION_SEL) + 1;
            v.sectionIndex = v.element.index(SECTION_SEL);

            return v;
        }

        /**
         * Fix section order after continuousVertical changes have been animated
         */
        function continuousVerticalFixSectionOrder(v) {
            // If continuousVertical is in effect (and autoScrolling would also be in effect then),
            // finish moving the elements around so the direct navigation will function more simply
            if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
                return;
            }

            if (v.isMovementUp) {
                $(SECTION_FIRST_SEL).before(v.wrapAroundElements);
            }
            else {
                $(SECTION_LAST_SEL).after(v.wrapAroundElements);
            }

            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();
        }


        /**
         * Actions to do once the section is loaded.
         */
        function afterSectionLoads(v) {
            continuousVerticalFixSectionOrder(v);

            //callback (afterLoad) if the site is not just resizing and readjusting the slides
            $.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(v.element, v.anchorLink, (v.sectionIndex + 1));

            if (options.scrollOverflow) {
                options.scrollOverflowHandler.afterLoad();
            }

            if (!v.localIsResizing) {
                playMedia(v.element);
            }

            v.element.addClass(COMPLETELY).siblings().removeClass(COMPLETELY);

            canScroll = true;

            $.isFunction(v.callback) && v.callback.call(this);
        }

        /**
         * Sets the value for the given attribute from the `data-` attribute with the same suffix
         * ie: data-srcset ==> srcset  |  data-src ==> src
         */
        function setSrc(element, attribute) {
            element
                .attr(attribute, element.data(attribute))
                .removeAttr('data-' + attribute);
        }

        /**
         * Lazy loads image, video and audio elements.
         */
        function lazyLoad(destiny) {
            if (!options.lazyLoading) {
                return;
            }

            var panel = getSlideOrSection(destiny);
            var element;

            panel.find('img[data-src], img[data-srcset], source[data-src], source[data-srcset], video[data-src], audio[data-src], iframe[data-src]').each(function () {
                element = $(this);

                $.each(['src', 'srcset'], function (index, type) {
                    var attribute = element.attr('data-' + type);
                    if (typeof attribute !== 'undefined' && attribute) {
                        setSrc(element, type);
                    }
                });

                if (element.is('source')) {
                    var typeToPlay = element.closest('video').length ? 'video' : 'audio';
                    element.closest(typeToPlay).get(0).load();
                }
            });
        }

        /**
         * Plays video and audio elements.
         */
        function playMedia(destiny) {
            var panel = getSlideOrSection(destiny);

            //playing HTML5 media elements
            panel.find('video, audio').each(function () {
                var element = $(this).get(0);

                if (element.hasAttribute('data-autoplay') && typeof element.play === 'function') {
                    element.play();
                }
            });

            //youtube videos
            panel.find('iframe[src*="youtube.com/embed/"]').each(function () {
                var element = $(this).get(0);

                if (element.hasAttribute('data-autoplay')) {
                    playYoutube(element);
                }

                //in case the URL was not loaded yet. On page load we need time for the new URL (with the API string) to load.
                element.onload = function () {
                    if (element.hasAttribute('data-autoplay')) {
                        playYoutube(element);
                    }
                };
            });
        }

        /**
         * Plays a youtube video
         */
        function playYoutube(element) {
            element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }

        /**
         * Stops video and audio elements.
         */
        function stopMedia(destiny) {
            var panel = getSlideOrSection(destiny);

            //stopping HTML5 media elements
            panel.find('video, audio').each(function () {
                var element = $(this).get(0);

                if (!element.hasAttribute('data-keepplaying') && typeof element.pause === 'function') {
                    element.pause();
                }
            });

            //youtube videos
            panel.find('iframe[src*="youtube.com/embed/"]').each(function () {
                var element = $(this).get(0);

                if (/youtube\.com\/embed\//.test($(this).attr('src')) && !element.hasAttribute('data-keepplaying')) {
                    $(this).get(0).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            });
        }

        /**
         * Gets the active slide (or section) for the given section
         */
        function getSlideOrSection(destiny) {
            var slide = destiny.find(SLIDE_ACTIVE_SEL);
            if (slide.length) {
                destiny = $(slide);
            }

            return destiny;
        }

        /**
         * Scrolls to the anchor in the URL when loading the site
         */
        function scrollToAnchor() {
            var anchors = getAnchorsURL();
            var sectionAnchor = anchors.section;
            var slideAnchor = anchors.slide;

            if (sectionAnchor) {  //if theres any #
                if (options.animateAnchor) {
                    scrollPageAndSlide(sectionAnchor, slideAnchor);
                } else {
                    silentMoveTo(sectionAnchor, slideAnchor);
                }
            }
        }

        /**
         * Detecting any change on the URL to scroll to the given anchor link
         * (a way to detect back history button as we play with the hashes on the URL)
         */
        function hashChangeHandler() {
            if (!isScrolling && !options.lockAnchors) {
                var anchors = getAnchorsURL();
                var sectionAnchor = anchors.section;
                var slideAnchor = anchors.slide;

                //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                var isFirstSlideMove = (typeof lastScrolledDestiny === 'undefined');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slideAnchor === 'undefined' && !slideMoving);

                if (sectionAnchor && sectionAnchor.length) {
                    /*in order to call scrollpage() only once for each destination at a time
                    It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                    event is fired on every scroll too.*/
                    if ((sectionAnchor && sectionAnchor !== lastScrolledDestiny) && !isFirstSlideMove
                        || isFirstScrollMove
                        || (!slideMoving && lastScrolledSlide != slideAnchor)) {

                        scrollPageAndSlide(sectionAnchor, slideAnchor);
                    }
                }
            }
        }

        //gets the URL anchors (section and slide)
        function getAnchorsURL() {
            var section;
            var slide;
            var hash = window.location.hash;

            if (hash.length) {
                //getting the anchor link in the URL and deleting the `#`
                var anchorsParts = hash.replace('#', '').split('/');

                //using / for visual reasons and not as a section/slide separator #2803
                var isFunkyAnchor = hash.indexOf('#/') > -1;

                section = isFunkyAnchor ? '/' + anchorsParts[1] : decodeURIComponent(anchorsParts[0]);

                var slideAnchor = isFunkyAnchor ? anchorsParts[2] : anchorsParts[1];
                if (slideAnchor && slideAnchor.length) {
                    slide = decodeURIComponent(slideAnchor);
                }
            }

            return {
                section: section,
                slide: slide
            }
        }

        //Sliding with arrow keys, both, vertical and horizontal
        function keydownHandler(e) {
            clearTimeout(keydownId);

            var activeElement = $(':focus');
            var keyCode = e.which;

            //tab?
            if (keyCode === 9) {
                onTab(e);
            }

            else if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select') &&
                activeElement.attr('contentEditable') !== "true" && activeElement.attr('contentEditable') !== '' &&
                options.keyboardScrolling && options.autoScrolling) {

                //preventing the scroll with arrow keys & spacebar & Page Up & Down keys
                var keyControls = [40, 38, 32, 33, 34];
                if ($.inArray(keyCode, keyControls) > -1) {
                    e.preventDefault();
                }

                controlPressed = e.ctrlKey;

                keydownId = setTimeout(function () {
                    onkeydown(e);
                }, 150);
            }
        }

        function tooltipTextHandler() {
            $(this).prev().trigger('click');
        }

        //to prevent scrolling while zooming
        function keyUpHandler(e) {
            if (isWindowFocused) { //the keyup gets fired on new tab ctrl + t in Firefox
                controlPressed = e.ctrlKey;
            }
        }

        //binding the mousemove when the mouse's middle button is released
        function mouseDownHandler(e) {
            //middle button
            if (e.which == 2) {
                oldPageY = e.pageY;
                container.on('mousemove', mouseMoveHandler);
            }
        }

        //unbinding the mousemove when the mouse's middle button is released
        function mouseUpHandler(e) {
            //middle button
            if (e.which == 2) {
                container.off('mousemove');
            }
        }

        //Scrolling horizontally when clicking on the slider controls.
        function slideArrowHandler() {
            var section = $(this).closest(SECTION_SEL);

            if ($(this).hasClass(SLIDES_PREV)) {
                if (isScrollAllowed.m.left) {
                    moveSlideLeft(section);
                }
            } else {
                if (isScrollAllowed.m.right) {
                    moveSlideRight(section);
                }
            }
        }

        //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
        function blurHandler() {
            isWindowFocused = false;
            controlPressed = false;
        }

        //Scrolls to the section when clicking the navigation bullet
        function sectionBulletHandler(e) {
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($(SECTION_SEL).eq(index));
        }

        //Scrolls the slider to the given slide destination for the given section
        function slideBulletHandler(e) {
            e.preventDefault();
            var slides = $(this).closest(SECTION_SEL).find(SLIDES_WRAPPER_SEL);
            var destiny = slides.find(SLIDE_SEL).eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        }

        /**
         * Keydown event
         */
        function onkeydown(e) {
            var shiftPressed = e.shiftKey;

            //do nothing if we can not scroll or we are not using horizotnal key arrows.
            if (!canScroll && [37, 39].indexOf(e.which) < 0) {
                return;
            }

            switch (e.which) {
                //up
                case 38:
                case 33:
                    if (isScrollAllowed.k.up) {
                        moveSectionUp();
                    }
                    break;

                //down
                case 32: //spacebar
                    if (shiftPressed && isScrollAllowed.k.up) {
                        moveSectionUp();
                        break;
                    }
                /* falls through */
                case 40:
                case 34:
                    if (isScrollAllowed.k.down) {
                        moveSectionDown();
                    }
                    break;

                //Home
                case 36:
                    if (isScrollAllowed.k.up) {
                        moveTo(1);
                    }
                    break;

                //End
                case 35:
                    if (isScrollAllowed.k.down) {
                        moveTo($(SECTION_SEL).length);
                    }
                    break;

                //left
                case 37:
                    if (isScrollAllowed.k.left) {
                        moveSlideLeft();
                    }
                    break;

                //right
                case 39:
                    if (isScrollAllowed.k.right) {
                        moveSlideRight();
                    }
                    break;

                default:
                    return; // exit this handler for other keys
            }
        }

        /**
         * Makes sure the tab key will only focus elements within the current section/slide
         * preventing this way from breaking the page.
         * Based on "Modals and keyboard traps"
         * from https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex
         */
        function onTab(e) {
            var isShiftPressed = e.shiftKey;
            var activeElement = $(':focus');
            var activeSection = $(SECTION_ACTIVE_SEL);
            var activeSlide = activeSection.find(SLIDE_ACTIVE_SEL);
            var focusableWrapper = activeSlide.length ? activeSlide : activeSection;
            var focusableElements = focusableWrapper.find(focusableElementsString).not('[tabindex="-1"]');

            function preventAndFocusFirst(e) {
                e.preventDefault();
                return focusableElements.first().focus();
            }

            //is there an element with focus?
            if (activeElement.length) {
                if (!activeElement.closest(SECTION_ACTIVE_SEL, SLIDE_ACTIVE_SEL).length) {
                    activeElement = preventAndFocusFirst(e);
                }
            }

            //no element if focused? Let's focus the first one of the section/slide
            else {
                preventAndFocusFirst(e);
            }

            //when reached the first or last focusable element of the section/slide
            //we prevent the tab action to keep it in the last focusable element
            if (!isShiftPressed && activeElement.is(focusableElements.last()) ||
                isShiftPressed && activeElement.is(focusableElements.first())
            ) {
                e.preventDefault();
            }
        }

        /**
         * Detecting the direction of the mouse movement.
         * Used only for the middle button of the mouse.
         */
        var oldPageY = 0;

        function mouseMoveHandler(e) {
            if (canScroll) {
                // moving up
                if (e.pageY < oldPageY && isScrollAllowed.m.up) {
                    moveSectionUp();
                }

                // moving down
                else if (e.pageY > oldPageY && isScrollAllowed.m.down) {
                    moveSectionDown();
                }
            }
            oldPageY = e.pageY;
        }

        /**
         * Scrolls horizontal sliders.
         */
        function landscapeScroll(slides, destiny, direction) {
            var section = slides.closest(SECTION_SEL);
            var v = {
                slides: slides,
                destiny: destiny,
                direction: direction,
                destinyPos: destiny.position(),
                slideIndex: destiny.index(),
                section: section,
                sectionIndex: section.index(SECTION_SEL),
                anchorLink: section.data('anchor'),
                slidesNav: section.find(SLIDES_NAV_SEL),
                slideAnchor: getAnchor(destiny),
                prevSlide: section.find(SLIDE_ACTIVE_SEL),
                prevSlideIndex: section.find(SLIDE_ACTIVE_SEL).index(),

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };
            v.xMovement = getXmovement(v.prevSlideIndex, v.slideIndex);

            //important!! Only do it when not resizing
            if (!v.localIsResizing) {
                //preventing from scrolling to the next/prev section when using scrollHorizontally
                canScroll = false;
            }

            if (options.onSlideLeave) {

                //if the site is not just resizing and readjusting the slides
                if (!v.localIsResizing && v.xMovement !== 'none') {
                    if ($.isFunction(options.onSlideLeave)) {
                        if (options.onSlideLeave.call(v.prevSlide, v.anchorLink, (v.sectionIndex + 1), v.prevSlideIndex, v.direction, v.slideIndex) === false) {
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }

            destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);

            if (!v.localIsResizing) {
                stopMedia(v.prevSlide);
                lazyLoad(destiny);
            }

            if (!options.loopHorizontal && options.controlArrows) {
                //hidding it for the fist slide, showing for the rest
                section.find(SLIDES_ARROW_PREV_SEL).toggle(v.slideIndex !== 0);

                //hidding it for the last slide, showing for the rest
                section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if (section.hasClass(ACTIVE) && !v.localIsResizing) {
                setState(v.slideIndex, v.slideAnchor, v.anchorLink, v.sectionIndex);
            }

            performHorizontalMove(slides, v, true);
        }


        function afterSlideLoads(v) {
            activeSlidesNavigation(v.slidesNav, v.slideIndex);

            //if the site is not just resizing and readjusting the slides
            if (!v.localIsResizing) {
                $.isFunction(options.afterSlideLoad) && options.afterSlideLoad.call(v.destiny, v.anchorLink, (v.sectionIndex + 1), v.slideAnchor, v.slideIndex);

                //needs to be inside the condition to prevent problems with continuousVertical and scrollHorizontally
                //and to prevent double scroll right after a windows resize
                canScroll = true;

                playMedia(v.destiny);
            }

            //letting them slide again
            slideMoving = false;
        }

        /**
         * Performs the horizontal movement. (CSS3 or jQuery)
         *
         * @param fireCallback {Bool} - determines whether or not to fire the callback
         */
        function performHorizontalMove(slides, v, fireCallback) {
            var destinyPos = v.destinyPos;

            if (options.css3) {
                var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';

                addAnimation(slides.find(SLIDES_CONTAINER_SEL)).css(getTransforms(translate3d));

                afterSlideLoadsId = setTimeout(function () {
                    fireCallback && afterSlideLoads(v);
                }, options.scrollingSpeed, options.easing);
            } else {
                slides.animate({
                    scrollLeft: Math.round(destinyPos.left)
                }, options.scrollingSpeed, options.easing, function () {

                    fireCallback && afterSlideLoads(v);
                });
            }
        }

        /**
         * Sets the state for the horizontal bullet navigations.
         */
        function activeSlidesNavigation(slidesNav, slideIndex) {
            slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
            slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
        }

        var previousHeight = windowsHeight;

        //when resizing the site, we adjust the heights of the sections, slimScroll...
        function resizeHandler() {
            //checking if it needs to get responsive
            responsive();

            // rebuild immediately on touch devices
            if (isTouchDevice) {
                var activeElement = $(document.activeElement);

                //if the keyboard is NOT visible
                if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select')) {
                    var currentHeight = $window.height();

                    //making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
                    if (Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100)) {
                        reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            } else {
                //in order to call the functions only when the resize is finished
                //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
                clearTimeout(resizeId);

                resizeId = setTimeout(function () {
                    reBuild(true);
                }, 350);
            }
        }

        /**
         * Checks if the site needs to get responsive and disables autoScrolling if so.
         * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
         */
        function responsive() {
            var widthLimit = options.responsive || options.responsiveWidth; //backwards compatiblity
            var heightLimit = options.responsiveHeight;

            //only calculating what we need. Remember its called on the resize event.
            var isBreakingPointWidth = widthLimit && $window.outerWidth() < widthLimit;
            var isBreakingPointHeight = heightLimit && $window.height() < heightLimit;

            if (widthLimit && heightLimit) {
                setResponsive(isBreakingPointWidth || isBreakingPointHeight);
            }
            else if (widthLimit) {
                setResponsive(isBreakingPointWidth);
            }
            else if (heightLimit) {
                setResponsive(isBreakingPointHeight);
            }
        }

        /**
         * Adds transition animations for the given element
         */
        function addAnimation(element) {
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

            element.removeClass(NO_TRANSITION);
            return element.css({
                '-webkit-transition': transition,
                'transition': transition
            });
        }

        /**
         * Remove transition animations for the given element
         */
        function removeAnimation(element) {
            return element.addClass(NO_TRANSITION);
        }

        /**
         * Activating the vertical navigation bullets according to the given slide name.
         */
        function activateNavDots(name, sectionIndex) {
            if (options.navigation) {
                $(SECTION_NAV_SEL).find(ACTIVE_SEL).removeClass(ACTIVE);
                if (name) {
                    $(SECTION_NAV_SEL).find('a[href="#' + name + '"]').addClass(ACTIVE);
                } else {
                    $(SECTION_NAV_SEL).find('li').eq(sectionIndex).find('a').addClass(ACTIVE);
                }
            }
        }

        /**
         * Activating the website main menu elements according to the given slide name.
         */
        function activateMenuElement(name) {
            if (options.menu) {
                $(options.menu).find(ACTIVE_SEL).removeClass(ACTIVE);
                $(options.menu).find('[data-menuanchor="' + name + '"]').addClass(ACTIVE);
            }
        }

        /**
         * Sets to active the current menu and vertical nav items.
         */
        function activateMenuAndNav(anchor, index) {
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        /**
         * Retuns `up` or `down` depending on the scrolling movement to reach its destination
         * from the current section.
         */
        function getYmovement(destiny) {
            var fromIndex = $(SECTION_ACTIVE_SEL).index(SECTION_SEL);
            var toIndex = destiny.index(SECTION_SEL);
            if (fromIndex == toIndex) {
                return 'none';
            }
            if (fromIndex > toIndex) {
                return 'up';
            }
            return 'down';
        }

        /**
         * Retuns `right` or `left` depending on the scrolling movement to reach its destination
         * from the current slide.
         */
        function getXmovement(fromIndex, toIndex) {
            if (fromIndex == toIndex) {
                return 'none';
            }
            if (fromIndex > toIndex) {
                return 'left';
            }
            return 'right';
        }

        function addTableClass(element) {
            //In case we are styling for the 2nd time as in with reponsiveSlides
            if (!element.hasClass(TABLE)) {
                var wrapper = $('<div class="' + TABLE_CELL + '" />').height(getTableHeight(element));
                element.addClass(TABLE).wrapInner(wrapper);
            }
        }

        function getTableHeight(element) {
            var sectionHeight = windowsHeight;

            if (options.paddingTop || options.paddingBottom) {
                var section = element;
                if (!section.hasClass(SECTION)) {
                    section = element.closest(SECTION_SEL);
                }

                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
         * Adds a css3 transform property to the container class with or without animation depending on the animated param.
         */
        function transformContainer(translate3d, animated) {
            if (animated) {
                addAnimation(container);
            } else {
                removeAnimation(container);
            }

            container.css(getTransforms(translate3d));

            //syncronously removing the class after the animation has been applied.
            setTimeout(function () {
                container.removeClass(NO_TRANSITION);
            }, 10);
        }

        /**
         * Gets a section by its anchor / index
         */
        function getSectionByAnchor(sectionAnchor) {
            var section = container.find(SECTION_SEL + '[data-anchor="' + sectionAnchor + '"]');
            if (!section.length) {
                var sectionIndex = typeof sectionAnchor !== 'undefined' ? sectionAnchor - 1 : 0;
                section = $(SECTION_SEL).eq(sectionIndex);
            }

            return section;
        }

        /**
         * Gets a slide inside a given section by its anchor / index
         */
        function getSlideByAnchor(slideAnchor, section) {
            var slide = section.find(SLIDE_SEL + '[data-anchor="' + slideAnchor + '"]');
            if (!slide.length) {
                slideAnchor = typeof slideAnchor !== 'undefined' ? slideAnchor : 0;
                slide = section.find(SLIDE_SEL).eq(slideAnchor);
            }

            return slide;
        }

        /**
         * Scrolls to the given section and slide anchors
         */
        function scrollPageAndSlide(sectionAnchor, slideAnchor) {
            var section = getSectionByAnchor(sectionAnchor);

            //do nothing if there's no section with the given anchor name
            if (!section.length) return;

            var slide = getSlideByAnchor(slideAnchor, section);

            //we need to scroll to the section and then to the slide
            if (sectionAnchor !== lastScrolledDestiny && !section.hasClass(ACTIVE)) {
                scrollPage(section, function () {
                    scrollSlider(slide);
                });
            }
            //if we were already in the section
            else {
                scrollSlider(slide);
            }
        }

        /**
         * Scrolls the slider to the given slide destination for the given section
         */
        function scrollSlider(slide) {
            if (slide.length) {
                landscapeScroll(slide.closest(SLIDES_WRAPPER_SEL), slide);
            }
        }

        /**
         * Creates a landscape navigation bar with dots for horizontal sliders.
         */
        function addSlidesNavigation(section, numSlides) {
            section.append('<div class="' + SLIDES_NAV + '"><ul></ul></div>');
            var nav = section.find(SLIDES_NAV_SEL);

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for (var i = 0; i < numSlides; i++) {
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width() / 2) + 'px');

            nav.find('li').first().find('a').addClass(ACTIVE);
        }


        /**
         * Sets the state of the website depending on the active section/slide.
         * It changes the URL hash when needed and updates the body class.
         */
        function setState(slideIndex, slideAnchor, anchorLink, sectionIndex) {
            var sectionHash = '';

            if (options.anchors.length && !options.lockAnchors) {

                //isn't it the first slide?
                if (slideIndex) {
                    if (typeof anchorLink !== 'undefined') {
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if (typeof slideAnchor === 'undefined') {
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);

                    //first slide won't have slide anchor, just the section one
                } else if (typeof slideIndex !== 'undefined') {
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                }

                //section without slides
                else {
                    setUrlHash(anchorLink);
                }
            }

            setBodyClass();
        }

        /**
         * Sets the URL hash.
         */
        function setUrlHash(url) {
            if (options.recordHistory) {
                location.hash = url;
            } else {
                //Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
                if (isTouchDevice || isTouch) {
                    window.history.replaceState(undefined, undefined, '#' + url);
                } else {
                    var baseUrl = window.location.href.split('#')[0];
                    window.location.replace(baseUrl + '#' + url);
                }
            }
        }

        /**
         * Gets the anchor for the given slide / section. Its index will be used if there's none.
         */
        function getAnchor(element) {
            var anchor = element.data('anchor');
            var index = element.index();

            //Slide without anchor link? We take the index instead.
            if (typeof anchor === 'undefined') {
                anchor = index;
            }

            return anchor;
        }

        /**
         * Sets a class for the body of the page depending on the active section / slide
         */
        function setBodyClass() {
            var section = $(SECTION_ACTIVE_SEL);
            var slide = section.find(SLIDE_ACTIVE_SEL);

            var sectionAnchor = getAnchor(section);
            var slideAnchor = getAnchor(slide);

            var text = String(sectionAnchor);

            if (slide.length) {
                text = text + '-' + slideAnchor;
            }

            //changing slash for dash to make it a valid CSS style
            text = text.replace('/', '-').replace('#', '');

            //removing previous anchor classes
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body[0].className = $body[0].className.replace(classRe, '');

            //adding the current anchor
            $body.addClass(VIEWING_PREFIX + '-' + text);
        }

        /**
         * Checks for translate3d support
         * @return boolean
         * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
         */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform': '-webkit-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'transform': 'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        /**
         * Removes the auto scrolling action fired by the mouse wheel and trackpad.
         * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
         */
        function removeMouseWheelHandler() {
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
                document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false); //old Firefox
            } else {
                document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
         * Adds the auto scrolling action for the mouse wheel and trackpad.
         * After this function is called, the mousewheel and trackpad movements will scroll through sections
         * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
         */
        function addMouseWheelHandler() {
            var prefix = '';
            var _addEventListener;

            if (window.addEventListener) {
                _addEventListener = "addEventListener";
            } else {
                _addEventListener = "attachEvent";
                prefix = 'on';
            }

            // detect available wheel event
            var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                    'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox


            if (support == 'DOMMouseScroll') {
                document[_addEventListener](prefix + 'MozMousePixelScroll', MouseWheelHandler, false);
            }

            //handle MozMousePixelScroll in older Firefox
            else {
                document[_addEventListener](prefix + support, MouseWheelHandler, false);
            }
        }

        /**
         * Binding the mousemove when the mouse's middle button is pressed
         */
        function addMiddleWheelHandler() {
            container
                .on('mousedown', mouseDownHandler)
                .on('mouseup', mouseUpHandler);
        }

        /**
         * Unbinding the mousemove when the mouse's middle button is released
         */
        function removeMiddleWheelHandler() {
            container
                .off('mousedown', mouseDownHandler)
                .off('mouseup', mouseUpHandler);
        }

        /**
         * Adds the possibility to auto scroll through sections on touch devices.
         */
        function addTouchHandler() {
            if (isTouchDevice || isTouch) {
                if (options.autoScrolling) {
                    $body.off(events.touchmove).on(events.touchmove, preventBouncing);
                }

                $(WRAPPER_SEL)
                    .off(events.touchstart).on(events.touchstart, touchStartHandler)
                    .off(events.touchmove).on(events.touchmove, touchMoveHandler);
            }
        }

        /**
         * Removes the auto scrolling for touch devices.
         */
        function removeTouchHandler() {
            if (isTouchDevice || isTouch) {
                if (options.autoScrolling) {
                    $body.off(events.touchmove);
                }

                $(WRAPPER_SEL)
                    .off(events.touchstart)
                    .off(events.touchmove);
            }
        }

        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer() {
            var pointer;

            //IE >= 11 & rest of browsers
            if (window.PointerEvent) {
                pointer = {down: 'pointerdown', move: 'pointermove'};
            }

            //IE < 11
            else {
                pointer = {down: 'MSPointerDown', move: 'MSPointerMove'};
            }

            return pointer;
        }

        /**
         * Gets the pageX and pageY properties depending on the browser.
         * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
         */
        function getEventsPage(e) {
            var events = [];

            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

            //in touch devices with scroll bar, e.pageY is detected, but we have to deal with touch events. #1008
            if (isTouch && isReallyTouch(e) && (options.scrollBar || !options.autoScrolling)) {
                events.y = e.touches[0].pageY;
                events.x = e.touches[0].pageX;
            }

            return events;
        }

        /**
         * Slides silently (with no animation) the active slider to the given slide.
         * @param noCallback {bool} true or defined -> no callbacks
         */
        function silentLandscapeScroll(activeSlide, noCallbacks) {
            setScrollingSpeed(0, 'internal');

            if (typeof noCallbacks !== 'undefined') {
                //preventing firing callbacks afterSlideLoad etc.
                isResizing = true;
            }

            landscapeScroll(activeSlide.closest(SLIDES_WRAPPER_SEL), activeSlide);

            if (typeof noCallbacks !== 'undefined') {
                isResizing = false;
            }

            setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        /**
         * Scrolls silently (with no animation) the page to the given Y position.
         */
        function silentScroll(top) {
            // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
            // that's why we round it to 0.
            var roundedTop = Math.round(top);

            if (options.css3 && options.autoScrolling && !options.scrollBar) {
                var translate3d = 'translate3d(0px, -' + roundedTop + 'px, 0px)';
                transformContainer(translate3d, false);
            }
            else if (options.autoScrolling && !options.scrollBar) {
                container.css('top', -roundedTop);
            }
            else {
                $htmlBody.scrollTop(roundedTop);
            }
        }

        /**
         * Returns the cross-browser transform string.
         */
        function getTransforms(translate3d) {
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform': translate3d,
                'transform': translate3d
            };
        }

        /**
         * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
         * @type  m (mouse) or k (keyboard)
         */
        function setIsScrollAllowed(value, direction, type) {
            //up, down, left, right
            if (direction !== 'all') {
                isScrollAllowed[type][direction] = value;
            }

            //all directions?
            else {
                $.each(Object.keys(isScrollAllowed[type]), function (index, key) {
                    isScrollAllowed[type][key] = value;
                });
            }
        }

        /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        */
        function destroy(all) {
            setAutoScrolling(false, 'internal');
            setAllowScrolling(false);
            setKeyboardScrolling(false);
            container.addClass(DESTROYED);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);
            clearTimeout(resizeId);
            clearTimeout(scrollId);
            clearTimeout(scrollId2);

            $window
                .off('scroll', scrollHandler)
                .off('hashchange', hashChangeHandler)
                .off('resize', resizeHandler);

            $document
                .off('keydown', keydownHandler)
                .off('keyup', keyUpHandler)
                .off('click touchstart', SECTION_NAV_SEL + ' a')
                .off('mouseenter', SECTION_NAV_SEL + ' li')
                .off('mouseleave', SECTION_NAV_SEL + ' li')
                .off('click touchstart', SLIDES_NAV_LINK_SEL)
                .off('mouseover', options.normalScrollElements)
                .off('mouseout', options.normalScrollElements);

            $(SECTION_SEL)
                .off('click touchstart', SLIDES_ARROW_SEL);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);

            //lets make a mess!
            if (all) {
                destroyStructure();
            }
        }

        /*
        * Removes inline styles added by fullpage.js
        */
        function destroyStructure() {
            //reseting the `top` or `translate` properties to 0
            silentScroll(0);

            //loading all the lazy load content
            container.find('img[data-src], source[data-src], audio[data-src], iframe[data-src]').each(function () {
                setSrc($(this), 'src');
            });

            container.find('img[data-srcset]').each(function () {
                setSrc($(this), 'srcset');
            });

            $(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL + ', ' + SLIDES_ARROW_SEL).remove();

            //removing inline styles
            $(SECTION_SEL).css({
                'height': '',
                'background-color': '',
                'padding': ''
            });

            $(SLIDE_SEL).css({
                'width': ''
            });

            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });

            $htmlBody.css({
                'overflow': '',
                'height': ''
            });

            // remove .fp-enabled class
            $('html').removeClass(ENABLED);

            // remove .fp-responsive class
            $body.removeClass(RESPONSIVE);

            // remove all of the .fp-viewing- classes
            $.each($body.get(0).className.split(/\s+/), function (index, className) {
                if (className.indexOf(VIEWING_PREFIX) === 0) {
                    $body.removeClass(className);
                }
            });

            //removing added classes
            $(SECTION_SEL + ', ' + SLIDE_SEL).each(function () {
                if (options.scrollOverflowHandler) {
                    options.scrollOverflowHandler.remove($(this));
                }
                $(this).removeClass(TABLE + ' ' + ACTIVE);
                $(this).attr('style', $(this).data('fp-styles'));
            });

            removeAnimation(container);

            //Unwrapping content
            container.find(TABLE_CELL_SEL + ', ' + SLIDES_CONTAINER_SEL + ', ' + SLIDES_WRAPPER_SEL).each(function () {
                //unwrap not being use in case there's no child element inside and its just text
                $(this).replaceWith(this.childNodes);
            });

            //removing the applied transition from the fullpage wrapper
            container.css({
                '-webkit-transition': 'none',
                'transition': 'none'
            });

            //scrolling the page to the top with no animation
            $htmlBody.scrollTop(0);

            //removing selectors
            var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
            $.each(usedSelectors, function (index, value) {
                $('.' + value).removeClass(value);
            });
        }

        /*
        * Sets the state for a variable with multiple states (original, and temporal)
        * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
        * This function is used to keep track of both states, the original and the temporal one.
        * If type is not 'internal', then we assume the user is globally changing the variable.
        */
        function setVariableState(variable, value, type) {
            options[variable] = value;
            if (type !== 'internal') {
                originals[variable] = value;
            }
        }

        /**
         * Displays warnings
         */
        function displayWarnings() {
            var extensions = ['fadingEffect', 'continuousHorizontal', 'scrollHorizontally', 'interlockedSlides', 'resetSliders', 'responsiveSlides', 'offsetSections', 'dragAndMove', 'scrollOverflowReset', 'parallax'];
            if ($('html').hasClass(ENABLED)) {
                showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
                return;
            }

            // Disable mutually exclusive settings
            if (options.continuousVertical &&
                (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if (options.scrollBar && options.scrollOverflow) {
                showError('warn', 'Option `scrollBar` is mutually exclusive with `scrollOverflow`. Sections with scrollOverflow might not work well in Firefox');
            }

            if (options.continuousVertical && (options.scrollBar || !options.autoScrolling)) {
                options.continuousVertical = false;
                showError('warn', 'Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if (options.scrollOverflow && !options.scrollOverflowHandler) {
                options.scrollOverflow = false;
                showError('error', 'The option `scrollOverflow:true` requires the file `scrolloverflow.min.js`. Please include it before fullPage.js.');
            }

            //using extensions? Wrong file!
            $.each(extensions, function (index, extension) {
                //is the option set to true?
                if (options[extension]) {
                    showError('warn', 'fullpage.js extensions require jquery.fullpage.extensions.min.js file instead of the usual jquery.fullpage.js. Requested: ' + extension);
                }
            });

            //anchors can not have the same value as any element ID or NAME
            $.each(options.anchors, function (index, name) {

                //case insensitive selectors (http://stackoverflow.com/a/19465187/1081396)
                var nameAttr = $document.find('[name]').filter(function () {
                    return $(this).attr('name') && $(this).attr('name').toLowerCase() == name.toLowerCase();
                });

                var idAttr = $document.find('[id]').filter(function () {
                    return $(this).attr('id') && $(this).attr('id').toLowerCase() == name.toLowerCase();
                });

                if (idAttr.length || nameAttr.length) {
                    showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                    idAttr.length && showError('error', '"' + name + '" is is being used by another element `id` property');
                    nameAttr.length && showError('error', '"' + name + '" is is being used by another element `name` property');
                }
            });
        }

        /**
         * Shows a message in the console of the given type.
         */
        function showError(type, text) {
            console && console[type] && console[type]('fullPage: ' + text);
        }

    }; //end of $.fn.fullpage
});
