if (typeof mwSellerUI !== 'object') {
    var mwSellerUI = {};
}

mwSellerUI = (function() {
    'use strict';

    var mwSellerUI = {
        layerToggle: {
            init: function(options) {
                this.openEl = options.openEl;
                this.closeEl = options.closeEl;
                this.layerEl = options.layerEl;

                this.addHandler();
            },
            addHandler: function() {
                $(this.openEl).on('click',$.proxy(function(e) {
                	e.preventDefault();
                    this.show(e.currentTarget);
                }, this));

                $(this.closeEl).on('click',$.proxy(function(e) {
                	e.preventDefault();
                    this.hide(e.currentTarget);
                }, this));
            },
            show: function(targetEl) {
                $(targetEl).siblings(this.layerEl).fadeIn('fast');
            },
            hide: function(targetEl) {
                $(targetEl).closest(this.layerEl).fadeOut('fast');
            }
        },
        layerPopup: {
            init: function(options) {
                this.openEl = options.openEl;
                this.closeEl = options.closeEl;
                this.layerEl = options.layerEl;
                this.toggleClass = options.toggleClass;
                this.$dim = $('<div class="dim" ></div>');

                this.addHandler();
            },
            addHandler: function() {
                $(this.openEl).on('click',$.proxy(function(e) {
                	e.preventDefault();
                    this.show();
                }, this));

                $(this.closeEl).on('click',$.proxy(function(e) {
                	e.preventDefault();
                    this.hide();
                }, this));
            },
            show: function(targetEl) {
            	var targetEl = (targetEl) ? targetEl : this.layerEl;

            	$(targetEl).css({
            		'top':Math.max(0, (($(window).height() - $(this.layerEl).height()) / 2) +  $(window).scrollTop()) + "px",
					'left':Math.max(0, (($(window).width() - $(this.layerEl).width()) / 2) +  $(window).scrollLeft()) + "px"
            	}).addClass(this.toggleClass);

            	//this.$dim.appendTo('body').fadeIn('fast');
            },
            hide: function(targetEl) {
            	var targetEl = (targetEl) ? targetEl : this.layerEl;

            	$(targetEl).removeClass(this.toggleClass);
            	this.$dim.remove();
            }
        },
        accordion: {
            init: function(options) {
                this.toggleEl = options.toggleEl;
                this.toggleClass = options.toggleClass;
                this.$targetEl;

                this.addHandler();
            },
            addHandler: function() {
                $(this.toggleEl).on('click', $.proxy(function(e) {
                    e.preventDefault();

                    this.$targetEl = $(e.currentTarget).next('div');

                    if (!this.$targetEl.length) {
                        return;
                    }

                    if (this.$targetEl.is(':visible')) {
                        this.expand();
                    } else {
                        this.collapse();
                    }
                }, this));
            },
            expand: function() {
                this.$targetEl.slideUp('fast', $.proxy(function() {
                    this.$targetEl
                        .prev(this.toggleEl)
                        .find('a')
                        .removeClass(this.toggleClass);
                }, this));
            },
            collapse: function() {
                this.$targetEl.slideDown('fast', $.proxy(function() {
                    this.$targetEl
                        .prev(this.toggleEl)
                        .find('a')
                        .addClass(this.toggleClass);
                }, this));
            }
        }
    };

    return mwSellerUI;
}());
