function Grid(imageData,cellWidth,cellHeight){
	this.image = imageData;
	this.width = imageData.width;
	this.height = imageData.height;
	
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;

	this.gridWidth = Math.floor(this.width / this.cellWidth);
	this.gridHeight = Math.floor(this.height / this.cellHeight);

	this.data = [];
}

Grid.prototype.setPixel = function(x,y,r,g,b){ // Set the RGB Level of a given pixel
	
	this.image.data[((y*(this.width*4)) + (x*4))] = r;
	this.image.data[((y*(this.width*4)) + (x*4)) + 1] = g;
	this.image.data[((y*(this.width*4)) + (x*4)) + 2] = b;
	this.image.data[((y*(this.width*4)) + (x*4)) + 3] = 255;
}

Grid.prototype.getPixel = function(x,y){ // Returns the RGB levels of a pixel given its coordinates
	
	return {
		red : this.image.data[((y*(this.width*4)) + (x*4))] ,
		green : this.image.data[((y*(this.width*4)) + (x*4)) + 1],
		blue : this.image.data[((y*(this.width*4)) + (x*4)) + 2]
	}
}

Grid.prototype.getMeanCellColor = function(X,Y){ // Returns the RGB levels of a area given its coordinates
	var red=0,blue=0,green=0;
	var pixelColor;
	
	for(var x = X*this.cellWidth ; x < X*this.cellWidth + this.cellWidth ; x++){
		for (var y = Y*this.cellHeight ; y < Y*this.cellHeight + this.cellHeight ; y++){
			pixelColor = this.getPixel(x,y);
			red += pixelColor.red
			blue += pixelColor.blue;
			green += pixelColor.green;
		}
	}

	return {red : red / (this.cellWidth * this.cellHeight), green : green / (this.cellWidth * this.cellHeight), blue : blue / (this.cellWidth * this.cellHeight)}
}

Grid.prototype.process = function(){ // Fill the data array of the grid with the mean color of each cell
	var color; 
	for (var X = 0 ; X < this.gridWidth ; X++){
		for (var Y = 0 ; Y < this.gridHeight ; Y++){
			color = this.getMeanCellColor(X,Y);
			color.green = 255 - color.green;
			color.X = X*this.cellWidth; 
			color.Y = Y*this.cellHeight; 
			this.data.push(color);
		}
	}
}

Grid.prototype.getFourPoints = function(){ // Get the points corresponding to the corner of the sheet
	this.data.sort(function(a,b){
		if (a.red > b.red)
		      return 1;
		    if (a.red < b.red)
		      return -1;
		    // a must be equal to b
		    return 0;
	});
}

Grid.prototype.fillCell = function(X,Y,r,g,b){ // Fills a whole cell with the same color

	for(var x = X*this.cellWidth ; x < X*this.cellWidth + this.cellWidth ; x++){
		for (var y = Y*this.cellHeight ; y < Y*this.cellHeight + this.cellHeight ; y++){
			this.setPixel(x,y,r,g,b);
		}
	}
}

Grid.prototype.fillMeanCellColor = function(X,Y) { // Fills a whole cell with the color of the mean color of its pixels
	var colors = this.getMeanCellColor(X,Y);
	this.fillCell(X,Y,colors.red,colors.green,colors.blue);
};

Grid.prototype.fillGridMeanCellColor = function(){ // Fils the entire grid 
	var colors; 
	for (var X = 0 ; X < this.gridWidth ; X++){
		for (var Y = 0 ; Y < this.gridHeight ; Y++){
			colors = this.getMeanCellColor(X,Y);
			this.fillCell(X,Y,colors.red,colors.green,colors.blue);
		}
	}
}


