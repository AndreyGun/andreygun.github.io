$(document).ready(function() {
  var i = 0;
  $("button").on("click touch", function(){
    var side = $(this).attr("data-side");
    console.log(side);
    var x = $(".my-own-footer").find("." + side).text();
    x++;
    $(".my-own-footer").find("." + side).text(x);
  })
});