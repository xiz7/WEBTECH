 $(window).on("scroll", function() {
            if($(window).scrollTop()) {
                  $('nav').addClass('black');
                  
            }
            else {
                  $('nav').removeClass('black');
            }
      });

    window.onscroll = function() {myFunction()};