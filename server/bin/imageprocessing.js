var exec = require('child_process').exec;

module.exports = function(points,imgsrc,imgdest){
  this.script = '';
  this.points = points;
  this.imgsrc = imgsrc;
  this.imgdest = imgdest;
}

module.exports.prototype.generateScript = function () {
  this.script = "convert " + this.imgsrc + " -matte -virtual-pixel transparent -distort Perspective '"
  + 324 + "," + 127 + " "+324+","+127+"   "+775+","+134+" "+775+","+134+"   "+994+","+686+" "+775+","+687+"   "+57+","+675+" "+324+","+681+
  "' - | convert - -flip - | convert - -crop 443x538+326+41  " + this.imgdest ;
};

module.exports.prototype.fakeprocess = function (cb) {
  exec('convert tmp/image.png -flip tmp/newimage.png ',cb);
};

module.exports.prototype.process = function (callback) {
  exec(this.script,callback);
};
