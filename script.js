$(document).ready(function() {
  function scroll() {
    $("html, body").animate({
      //scrollTop: $(document).height()
      }
      , 1000);
  }
  setTimeout(scroll, 2500);
  $('.popup-btn').on('click', function(){
    $(this).closest('.popup-block').fadeOut();
  });

  function randomText(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  }
  $('.like-count').each(function(){
    $(this).text(randomText(9000, 20000));
  });
  
  /*step switch*/
  function nextStep(){
    currentStep++;
    $step.hide().eq(currentStep).fadeIn();
  }
  function bgChange(){
    $('.slider-item').removeClass('active').eq(currentSwipe).addClass('active');
    $('.slider-item').eq(currentSwipe+1).addClass('preload');
  }
  var $btnNext = $('.step-btn');
  var currentStep = 0;
  var $step = $('.step-item');
  $('.dislike-btn').on('click', function() {
    var $slide = $swipe.eq(contentLength - currentSwipe-1);
    changeSlide($slide,'left');
  });

  $('.like-btn').on('click', function() {
    var $slide = $swipe.eq(contentLength - currentSwipe-1);
    changeSlide($slide,'right');
  });
  //TOUCH
  var startX;
  var endX;
  var changeMargin = 100;
  var delta = 0;
  var $swipe =  $('.step-content');
  var swipeIsBlocked = false;
  var slideCount = $swipe.length;
  var currentSwipe = 0;
  var contentLength = $('.step-content').length;
  var swipeElemEnd = false;
  //set z-index
  $swipe.each(function(indx){
    $(this).css({
      'z-index': $(this).index()+1}
    );
  });
  $swipe.on('touchstart', function (e){
    startX = e.originalEvent.touches[0].clientX;
  });
  $swipe.on('touchmove', function (e) {
    if (!swipeIsBlocked){
      endX = e.originalEvent.changedTouches[0].clientX;
      delta = startX - endX;
      movingSlide($(this),delta);
    }
  });
  $swipe.on('touchend mouseup', function(e) {
    if (!swipeIsBlocked){
      onSwipeEnd($(this));
      $(this).off('mousemove');
    }
  });
  $swipe.on('mousedown', function (e) {
    startX = e.clientX;
    $(this).on('mousemove', function (e) {
      if (!swipeIsBlocked){
        endX = e.clientX;
        delta = startX - endX;
        movingSlide($(this),delta);
      }
    });
  });
  function changeSlide($slide,way){
    if (!swipeElemEnd){
      swipeIsBlocked = true;
      currentSwipe++;
      $slide.addClass('swiped '+way).fadeOut(400);
      if (currentSwipe < contentLength){
        bgChange();
      }
      else{
        swipeElemEnd = true;
        nextStep();
      }
      setTimeout(function(){
        swipeIsBlocked = false;
      },400);
    }
  }
  function movingSlide($slide,delta){
    //color border
    if (delta > 0 & delta > changeMargin) {
      $slide.css({
        'border-color' : '#fd3c3c'}
      );
    }
    else if (delta < 0 & delta < -changeMargin) {
      $slide.css({
        'border-color' : '#3fea0c'}
      );
    }
    var angel = -(delta/30);
    $slide.css({
      'transform' :'translateX('+(-delta)+'px) rotate('+angel+'deg)'}
    );
  }
  function onSwipeEnd($elem){
    if (delta > 0 & delta > changeMargin) {
      $('.dislike-btn').trigger('click');
    }
    else if (delta < 0 & delta < -changeMargin) {
      $('.like-btn').trigger('click');
    }
    if(!$elem.is('swiped')){
      $elem.removeAttr('style');
      $elem.css({
        'z-index' : $elem.index()+1}
      );
    }
  }

});


