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
  var output = document.querySelector('.output');

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


  /********** VIDEO CAMERA ********/
  /*-------------------END-----------------------
  */
  // Put variables in global scope to make them available to the browser console.

  // const constraints = window.constraints = {
  //   audio: false,
  //   video: true
  // };


  // function handleError(error) {
  //   if (error.name === 'ConstraintNotSatisfiedError') {
  //     let v = constraints.video;
  //     errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  //   } else if (error.name === 'PermissionDeniedError') {
  //     errorMsg('Permissions have not been granted to use your camera and ' +
  //       'microphone, you need to allow the page access to your devices in ' +
  //       'order for the demo to work.');
  //   }
  //   errorMsg(`getUserMedia error: ${error.name}`, error);
  // }

  // function errorMsg(msg, error) {
  //   const errorElement = document.querySelector('#errorMsg');
  //   errorElement.innerHTML += `<p>${msg}</p>`;
  //   if (typeof error !== 'undefined') {
  //     console.error(error);
  //   }
  // }

  // function handleSuccess(stream) {
  //   //var videoTracks = stream.getVideoTracks();

  //   //console.log('Got stream with constraints:', constraints);
  //   //console.log(`Using video device: ${videoTracks[0].label}`);

  //   var video = document.querySelector('video');
  //   //window.stream = stream; // make variable available to browser console
  //   video.srcObject = stream;
  // }

  // async function init(e) {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     handleSuccess(stream);
  //     e.target.disabled = true;
  //   } catch (e) {
  //     handleError(e);
  //   }
  // }

  
  // $(".camera-btn").on("click",function(e){
  //   init(e);
  //   $(".camera-text").text("GO NAHUI!");
  // });


  $(function () {
    video = document.getElementById('camera');
    video.style.width = document.width + 'px';
    video.style.height = document.height + 'px';
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    var constraints = {
         audio: false,
         video: {
             facingMode: 'user'
         }
    }
    $(".camera-btn").on("click",function(){
      console.log("gggg");
      navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
          video.srcObject = stream;
      });
    });
});

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
});
