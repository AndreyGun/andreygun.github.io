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



 // try to take a picture
  /* working code bottom */
  /********** VIDEO CAMERA ********/
  $(function () {
    var width = 300;
    var height = 150;
    var startbutton = document.getElementById('makePhoto');
    var video = document.getElementById('camera');
    var canvas = document.getElementById('canvas');
    var photo = document.getElementById('photo');

      
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
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
      });
    }
      

    // start camera
    $("#showCamera").on("click", function() {
      startCamera();
      $(".camera-text").text("camera work1" );
    });

    // make photo
    startbutton.addEventListener('click', function(ev){
      $(".camera-text").text("make photo!2" );
      takepicture();
      ev.preventDefault();
    }, false);

    // remove old photo
    clearphoto();


    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        //context.drawImage(drawImg, 0, 0, width, height);
        //console.log("1");
        //var data = canvas.toDataURL('image/png');
        //console.log("2");
        //photo.setAttribute('src', data);
      } else {
        clearphoto();
      }
    }

    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);

      //var data = canvas.toDataURL('image/png');
      //photo.setAttribute('src', data);
    }
      
  });

// (function() {

//   var width = 320; 
//   var height = 0;
//   var streaming = false;

//   function startup() {
//     video = document.getElementById('camera');
//     canvas = document.getElementById('canvas');
//     photo = document.getElementById('photo');
//     startbutton = document.getElementById('makePhoto');
//     drawImg = document.getElementById('drawImg');

//     navigator.getMedia = ( navigator.getUserMedia ||
//                            navigator.webkitGetUserMedia ||
//                            navigator.mozGetUserMedia ||
//                            navigator.msGetUserMedia);

//     navigator.getMedia(
//       {
//         video: true,
//         audio: false
//       },
//       function(stream) {
//         var vendorURL = window.URL || window.webkitURL;
//         video.src = vendorURL.createObjectURL(stream);
//         video.play();
//       },
//       function(err) {
//         console.log("An error occured! " + err);
//       }
//     );

//     video.addEventListener('canplay', function(ev){
//       if (!streaming) {
//         height = video.videoHeight / (video.videoWidth/width);
      
//         video.setAttribute('width', width);
//         video.setAttribute('height', height);
//         canvas.setAttribute('width', width);
//         canvas.setAttribute('height', height);
//         streaming = true;
//       }
//     }, false);

//     startbutton.addEventListener('click', function(ev){
//      $(".camera-text").text("camera work and photo111" );
//       takepicture();
//       //ev.preventDefault();
//     }, false);
    
//     clearphoto();
//   }


//   function clearphoto() {
//     var context = canvas.getContext('2d');
//     context.fillStyle = "#AAA";
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     var data = canvas.toDataURL('image/png');
//     photo.setAttribute('src', data);
//   }

//   function takepicture() {
//     var context = canvas.getContext('2d');
//     if (width && height) {
//       canvas.width = width;
//       canvas.height = height;
//       context.drawImage(video, 0, 0, width, height);
    
//       var data = canvas.toDataURL('image/png');
//       console.log(data);
//       photo.setAttribute('src', data);
//     } else {
//       clearphoto();
//     }
//   }
//   window.addEventListener('load', startup, false);
// })();

});