var express = require('express');
var router = express.Router();
var fs = require('fs');
var imgprocessor = require('../bin/imageprocessing');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('index');
});

router.post('/api/snap',function(req,res){
  if (req.body.image){

    var rawdata = req.body.image.substr(22);
    var buf = new Buffer(rawdata, 'base64');
    var imgproc = new imgprocessor();
    fs.writeFile('tmp/image.png', buf,function(err){
      if(err) {
        res.send('not ok');
      }
      else {
        imgproc.fakeprocess(function(error, stdout, stderr){
          console.log(stdout);
          res.send('ok');
        });
        console.log("Moving on");
      }
    });

  }
  else
  {
    res.send('not ok');
  }

});

module.exports = router;
