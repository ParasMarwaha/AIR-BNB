(function ($) {
    "use strict";
    function handlePreloader() {
        if ($('.preloader').length) {
            $('.preloader').delay(200).fadeOut(500);
        }
    }

    function headerStyle() {
        if ($('.main-header').length) {
            var windowpos = $(window).scrollTop();
            var siteHeader = $('.header-style-one');
            var scrollLink = $('.scroll-to-top');
            var sticky_header = $('.main-header .sticky-header');
            if (windowpos > 100) {
                sticky_header.addClass("fixed-header animated slideInDown");
                scrollLink.fadeIn(300);
            } else {
                sticky_header.removeClass("fixed-header animated slideInDown");
                scrollLink.fadeOut(300);
            }
            if (windowpos > 1) {
                siteHeader.addClass("fixed-header");
            } else {
                siteHeader.removeClass("fixed-header");
            }
        }
    }

    headerStyle();
    if ($('.main-header li.dropdown ul').length) {
        $('.main-header .navigation li.dropdown').append('<div class="dropdown-btn"><i class="fa fa-angle-down"></i></div>');
    }
    if ($('.hidden-bar').length) {
        $('.toggle-hidden-bar').on('click', function () {
            $('body').addClass('active-hidden-bar');
        });
        $('.hidden-bar-back-drop, .hidden-bar .close-btn').on('click', function () {
            $('body').removeClass('active-hidden-bar');
        });
    }
    if ($('.mobile-menu').length) {
        var mobileMenuContent = $('.main-header .main-menu .navigation').html();
        $('.mobile-menu .navigation').append(mobileMenuContent);
        $('.sticky-header .navigation').append(mobileMenuContent);
        $('.mobile-menu .close-btn').on('click', function () {
            $('body').removeClass('mobile-menu-visible');
        });
        $('.mobile-menu li.dropdown .dropdown-btn').on('click', function () {
            $(this).prev('ul').slideToggle(500);
            $(this).toggleClass('active');
            $(this).prev('.mega-menu').slideToggle(500);
        });
        $('.mobile-nav-toggler').on('click', function () {
            $('body').addClass('mobile-menu-visible');
        });
        $('.mobile-menu .menu-backdrop, .mobile-menu .close-btn').on('click', function () {
            $('body').removeClass('mobile-menu-visible');
        });
    }
    if ($('.search-btn').length) {
        $('.search-btn').on('click', function () {
            $('.main-header').addClass('moblie-search-active');
        });
        $('.close-search, .search-back-drop').on('click', function () {
            $('.main-header').removeClass('moblie-search-active');
        });
    }
    if ($('.service-three-slider').length) {
        var swiper = new Swiper(".service-three-slider", {
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',},
            breakpoints: {
                320: {slidesPerView: 1,},
                576: {slidesPerView: 1,},
                768: {slidesPerView: 2,},
                992: {slidesPerView: 2,},
                1023: {slidesPerView: 3,},
                1400: {slidesPerView: 4,},
            },
        });
    }
    if ($('.filter-list').length) {
        $('.filter-list').mixItUp({});
    }
    if ($('.dial').length) {
        $('.dial').appear(function () {
            var elm = $(this);
            var color = elm.attr('data-fgColor');
            var perc = elm.attr('value');
            elm.knob({
                'value': 0,
                'min': 0,
                'max': 100,
                'skin': 'tron',
                'readOnly': true,
                'thickness': 0.15,
                'dynamicDraw': true,
                'displayInput': false
            });
            $({value: 0}).animate({value: perc}, {
                duration: 2000, easing: 'swing', progress: function () {
                    elm.val(Math.ceil(this.value)).trigger('change');
                }
            });
            $(this).append(function () {
            });
        }, {accY: 20});
    }
    if ($('.accordion-box').length) {
        $(".accordion-box").on('click', '.acc-btn', function () {
            var outerBox = $(this).parents('.accordion-box');
            var target = $(this).parents('.accordion');
            if ($(this).hasClass('active') !== true) {
                $(outerBox).find('.accordion .acc-btn').removeClass('active ');
            }
            if ($(this).next('.acc-content').is(':visible')) {
                return false;
            } else {
                $(this).addClass('active');
                $(outerBox).children('.accordion').removeClass('active-block');
                $(outerBox).find('.accordion').children('.acc-content').slideUp(300);
                target.addClass('active-block');
                $(this).next('.acc-content').slideDown(300);
            }
        });
    }
    if ($('.count-box').length) {
        $('.count-box').appear(function () {
            var $t = $(this), n = $t.find(".count-text").attr("data-stop"),
                r = parseInt($t.find(".count-text").attr("data-speed"), 10);
            if (!$t.hasClass("counted")) {
                $t.addClass("counted");
                $({countNum: $t.find(".count-text").text()}).animate({countNum: n}, {
                    duration: r,
                    easing: "linear",
                    step: function () {
                        $t.find(".count-text").text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $t.find(".count-text").text(this.countNum);
                    }
                });
            }
        }, {accY: 0});
    }
    if ($('.testimonial-slider').length) {
        var slider = new Swiper('.testimonial-slider', {
            slidesPerView: 1,
            navigation: true,
            centeredSlides: true,
            loop: true,
            loopedSlides: 6,
            navigation: {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',},
        });
        var thumbs = new Swiper('.testimonial-thumbs', {
            slidesPerView: 'auto',
            spaceBetween: 0,
            centeredSlides: true,
            loop: true,
            slideToClickedSlide: true,
        });
        slider.controller.control = thumbs;
        thumbs.controller.control = slider;
    }
    if ($('.product-details .bxslider').length) {
        $('.product-details .bxslider').bxSlider({
            nextSelector: '.product-details #slider-next',
            prevSelector: '.product-details #slider-prev',
            nextText: '<i class="fa fa-angle-right"></i>',
            prevText: '<i class="fa fa-angle-left"></i>',
            mode: 'fade',
            auto: 'true',
            speed: '700',
            pagerCustom: '.product-details .slider-pager .thumb-box'
        });
    }
    ;
    if ($('.tabs-box').length) {
        $('.tabs-box .tab-buttons .tab-btn').on('click', function (e) {
            e.preventDefault();
            var target = $($(this).attr('data-tab'));
            if ($(target).is(':visible')) {
                return false;
            } else {
                target.parents('.tabs-box').find('.tab-buttons').find('.tab-btn').removeClass('active-btn');
                $(this).addClass('active-btn');
                target.parents('.tabs-box').find('.tabs-content').find('.tab').fadeOut(0);
                target.parents('.tabs-box').find('.tabs-content').find('.tab').removeClass('active-tab animated fadeIn');
                $(target).fadeIn(300);
                $(target).addClass('active-tab animated fadeIn');
            }
        });
    }
    $(".quantity-box .add").on("click", function () {
        if ($(this).prev().val() < 999) {
            $(this).prev().val(+$(this).prev().val() + 1);
        }
    });
    $(".quantity-box .sub").on("click", function () {
        if ($(this).next().val() > 1) {
            if ($(this).next().val() > 1)
                $(this).next().val(+$(this).next().val() - 1);
        }
    });
    if ($('.price-range-slider').length) {
        $(".price-range-slider").slider({
            range: true, min: 10, max: 99, values: [10, 60], slide: function (event, ui) {
                $("input.property-amount").val(ui.values[0] + " - " + ui.values[1]);
            }
        });
        $("input.property-amount").val($(".price-range-slider").slider("values", 0) + " - $" + $(".price-range-slider").slider("values", 1));
    }
    if ($(".count-bar").length) {
        $(".count-bar").appear(function () {
            var el = $(this);
            var percent = el.data("percent");
            $(el).css("width", percent).addClass("counted");
        }, {accY: -50});
    }
    if ($('.tabs-box').length) {
        $('.tabs-box .tab-buttons .tab-btn').on('click', function (e) {
            e.preventDefault();
            var target = $($(this).attr('data-tab'));
            if ($(target).is(':visible')) {
                return false;
            } else {
                target.parents('.tabs-box').find('.tab-buttons').find('.tab-btn').removeClass('active-btn');
                $(this).addClass('active-btn');
                target.parents('.tabs-box').find('.tabs-content').find('.tab').fadeOut(0);
                target.parents('.tabs-box').find('.tabs-content').find('.tab').removeClass('active-tab animated fadeIn');
                $(target).fadeIn(300);
                $(target).addClass('active-tab animated fadeIn');
            }
        });
    }
    if ($('.progress-line').length) {
        $('.progress-line').appear(function () {
            var el = $(this);
            var percent = el.data('width');
            $(el).css('width', percent + '%');
        }, {accY: 0});
    }
    if ($('.lightbox-image').length) {
        $('.lightbox-image').fancybox({openEffect: 'fade', closeEffect: 'fade', helpers: {media: {}}});
    }
    if ($('.scroll-to-target').length) {
        $(".scroll-to-target").on('click', function () {
            var target = $(this).attr('data-target');
            $('html, body').animate({scrollTop: $(target).offset().top}, 0);
        });
    }
    if ($('.wow').length) {
        var wow = new WOW({boxClass: 'wow', animateClass: 'animated', offset: 0, mobile: false, live: true});
        wow.init();
    }
    var $onepage_nav = $('.onepage-nav');
    var $sections = $('section');
    var $window = $(window);

    function TM_activateMenuItemOnReach() {
        if ($onepage_nav.length > 0) {
            var cur_pos = $window.scrollTop() + 2;
            var nav_height = $onepage_nav.outerHeight();
            $sections.each(function () {
                var top = $(this).offset().top - nav_height - 80, bottom = top + $(this).outerHeight();
                if (cur_pos >= top && cur_pos <= bottom) {
                    $onepage_nav.find('a').parent().removeClass('current').removeClass('active');
                    $sections.removeClass('current').removeClass('active');
                    $onepage_nav.find('a[href="#' + $(this).attr('id') + '"]').parent().addClass('current').addClass('active');
                }
                if (cur_pos <= nav_height && cur_pos >= 0) {
                    $onepage_nav.find('a').parent().removeClass('current').removeClass('active');
                    $onepage_nav.find('a[href="#header"]').parent().addClass('current').addClass('active');
                }
            });
        }
    }

    $(window).on('scroll', function () {
        headerStyle();
        TM_activateMenuItemOnReach();
    });
    $(window).on('load', function () {
        handlePreloader();
    });
})(window.jQuery);