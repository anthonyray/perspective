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
			color.distance = Math.sqrt( (color.red - referenceColor.red)*(color.red - referenceColor.red) + (color.green - referenceColor.green)*(color.green - referenceColor.green) + (color.blue - referenceColor.blue)*(color.blue - referenceColor.blue) );
			color.X = X*this.cellWidth;
			color.Y = Y*this.cellHeight;
			this.data.push(color);
		}
	}
}

Grid.prototype.getFourPoints = function(){ // Get the points corresponding to the corner of the sheet
	var self = this;
	var quadrant1 = this.data.filter(function(element){ // Superior quadrant
		return (element.X <= (self.width / 2)) && (element.Y <= (self.height / 2 )) ;
	}).sort(function(a,b) { return parseInt(a.distance,10) - parseInt(b.distance,10) });

	var quadrant2 = this.data.filter(function(element){
		return (element.X >= (self.width / 2)) && (element.Y <= (self.height / 2 )) ;
	}).sort(function(a,b) { return parseInt(a.distance,10) - parseInt(b.distance,10) });

	var quadrant4 = this.data.filter(function(element){
		return (element.X <= (self.width / 2)) && (element.Y >= (self.height / 2 )) ;
	}).sort(function(a,b) { return parseInt(a.distance,10) - parseInt(b.distance,10) });

	var quadrant3 = this.data.filter(function(element){
		return (element.X >= (self.width / 2)) && (element.Y >= (self.height / 2 )) ;
	}).sort(function(a,b) { return parseInt(a.distance,10) - parseInt(b.distance,10) });

	return [quadrant1[0],quadrant2[0],quadrant3[0],quadrant4[0]];

	/*this.data.sort(function(a,b) { return parseInt(a.distance,10) - parseInt(b.distance,10) });
	return [this.data[0],this.data[1],this.data[2],this.data[3]];*/
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
