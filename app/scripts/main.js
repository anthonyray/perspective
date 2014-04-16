/*
* Make sure getUserMedia works with all vendors
*/

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

/*
* Variables
*/
var referenceColor = { red : 65 , green : 173 , blue : 73};
var detection=true;

/*
* DOM Setup
*/

var video = document.getElementById('webcam');
var canvas = document.getElementById('canvas');
var resultCanvas = document.getElementById('resultCanvas');
var ctx = canvas.getContext('2d');
var resultCtx = resultCanvas.getContext('2d');
var grid = null;
var controlPoints;

/*
* Binding DOM Events with functions
*/
$("#detect").click(function(){
  detection = true;
});

$("#stopdetect").click(stopDetectingShape);

$("#snapshot").click(function () {
  if(controlPoints){
    console.log("Ready to send the data");
    var image = snapshot(canvas);
    var data = {points : controlPoints, image : image};
    console.log(data);
    $.ajax({
      type: "POST",
      url: "/api/snap",
      data: data
})
  }

  else
    console.log("Not ready to send the data");
});
/*
* Function that will be executed
*/

function tick(){

  requestAnimationFrame(tick); // Recursive call to make a loop
  if (detection){
    if( video.readyState === video.HAVE_ENOUGH_DATA ) { // Make sure there is something to be captured

      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;

      ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight); // Draw the image to the (invisible) canvas
      var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight); // Get the ImageData from the canvas

      /*
      * Image processing
      */

      grid = new Grid(imageData,20,20);
      grid.process();
      controlPoints = grid.getFourPoints(); // Get the points

      /*
      * Draw the result on the visible Canvas
      */
      //Draw the image
      resultCtx.putImageData(imageData,0,0);

      // Divide by the canvas in 4 quadrants
      divideCanvas(resultCtx);

      // Draw the shape of the detected paper
      drawShape(resultCtx,controlPoints);
    }
  }

}

function divideCanvas(context) {
  context.strokeStyle = "yellow";
  context.lineWidth = 2 ;
  context.beginPath();
  context.moveTo(grid.width / 2,0);
  context.lineTo(grid.width / 2 , grid.height );
  context.closePath();
  context.stroke();
  context.strokeStyle = "yellow";
  context.lineWidth = 2 ;
  context.beginPath();
  context.moveTo(0,grid.height / 2);
  context.lineTo(grid.width , grid.height / 2 );
  context.closePath();
  context.stroke();
}

function drawShape(context,points){
  context.strokeStyle = "green";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(points[0].X , points[0].Y );
  context.lineTo(points[1].X , points[1].Y );
  context.lineTo(points[2].X , points[2].Y );
  context.lineTo(points[3].X , points[3].Y );
  context.closePath();
  context.stroke();
}

function stopDetectingShape(){
  if (detection)
    detection = false;
  else
    alert("The detection hasn't started");
}

function detectShape() {
  requestAnimationFrame(tick);
}

function snapshot(canvas) {
  return canvas.toDataURL('image/png');
}

if (navigator.getUserMedia) { // Make sure the browser has a getUserMedia capability

	navigator.getUserMedia( {video:true}, // Stream the video to the video anchor

	function(stream) {
		video.src = window.URL.createObjectURL(stream); // creates an URL object from the stream and pass it to the video element
    timeoutId = setTimeout( detectShape, 1000);
	}
	,function(){
		alert("Failed getting the stream");
	});

} else {
  alert("This website has a too high level of awesomeness for your browser, please upgrade it");
}
