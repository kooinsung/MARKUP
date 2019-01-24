if (typeof MSUI !== 'object') {
    var MSUI = {};
    var handler = function (e) {
        e.preventDefault();
    }
}

MSUI = (function () {
    'use strict';
    var $body = $('html, body'),
        $customSelect = $('.custom-select.only-default'),
        $customSelectLayer = $('.custom-select.only-layer'),
        $customScrollbar = $('.custom-scroll'),
        $ellipsis = $('.ellipsis');

    var MSUI = {
        /**
         * 공통 영역
         *
         */
        common: {
            /**
             * 셀렉트박스
             */
            customSelect: {
                onlyDefault: function () {
                    $customSelect.customSelect();
                },
                onlyLayer: function () {
                    $customSelectLayer.customSelect();
                }
            },
            /**
             * 스크롤바
             */
            scrollbar: {
                init: function(){
                    $body.niceScroll({
                        cursorwidth: "5px",
                        cursorcolor: '#b6c5c2',
                        autohidemode: false,
                        zindex: 99999999
                    });

                    $customScrollbar.niceScroll({
                        cursorwidth:"5px",
                        cursorcolor:'#b6c5c2',
                        autohidemode:false
                    });
                },
                resize: function () {
                    $customScrollbar.getNiceScroll().resize();
                }
            },
            /**
             * 말줄임
             */
            ellipsis : function () {
                $ellipsis.dotdotdot();
            },
            /**
             * 달력
             */
            datepicker: function () {
                $('.custom-input.cal input').datepicker({
                    changeMonth: true,
                    changeYear: true
                });
            }
        },
        /**
         * header 영역
         *
         */
        header: {
            utilMenu: function () {
                var $toggle = $('.js-utilmenu'),
                    $toggleEle = $('.utils .in-layer');

                $toggle.on("click", function (e) {
                    var $nextEle = $(this).next('.in-layer');

                    if ($nextEle.length > 0) {
                        if ($nextEle.is(':visible')) {
                            $toggle.removeClass('active');
                            $nextEle.fadeOut('fast');
                        } else {
                            $toggle.removeClass('active');
                            $(this).addClass('active');
                            $toggleEle.fadeOut('fast');
                            $nextEle.fadeIn('fast');

                            MSUI.common.scrollbar.resize();
                            MSUI.common.ellipsis();
                        }
                    };
                    return false;
                });

                $(document).on('click', function (e) {
                    if ($(e.target).closest(".utils .in-layer").length === 0) {
                        $toggle.removeClass('active');
                        $(".utils .in-layer").hide();
                    }
                });

            },
            lnb: function(){
                var $menu = $('.bt-menu'),
                    $menuLayer = $('.layer-menus'),
                    $menuClose = $('.layer-menus .close'),
                    $toggle = $('.depth1'),
                    $toggleEle = $('.layer-menus .depth2');

                $menu.on("click", function (e) {
                    $menuLayer.addClass('opend');
                });

                $menuClose.on("click", function (e) {
                    $menuLayer.removeClass('opend');
                });

                $toggle.on("click", function (e) {
                    var $nextEle = $(this).next('.depth2');

                    if ($nextEle.length > 0) {
                        if ($nextEle.is(':visible')) {
                            $toggle.parent().removeClass('current');
                            $nextEle.slideUp('fast');
                        } else {
                            $toggle.parent().removeClass('current');
                            $(this).parent().addClass('current');
                            $toggleEle.slideUp('fast');
                            $nextEle.slideDown('fast');
                        }
                    };
                    return false;
                });
            }
        },
        /**
         * 모달 레이어
         */
        layer: {
            open: function (layerID) {
                var targetLayer = "#" + layerID,
                    dims = $('<div class="layer-dims"></div>');

                $(targetLayer).css({
                    'top': Math.max(0, (($(window).height() - $(targetLayer).height()) / 2) + $(window).scrollTop()) + "px",
                    'left': Math.max(0, (($(window).width() - $(targetLayer).width()) / 2) + $(window).scrollLeft()) + "px"
                }).fadeIn('fast');

                $(window).resize(function () {
                    $(targetLayer).css({
                        'top': Math.max(0, (($(window).height() - $(targetLayer).height()) / 2) + $(window).scrollTop()) + "px",
                        'left': Math.max(0, (($(window).width() - $(targetLayer).width()) / 2) + $(window).scrollLeft()) + "px"
                    });
                });
                $(dims).appendTo('body').fadeTo('fast', 0.7);
                //
                // $(dims).on('click', function () {
                //     $("#" + layerID).fadeOut('fast');
                //     $('.dims').remove();
                // })

                MSUI.common.customSelect.onlyLayer();

            },
            close: function (layerID) {
                $("#" + layerID).fadeOut('fast');
                $('.layer-dims').remove();
            }
        }
    };

    return MSUI;
}());

$(function () {
    MSUI.common.customSelect.onlyDefault();
    MSUI.common.scrollbar.init();
    MSUI.common.datepicker();
    MSUI.header.utilMenu();
    MSUI.header.lnb();
});