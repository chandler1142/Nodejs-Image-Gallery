var images = require("images");
var handtrack = require('./lib/handtrack.min.js')

var model = null;

const {createCanvas, Image} = require('canvas');
const canvas = createCanvas(450, 338);
const ctx = canvas.getContext('2d');

var load = function() {
	// body...
	// const params = {
	// 	weightPath: path.join(__dirname, 'resources\\ssdlitemobilenetv2\\weights_manifest.json'),
	// 	modelPath: path.join(__dirname, 'resources\\ssdlitemobilenetv2\\tensorflowjs_model.pb')
	// }
	handtrack.load().then(lmodel =>{
		this.model = lmodel;
		console.log("lmodel loaded...");
	});
};

var detect = function(data) {
	var img = images(data);
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var predictions = this.model.detect(canvas).then(predictions => {
		console.log("predictions: " + JSON.stringify(predictions));
		return predictions;
	});
	return predictions;
};

module.exports.load = load;
module.exports.detect = detect;


