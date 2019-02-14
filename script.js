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



    /* change bg */
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

  //stop listening
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
      $(".step-item.is-active").removeClass("is-active").next().addClass("is-active");
  });


  /* working code bottom */
  /********** VIDEO CAMERA ********/
  $(function () {
    var width = 150;
    var height = 150;
    var startbutton = document.getElementById('makePhoto');
    var video = document.getElementById('camera');
    var canvas = document.getElementById('canvas');
    var photo = document.getElementById('photo');

      
    function startCamera() {
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');

      // var constraints = {
      //      audio: false,
      //      video: {
      //          facingMode: 'user'
      //      }
      // }
      // navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
      //   video.srcObject = stream;
      //   video.setAttribute('width', width);
      //   video.setAttribute('height', height);
      //   //canvas.setAttribute('width', width);
      //   //canvas.setAttribute('height', height);
      // });
      // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function(constraints) {

            // First get ahold of the legacy getUserMedia, if present
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
              return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function(resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          }
        }

        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function(stream) {
          var video = document.querySelector('camera');
          // Older browsers may not have srcObject
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(stream);
          }
          video.onloadedmetadata = function(e) {
            video.play();
          };
        })
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
        });

    }
      

    // start camera
    $("#showCamera").on("click", function() {
      startCamera();
      $(".camera-text").text("работает камера 1" );
    });

    // make photo
    startbutton.addEventListener('click', function(ev){
      $(".camera-text").text("сделать фотку 1" );
      takepicture();
      ev.preventDefault();
    }, false);

    // remove old photo
    clearphoto();


    function takepicture() {
      var camW =  $("#camera").width();
      var camH = $("#camera").height();
      var canvasW = 200;
      var canvasH = canvasW / (camW / camH);
      $("#canvas").css({
        width: canvasW,
        height: canvasH
      });
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = canvasW;
        canvas.height = canvasH;
        context.drawImage(video, 0, 0, canvasW, canvasH);

        $("#canvas").addClass("is-visible");
    
        // var data = canvas.toDataURL('image/png');
        // console.log(data);
        // photo.setAttribute('src', data);

      } else {
        clearphoto();
      }
    }

    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
      
  });
});