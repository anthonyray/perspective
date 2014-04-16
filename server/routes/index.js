var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('index');
});

router.post('/api/snap',function(req,res){
  if (req.body.image){

    var rawdata = req.body.image.substr(22);
    var buf = new Buffer(rawdata, 'base64');
    fs.writeFile('tmp/image.png', buf);
    res.send('ok');
  }
  else
  {
    res.send('not ok');
  }

});

module.exports = router;
