jQuery(document).ready(function($) {
  function changeFavicon(src) {
    $('link[rel="shortcut icon"]').attr('href', src);
  }
  function scroll() {
    $("html, body").animate({
      scrollTop: $('.step-block').offset().top
      }
      , 1000);
  }
  setTimeout(scroll, 1000);
  /*** Set title ***/
  document.title = 'Earn Free Gifts Here';
  /*** Set favicon ***/
  changeFavicon($(".favicon-src").attr("src"));
  /*** Change steps ***/
  var currentStep = 1;
  var $buttonsBlock = $(".button-block");
  var isButtonClicked = false;
  $(".step-btn").not(".submit-btn").on("click", function () {
    if (isButtonClicked) return;
    isButtonClicked = true;
    $(this).addClass("is-active");
    var $currentStepItem = $(this).closest(".step-item");
    $currentStepItem.addClass("is-hidden").on("animationend webkitAnimationEnd", function(){
      $currentStepItem.hide().next().fadeIn();
      $(".wrapper").attr("data-step", ++currentStep);
      $(".current-step").text(currentStep);
      isButtonClicked = false;
    });
  });
  /*** Hide popup and play audio ***/
  var $video = $("#sound-video")[0];
  $(".popup-btn").on("click", function () {
    $(".popup-block").removeClass("is-visible");
    $video.play();
  }
                     );
  /*** Play/Pause video ***/
  $(".sound-btn").on("click", function () {
    $(this).toggleClass("is-inactive");
    if ($video.paused) {
      $video.play();
    }
    else $video.pause();
  }
                     );
  $('[data-href]').each(function(i, elem) {
    var urlStopTransferParams = ['tdsId', 'tds_campaign'];
    var href = $(this).data('href');
    var originUrlParams = getParamsFromUrl(window.location.href),
        targetUrlParams = getParamsFromUrl(href);
    for (var param in originUrlParams) {
      if (!~urlStopTransferParams.indexOf(param)) {
        targetUrlParams[param] = originUrlParams[param];
      }
    }
    var targetUrlParamsArr = Object.keys(targetUrlParams).map(function(key) {
      return key+'='+targetUrlParams[key];
    }
                                                              );
    href = href.split('?')[0] + '?' + targetUrlParamsArr.join('&');
    $(this).attr('href', href);
  }
                        );
  function getParamsFromUrl(url) {
    var params = {
    }
    ,
        parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
          params[key] = value;
        }
                            );
    return params;
  }
}
                       );
