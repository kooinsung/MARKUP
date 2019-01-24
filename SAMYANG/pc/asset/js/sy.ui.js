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
                SYUI.common.fixedHeader();
                SYUI.common.accordion();
                SYUI.common.topMove();
                SYUI.common.tip();
                SYUI.common.lang();
                SYUI.common.historyTab();
            },
            fixedHeader: function () {
                var $window = $(window),
                    $body = $('body'),
                    $header = $('.sy-header');

                if (!$body.hasClass('main')) {
                    $header.addClass('small');
                }
                $window.scroll(function () {
                    if ($(this).scrollTop() > 0) {
                        $header.addClass('small');
                    } else {
                        if (!$body.hasClass('main')) {
                            $header.addClass('small');
                        } else {
                            $header.removeClass('small');
                        }
                    }
                });

            },
            nav: function () {
                var $header = $('.sy-header'),
                    $nav = $('.nav'),
                    $depth1 = $('.depth1'),
                    $depthItem = $('.nav > ul > li'),
                    $depth2 = $('.depth2'),
                    $depth2Item = $('.depth2 > ul > li > a'),
                    $depth3 = $('.depth3'),
                    $newsLetter = $('.bt_newsletter'),
                    $mailLayer = $('.mail-depths'),
                    $search = $('.bt-search'),
                    $searchLayer = $('.search-layer'),
                    wide = $('<div class="wide"></div>');

                var pageName = document.URL;
                var seq = -100;

                if (pageName.indexOf('/product/') >= 0) seq = 0;
                else if (pageName.indexOf('/inspiration/') >= 0) seq = 1;
                else if (pageName.indexOf('/magazine/') >= 0) seq = 2;
                else if (pageName.indexOf('/support/') >= 0) seq = 3;
                else if (pageName.indexOf('/about/') >= 0) seq = 4;

                $depthItem.eq(seq).addClass('is-active');

                $depth1.on("mouseenter", function () {
                    $depthItem.removeClass('actived');
                    $(this).parent().addClass('actived');
                    $depthItem.eq(seq).addClass('is-active');
                    $mailLayer.hide()
                    $header.append(wide);
                    $newsLetter.data("show", "yes");
                });
                $depth2Item.on("mouseenter", function () {
                    if ($(this).next().length > 0) {
                        $depth2.addClass('expand');
                        $depth3.hide();
                        $depth2Item.removeClass('actived');
                        $(this).addClass('actived');
                        $(this).next().show();
                    } else {
                        $depth2.removeClass('expand');
                        $depth3.hide();
                        $depth2Item.removeClass('actived');
                        $(this).addClass('actived');
                        $(this).next().hide();
                    }
                });
                $depth2.on("mouseleave", function () {
                    $depth2.removeClass('expand');
                    $depth3.hide();
                });

                $nav.mouseleave(function () {
                    $depthItem.removeClass('actived');
                    $depth2Item.removeClass('actived');
                    $depthItem.eq(seq).addClass('is-active');
                    wide.remove();
                });

                $newsLetter.click(function (e) {
                    e.preventDefault()
                    if ($(this).data("show") == "no") {
                        $mailLayer.hide();
                        wide.remove()
                        $(this).data("show", "yes");
                    } else {
                        $mailLayer.show();
                        $header.append(wide);
                        $(this).data("show", "no");
                    }
                });

                $('.bt_xeen, .sy-header .util').on("mouseenter", function () {
                    $mailLayer.hide()
                    $newsLetter.data("show", "yes");
                    wide.remove();
                });

                $search.on("click", function (e) {
                    e.preventDefault()
                    $searchLayer.fadeIn('fast');
                });
                $searchLayer.mouseleave(function () {
                    $searchLayer.fadeOut('fast');
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
                    $toggleEle = $('.short-board-list .txts, .faq .txts, .policy-list .txts');

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
            tip: function () {
                var $tip = $('.bt-tip');

                $tip.mouseenter(function () {
                    $(this).next().stop().fadeIn('fast');
                }).mouseleave(function () {
                    $(this).next().stop().fadeOut('fast');
                });

            },
            topMove: function () {
                var $topMove = $('.top-move');
                $topMove.click(function () {
                    if ($('#fullpage').length > 0) {
                        $.fn.fullpage.moveTo('keyVisual');
                    } else {
                        $("html, body").animate({scrollTop: 0});
                    }
                    return false;
                });
            },
            lang: function () {
                var $target = $('.lang .target');
                $target.click(function (e) {
                    e.preventDefault()
                    if ($(this).data("show") == "no") {
                        $(this).removeClass('active');
                        $('.lang .lang-layer').slideUp('fast');
                        $(this).data("show", "yes");
                    } else {
                        $(this).addClass('active');
                        $('.lang .lang-layer').slideDown('fast');
                        $(this).data("show", "no");
                    }
                });

            },
            historyTab: function () {
                var $window = $(window),
                    $historyTab = $('.history-tabs'),
                    hTabTop = $('.history-tabs').offset().top;
                $window.scroll(function () {
                    if ($(this).scrollTop() > hTabTop) {
                        $historyTab.addClass('fixed');
                    } else {
                        $historyTab.removeClass('fixed');
                    }
                });
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
                    'top': Math.max(0, (($(window).height() - $(targetLayer).height()) / 2) + $(window).scrollTop()) + "px",
                    'left': Math.max(0, (($(window).width() - $(targetLayer).width()) / 2) + $(window).scrollLeft()) + "px"
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

                $(dims).on('click', function () {
                    $("#" + layerID).fadeOut('fast');
                    $('.dims').remove();
                })
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