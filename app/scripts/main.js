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
var referenceColor = { red : 54 , green : 126 , blue : 79};
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
		
		grid = new Grid(imageData,30,30);
		grid.process();
		//grid.fillGridMeanCellColor();
		var points = grid.getFourPoints(); // Get the points 

		/*
		* Draw the result on the visible Canvas
		*/

		//$("#info").text( "Distance : " + Math.floor(grid.data[0].distance) + ", R : " + Math.floor(grid.data[0].red) + " , G : " + Math.floor(grid.data[0].green) + ", B : " + Math.floor(grid.data[0].blue) );
		$('#info').html( 'X : '+ points[0].X + ' Y: ' + points[0].Y + ' dist : ' + points[0].distance + '<br>' +
		 'X : '+ points[1].X + ' Y: ' + points[1].Y + ' dist : ' + points[1].distance + "<br>" +
		 "X : "+ points[2].X + " Y: " + points[2].Y + " dist : " + points[2].distance + "<br>" +
		 "X : "+ points[3].X + " Y: " + points[3].Y + " dist : " + points[3].distance + "<br>");
		/*grid.fillCell(points[0].X,points[0].Y,255,0,0);
		grid.fillCell(points[1].X,points[1].Y,255,0,0);
		grid.fillCell(points[2].X,points[2].Y,255,0,0);
		grid.fillCell(points[3].X,points[3].Y,255,0,0);*/

		// Draw the shape of the paper detected
		resultCtx.putImageData(imageData,0,0);
		resultCtx.strokeStyle = "green";
		resultCtx.lineWidth = 5;
		resultCtx.beginPath();
		resultCtx.moveTo(points[0].X , points[0].Y );
		resultCtx.lineTo(points[1].X , points[1].Y );
		resultCtx.lineTo(points[3].X , points[3].Y );
		resultCtx.lineTo(points[2].X , points[2].Y );
		resultCtx.closePath();
		resultCtx.stroke();
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
	},1000);

} else {
  alert("This website has a too high level of awesomeness for your browser, please upgrade it");
}
                       