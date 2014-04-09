/*
* Make sure getUserMedia works with all vendors
*/

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

/*
* 
*/
var video = document.getElementById('webcam');
var canvas = document.getElementById('canvas');
var resultCanvas = document.getElementById('resultCanvas');
var ctx = canvas.getContext('2d');
var resultCtx = resultCanvas.getContext('2d');
var grid = null;
/*
* Function that will be executed 
*/

function tick(){

	requestAnimationFrame(tick); // Recursive call

	if(video.readyState === video.HAVE_ENOUGH_DATA) { // Make sure there is something to be captured
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height; 
		
		ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight); // Draw the image to the (invisible) canvas
		var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight); // Get the ImageData from the canvas

		/*
		* Image processing
		*/
		console.log("Image processsing ...");
		grid = new Grid(imageData,40,40);
		grid.process();
		console.log("Grid data :",grid.data[0]);
		//JSManipulate.pixelate.filter(imageData,20);

		/*
		* Draw the result on the visible Canvas
		*/
		resultCtx.putImageData(imageData,0,0);
	}
}

if (navigator.getUserMedia) { // Make sure the browser has a getUserMedia capability
  
  navigator.getUserMedia( {video:true}, // Stream the video to the video anchor
  	
  	function(stream) {
    	video.src = window.URL.createObjectURL(stream); // creates an URL object from the stream and pass it to the video element
  }
  ,function(){
  	alert("Failed getting the stream");
  });

  setTimeout(function(){

  	requestAnimationFrame(tick);

  },1000)





} else {
  alert("This website has a too high level of awesomeness for your browser, please upgrade it");
}
                       