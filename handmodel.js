
var handtrack = require('./lib/handtrack.min.js')
var model = null;

const {createCanvas, Image} = require('canvas');
const canvas = createCanvas(width, height);
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

var detect = function(img) {
	ctx.drawImage(img, 0, 0, width, height);
	return this.model.detect(img);
};

module.exports.load = load;
module.exports.detect = detect;


