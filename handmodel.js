var images = require("images");
var handtrack = require('./lib/handtrack.min.js')
var ws = require('./wsserver')

var model = null;

const {createCanvas, loadImage} = require('canvas');

var load = function() {
	
	const modelParams = {
		flipHorizontal: true, // flip e.g for video  
		maxNumBoxes: 1, // maximum number of boxes to detect
		iouThreshold: 0.5, // ioU threshold for non-max suppression
		scoreThreshold: 0.6, // confidence threshold for predictions.
	}
	handtrack.load(modelParams).then(lmodel =>{
		this.model = lmodel;
		console.log("lmodel loaded...");
		this.detect('public/test/1556066948520.jpeg')
		console.log("test done...")
	});
};

var detect = function(data) {
	console.log("start to handle data : " + data);
	loadImage(data).then(img => {
		console.log("processing data : " + data);
		var canvas = new createCanvas(img.width, img.height);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, img.width, img.height);
		ctx.stroke();
		this.model.detect(canvas).then(predictions => {
			console.log("processed data : " + data);
			console.log("predictions: " + JSON.stringify(predictions));
			ws.sendAll(JSON.stringify(predictions));
		});
	});


	// console.log(data);
	// var img = images(data);
	// console.log(img.width());
	// console.log(img.height());
	// ctx.drawImage(img, 0, 0, 450, 388);
	// ctx.stroke();
	// var predictions = this.model.detect(canvas).then(predictions => {
	// 	console.log("predictions: " + JSON.stringify(predictions));
	// 	return predictions;
	// });
	// return predictions;
};

module.exports.load = load;
module.exports.detect = detect;


