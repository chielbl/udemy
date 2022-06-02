/* When the page is loaded */
$(document).ready(function() {
    /* By clicking on a HTML element we change the CSS 
    $('h1').click(function() {
        $(this).css('background-color','red')
    })
    */


   $('.js--section-features').waypoint(function(direction){
       if (direction == "down"){
            $('nav').addClass('sticky')
       }
       else {
           $('nav').removeClass('sticky')
       }
   },{
       offset: '60px;' /* Get some on the pase where we show the nav. So, it show earlier */
   })

   /* Scroll on buttons */
   /* select this class and click on it .. */
   $('.js--scroll-to-plan').click(function(){
       /* when we click -> we add an animation on the page that scroll to the top go to that class with a speed of 1000 milisecond (1sec)*/
       $('html,body').animate({scrollTop: $('.js--section-plans').offset().top},1000)
   })

   /* select this class and click on it .. */
   $('.js--scroll-to-start').click(function(){
    /* when we click -> we add an animation on the page that scroll to the top go to that class with a speed of 1000 milisecond (1sec)*/
        $('html,body').animate({scrollTop: $('.js--section-features').offset().top},1000)
    })

    /* Navigation scroll */
    $(function() {
        /* select 'a' element that start with an 'href' and # symbol and click */
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            /* If element exist than we have that animation */
            if (target.length) {
                $('html,body').animate({
                scrollTop: target.offset().top
                }, 1000);
                return false;
            }
            }
        });
    });

    /* Animation on scroll */
    $('.js--wp-1').waypoint(function(direction) {
        $('.js--wp-1').addClass('animated fadeIn');
    }, {
        offset:'50%'
    });

    $('.js--wp-2').waypoint(function(direction) {
        $('.js--wp-2').addClass('animated fadeInUp');
    }, {
        offset:'50%'
    });

    $('.js--wp-3').waypoint(function(direction) {
        $('.js--wp-3').addClass('animated fadeIn');
    }, {
        offset:'50%'
    });

    $('.js--wp-4').waypoint(function(direction) {
        $('.js--wp-4').addClass('animated pulse');
    }, {
        offset:'50%'
    });

    /* Mobile naviagtion */

    $('.js--nav-icon').click(function() {
        var nav= $('.js--main-nav');
        var icon= $('.js--nav-icon i');

        nav.slideToggle(200);
        if (icon.hasClass('ion-navicon-round')) {
            icon.removeClass('ion-navicon-round');
            icon.addClass('ion-close-round');
        }
        else {
            icon.removeClass('ion-close-round');
            icon.addClass('ion-navicon-round');
        }
    })
});