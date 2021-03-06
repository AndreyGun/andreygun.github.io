jQuery(document).ready(function($) {



  /********* ANDROID VIBRO *********/
  /* Поддержка только в Android */
  var userAgent = window.navigator.userAgent.toLowerCase();
  var isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|x11/i.test(userAgent);
  navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

  if (navigator.vibrate) {
    $(".vibrate").on("click", function(){
      navigator.vibrate(500);
    });

    $(".vibrate-sos").on("click", function(){
      navigator.vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100]);
    });
  }
  /*
  -------------------END-----------------------
  */

  /********** DEVICE ORIENTATION ********/
  /* Поддержка везде */
  var ball   = document.querySelector('.ball');
  var garden = document.querySelector('.garden');
  var output = document.querySelector('.output-text');

  var maxX = garden.clientWidth  - ball.clientWidth;
  var maxY = garden.clientHeight - ball.clientHeight;

  function handleOrientation(event) {
    var x = event.beta;  // In degree in the range [-180,180]
    var y = event.gamma; // In degree in the range [-90,90]

    output.innerHTML  = "beta : " + x + "\n";
    output.innerHTML += "gamma: " + y + "\n";

    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x >  90) { x =  90};
    if (x < -90) { x = -90};

    /* CHANGE BG EXAMPLE */
    if (y > 0) {  
      $(".step-bg").attr("data-slide", "1");
    } else if (y < - 5) {
      $(".step-bg").attr("data-slide", "2");
    }


    // To make computation easier we shift the range of 
    // x and y to [0,180]
    x += 90;
    y += 90;

    // 10 is half the size of the ball
    // It center the positioning point to the center of the ball
    ball.style.top  = (maxX*x/180 - 10) + "px";
    ball.style.left = (maxY*y/180 - 10) + "px";
  }

  window.addEventListener('deviceorientation', handleOrientation);
  /*
  --------------------END-----------------------
  */

  /********** DEVICE SHAKE ********/
  /* Поддержка везде */

/* для работы нужно подключить скрипт */
/*  https://cdn.rawgit.com/alexgibson/shake.js/master/shake.js"  */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function shakeEventDidOccur () {
    var element = document.getElementById("shake-block");
    var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 255);
    var b = getRandomInt(0, 255);
    element.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
  }

  var shakeEvent = new Shake({threshold: 15});
  shakeEvent.start();
  window.addEventListener('shake', shakeEventDidOccur , false);

  /* stop listening */
  function stopShake(){
    shakeEvent.stop();
  }
  if(!("ondevicemotion" in window)){alert("Not Supported");}
  /*
  --------------------END-----------------------
  */
/* working code top */

  /********** LIGHT SENSOR ********/
  /* Поддержка только в Edge Mobile и Firefox for Android */
  window.addEventListener('devicelight', function(event) {
  var bodyBg = document.body.style;
  //event.value is the lux value returned by the sensor on the device
  if (event.value < 100) {
    alert('Hey, you! You are working in a dark environment');
    bodyBg.backgroundColor="#000";
  } else {
    bodyBg.backgroundColor="#ccc";
  }
  });
  /*
  -------------------END-----------------------
  */

  /* change steps */
  $(".next").on("click", function(){
      var $this = $(this);
      $(".step-item.is-active").removeClass("is-active").next().addClass("is-active");
      if ( $(".step-item.is-active").hasClass("final-step") ) {
        $this.hide();
      }
  });


  /********** VIDEO CAMERA ********/
  /* Android and IOS 11 */
  $(function () {


    var videoContainer = document.getElementById("video-container")
    var startCameraBtn = document.getElementById('showCamera');
    var makePhotoBtn = document.getElementById('makePhoto');
    var video = document.getElementById('camera');
    var canvas = document.getElementById('canvas');
    var photo = document.getElementById('photo');

    
    /* start camera stream function */
    function startCamera() {
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');

      var constraints = {
           audio: false,
           video: {
               facingMode: 'user'
           }
      }
      navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
        video.srcObject = stream;
      });
    }

    /* paint canvas from camera stream */
    function takepicture() {

      /* timefix */
      /* делаем пропорции для канваса чтобы картинка не искажалась */
      var camWidth =  $("#camera").width();
      var camHeight = $("#camera").height();
      /* задаем ширину канваса */
      var canvasWidth = videoContainer.offsetWidth;
      /*задаются пропорции для канваса которые соответсвуют видео*/
      var canvasHeight = canvasWidth / (camWidth / camHeight); 

      var context = canvas.getContext('2d');
      if (camWidth && camHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);

        $("#canvas").addClass("is-visible");

      } else {
        clearphoto();
      }
    }

    /* clear old photo */
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
      

    /* start camera stream click button*/
    startCameraBtn.addEventListener('click', function(){
      startCamera();
      makePhotoBtn.style.display = "block";
      startCameraBtn.style.display = "none";
      $(".camera-text").text("работает камера" );
    });

    /* make photo */
    makePhotoBtn.addEventListener('click', function(ev) {
      $(".camera-text").text("" );
      takepicture();
      makePhotoBtn.style.display = "none";
      videoContainer.style.display = "none";
      ev.preventDefault();
    }, false);
      
  });
});