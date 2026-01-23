$(document).ready(function () {
    // Splash fade out
    $(".splash").fadeOut("slow");

    // Scroll durumuna göre header class değişimi
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > 100) {
            $(".header-main").addClass("header-scroll");
            $(".burger-menu-icon").addClass("burger-scroll");
        } else {
            $(".header-main").removeClass("header-scroll");
            $(".burger-menu-icon").removeClass("burger-scroll");
        }
        $(".header-main").removeClass("sp-header");
        $(".screen-wrap").addClass("deactivate");
    });

    // Menü aç/kapat
    $(".burger-menu-icon").click(function () {
        $(".me-nav").addClass("active");
    });
    $(".close, .nav-bg").click(function () {
        $(".me-nav").removeClass("active");
    });

    // Dil seçimi aç/kapat
    $(".lang-sel").click(function () {
        $(".lang-menu-wrap").addClass("active3");
    });
    $(".lang-menu-bg, .lang-menu-wrap .close").click(function () {
        $(".lang-menu-wrap").removeClass("active3");
    });

    // Form toggle
    $(".ilet-btn").click(function () {
        $(".randevu-form").removeClass("active");
        $(".randevu-btn").removeClass("active");
        $(".ilet-form").toggleClass("active");
        $(".ilet-btn").toggleClass("active");
    });
    $(".randevu-btn").click(function () {
        $(".ilet-form").removeClass("active");
        $(".ilet-btn").removeClass("active");
        $(".randevu-form").toggleClass("active");
        $(".randevu-btn").toggleClass("active");
    });

    // Dil butonu seçimi
    var btnContainer = document.getElementById("langBtnContainer");
    if (btnContainer) {
        var btns = btnContainer.getElementsByClassName("lang-btn");
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function () {
                var current = document.getElementsByClassName("active");
                if (current.length > 0) {
                    current[0].className = current[0].className.replace(" active", "");
                }
                this.className += " active";
            });
        }
    }

    // Currency butonu seçimi
    var btnContainer2 = document.getElementById("currencyBtnContainer");
    if (btnContainer2) {
        var btns2 = btnContainer2.getElementsByClassName("currency-btn");
        for (var i = 0; i < btns2.length; i++) {
            btns2[i].addEventListener("click", function () {
                var current = document.getElementsByClassName("active2");
                if (current.length > 0) {
                    current[0].className = current[0].className.replace(" active2", "");
                }
                this.className += " active2";
            });
        }
    }

    // --- SLICK SLIDER INIT VE EVENT HANDLER ---

    // Görsel slider opacity 1 yapılması için init event’i önce tanımlanmalı
    $('.home-proje-image-slider').on('init', function (event, slick) {
        $(this).css('opacity', '1');
    });

    // Metin slider opacity 1 yapılması için init event’i önce tanımlanmalı
    $('.home-proje-name-slider').on('init', function (event, slick) {
        $(this).css('opacity', '1');
    });

    // Görsel slider başlat
    $('.home-proje-image-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        arrows: false,
        pauseOnHover: false,
        autoplaySpeed: 3000,
        centerMode: true,
        variableWidth: false,
        lazyLoad: false
    });

    // Metin slider başlat
    $('.home-proje-name-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        arrows: false,
        pauseOnHover: false,
        autoplaySpeed: 3000,
        centerMode: false,
        variableWidth: false,
        lazyLoad: false
    });

    // Yorum slider
    $('.comment-slider').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        dots: true,
        arrows: false,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 769, settings: { slidesToShow: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    });

    // Smooth scroll
    $("a.scroll").bind("click", function (event) {
        event.preventDefault();
        var target = $(this).attr("href");
        $("html, body").stop().animate({
            scrollLeft: $(target).offset().left,
            scrollTop: $(target).offset().top
        }, 1200);
    });

    // Video açma-kapatma fonksiyonları
    window.openVid = function () {
        $(".galeri-vidframe-bg").addClass("vid-active");
    };
    window.closeVid = function () {
        $(".galeri-vidframe-bg").removeClass("vid-active");
        $('#vid1')[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    };
});
/* =========================================
   YENİ SLIDER JS KODU (EN ALTA EKLE)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    // Elemanları seç
    var fpItems = document.querySelectorAll('.fp-item');
    var fpImages = document.querySelectorAll('.fp-bg-images img');

    if (fpItems.length > 0) {
        fpItems.forEach(function(item) {
            // Fare kutunun üzerine geldiğinde
            item.addEventListener('mouseenter', function() {
                
                // 1. Tüm 'active' sınıflarını temizle
                fpItems.forEach(function(el) { el.classList.remove('active'); });
                fpImages.forEach(function(img) { img.classList.remove('active'); });

                // 2. Üzerine gelinen kutuyu aktif yap
                this.classList.add('active');

                // 3. İlgili resmi bul ve aktif yap
                var dataId = this.getAttribute('data-id');
                var targetImg = document.querySelector('.fp-bg-images img[data-id="' + dataId + '"]');
                
                if (targetImg) {
                    targetImg.classList.add('active');
                }
            });
        });
    }
});