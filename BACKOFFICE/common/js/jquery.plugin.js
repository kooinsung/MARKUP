/* fixed header */
function MakeScrollable(e, t) { for (var a = e.id, l = (e.offsetHeight, new Array), i = 0; i < e.getElementsByTagName("TH").length; i++) l[i] = e.getElementsByTagName("TH")[i].offsetWidth; e.parentNode.appendChild(document.createElement("div")); var n = e.parentNode, d = document.createElement("table"); for (i = 0; i < e.attributes.length; i++) e.attributes[i].specified && "id" != e.attributes[i].name && d.setAttribute(e.attributes[i].name, e.attributes[i].value); d.style.cssText = e.style.cssText, d.appendChild(document.createElement("tbody")), d.getElementsByTagName("tbody")[0].appendChild(e.getElementsByTagName("TR")[0]); for (var s = d.getElementsByTagName("TH"), o = e.getElementsByTagName("TR")[0], r = 0, i = 0; i < s.length; i++) { var h; h = l[i] > o.getElementsByTagName("TD")[i].offsetWidth ? l[i] : o.getElementsByTagName("TD")[i].offsetWidth, r += h, s[i].style.width = parseInt(h) + "px", $("tr", $(e)).each(function () { $("td", this).eq(i).css("width", h) }) } n.removeChild(e); var c = document.createElement("div"); c.id = "header" + a, c.appendChild(d), n.appendChild(c); var m = document.createElement("div"); c = document.getElementById(c.id), c.style.width = "9999999999999px"; var p = c.getElementsByTagName("table")[0].offsetWidth; c.style.width = p + 17 + "px", r > p ? (c.getElementsByTagName("table")[0].style.width = r + "px", m.style.cssText = "overflow:auto;height:" + t.ScrollHeight + "px;width:" + (r + 17) + "px") : m.style.cssText = "overflow:auto;height:" + t.ScrollHeight + "px;width:" + (p + 17) + "px", m.appendChild(e), n.appendChild(m), t.Width > 0 && (n.style.cssText = "overflow:auto;width:" + t.Width + "px"), m.scrollTop = position, m.onscroll = function () { position = m.scrollTop } } !function (e) { e.fn.Scrollable = function (t) { var a = { ScrollHeight: 300, Width: 0 }, t = e.extend(a, t); return this.each(function () { { var a = e(this).get(0); a.id } MakeScrollable(a, t) }) } } (jQuery); var position = 0;


/*! custom-file-input - v1.0.0 - 2013-07-25
* https://github.com/kvt/custom-file-input
* Copyright (c) 2013 Ketan Tada; Licensed MIT */
(function(t){t.fn.customHtmlFileInput=function(e){var n=t.extend({buttonAttrs:{},textBoxAttrs:{},buttonText:"Browse",inputClass:"customFileInput-textbox",buttonClass:"customFileInput-button",buttonDirection:"right",fileInputAttrs:{opacity:0,height:"100px",width:"50px",top:0,left:0,position:"absolute"},parentElementAttrs:{overflow:"hidden",display:"inline-block",position:"relative"}},e);return this.each(function(){var e=t(this),s=t('<input type="text" />').attr(n.textBoxAttrs).addClass(n.inputClass),o=t("<button />").attr(n.buttonAttrs).addClass(n.buttonClass).html(n.buttonText);e.css(n.fileInputAttrs).attr("size",1).wrap("<span />");var i=e.parent();"right"===n.buttonDirection?i.append(s,o):i.append(o,s),i.css(n.parentElementAttrs).mousemove(function(n){var s=t(this).offset(),o=n.pageX-s.left;e.css("left",o-40)}),e.change(function(){s.val(e.val().replace(/.*fakepath(\/|\\)/,""))})})}})(jQuery);

/* model */
//(function($){
// $.fn.extend({
//	center: function (options) {
//		var options =  $.extend({
//			inside:window,
//			transition: 0,
//			minX:0,
//			minY:0,
//			withScrolling:true,
//			vertical:true,
//			horizontal:true 
//		}, options);
//		return this.each(function() {
//			var props = {position:'absolute'};
//			if (options.vertical) {
//				var top = ($(options.inside).height() - $(this).outerHeight()) / 2;
//				if (options.withScrolling) top += $(options.inside).scrollTop() || 0;
//				top = (top > options.minY ? top : options.minY);
//				$.extend(props, {top: top+'px'});
//			}
//			if (options.horizontal) {
//				var left = ($(options.inside).width() - $(this).outerWidth()) / 2;
//				if (options.withScrolling) left += $(options.inside).scrollLeft() || 0;
//				left = (left > options.minX ? left : options.minX);
//				$.extend(props, {left: left+'px'});
//			}
//			if (options.transition > 0) $(this).animate(props, options.transition);
//			else $(this).css(props);
//			return $(this);
//		});
//
//	}
// });
//})(jQuery);