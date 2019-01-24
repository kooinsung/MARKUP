SYUI = (function () {
    'use strict';

    var SYUI = {
        /**
         * 공통 UI
         */
        common: {
            init: function () {
                SYUI.common.slide();
                SYUI.common.nav();
                SYUI.common.usemap();
                SYUI.common.accordion();
            },
            nav: function () {
                var $quick = $('.fm5 a');
                $quick.on("click", function (e) {


                    if ($(this).data("show") == "no") {
                        $(this).removeClass('actived');
                        $('body').removeClass('kill');
                        $('.menus').removeClass('open');
                        $(this).data("show", "yes");
                    } else {
                        $(this).addClass('actived');
                        $('body').addClass('kill');
                        $('.menus').addClass('open');
                        $(this).data("show", "no");
                    }
                    return false;
                });


                var $depth1 = $('.depth1'),
                    $depth2 = $('.depth2');
                $depth1.on("click", function (e) {
                    var $nextEle = $(this).next('.depth2');
                    if ($nextEle.length > 0) {
                        if ($nextEle.is(':visible')) {
                            $depth1.removeClass('is-active');
                            $nextEle.slideUp('fast')
                        } else {
                            $depth1.removeClass('is-active');
                            $(this).addClass('is-active');
                            $depth2.slideUp('fast');
                            $nextEle.slideDown('fast');
                        }
                    }
                    ;
                    return false;
                });
            },
            slide: function () {
                /*
                    공통 slide
                    .slide class를 공통으로 부여하고 옵션은 html페이지에서 data속성으로 넣어준다.
                */
                $('.slide').slick();
            },
            accordion: function () {
                var $accordion = $('.js-accordion'),
                    $toggleEle = $('.policy-list .txts, .short-board-list .txts, .faq .txts');

                $accordion.on("click", function (e) {
                    var $nextEle = $(this).next('.txts');

                    if ($nextEle.length > 0) {
                        if ($nextEle.is(':visible')) {
                            $nextEle.slideUp('fast');
                            $('.policy-list .target').removeClass('actived');
                        } else {
                            $toggleEle.slideUp('fast');
                            $nextEle.slideDown('fast');
                            $('.policy-list .target').removeClass('actived');
                            $(this).addClass('actived');
                        }
                    }
                    ;
                    return false;
                });

            },
            usemap: function () {
                $('img[usemap]').rwdImageMaps();
            }

        },
        /**
         * 모달 UI
         */
        layer: {
            open: function (layerID) {
                var targetLayer = "#" + layerID,
                    dims = $('<div class="dims"></div>');

                $(targetLayer).css({
                    'top': Math.max(0, (($(window).height() - $(targetLayer).height()) / 2) + $(window).scrollTop()) + "px"
                }).fadeIn('fast');

                $(dims).appendTo('body').css({
                    'width': '100%',
                    'height': '100%',
                    'display': 'none',
                    'background-color': '#000',
                    'filter': 'alpha(opacity=70)',
                    'position': 'fixed',
                    'top': 0,
                    'left': 0,
                    'z-index': 1000
                }).fadeTo('fast', 0.7);
            },
            close: function (layerID) {
                $("#" + layerID).fadeOut('fast');
                $('.dims').remove();
            }
        }
    };

    return SYUI;
}());

$(function () {
    SYUI.common.init();
});