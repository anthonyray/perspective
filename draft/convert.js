var im = require('imagemagick');
im.readMetadata('newmodel.jpg', function(err,metadata){
	if(err){
		console.log("It failed");

	}
	else
	{
		console.log('swag : ',metadata);
	}
});