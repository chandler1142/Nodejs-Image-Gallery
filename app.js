var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');
var routes = require('./routes');
var handtrack = require('./lib/handtrack.min.js')
const mobilenet = require('@tensorflow-models/mobilenet')
global.fetch = require('node-fetch')
const model = mobilenet.load()

var app = express();

//环境变量
app.set('port', process.env.PORT || 8081);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

const params = {
	weightPath: path.join(__dirname, 'resources\\ssdlitemobilenetv2\\weights_manifest.json'),
	modelPath: path.join(__dirname, 'resources\\ssdlitemobilenetv2\\tensorflowjs_model.pb')
}
handtrack.load(params);

// 开发模式
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.use(express.bodyParser({uploadDir:'./uploads'}));	//用来上传文件

//routes
routes(app);

var server = http.createServer(app).listen(8081);

console.log('serve listening in 8081');

