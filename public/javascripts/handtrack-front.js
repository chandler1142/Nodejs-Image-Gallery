
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var context=canvas.getContext('2d');
var url = "ws://localhost:8082";

var socket = new WebSocket(url);

socket.onopen=onOpen;
function onOpen(event){
    console.log("open connection")
}

socket.onmessage = function(message) {
    console.log("message: "  + message);
    //目前只有predictions
    renderPredictions(message, canvas, context, video);
}

var constraints={
        video:true,
        audio:false
};

navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
    video.srcObject=stream;
    video.play();
}).catch(function(err){

});

setInterval(main ,500);

function main(){
    let start = Date.now();
    drawCanvas();
    readCanvas();
    let end = Date.now();
    console.log("upload cost: " + (end-start));
}

function drawCanvas(){
    context.drawImage(video,0,0, canvas.width, canvas.height);
}

function readCanvas(){
    upload(canvas);
}

function upload(canvas) {
    //将图像输出为base64压缩的字符串  默认为image/png  
    var data = canvas.toDataURL("image/jpeg"); 
    var b64 = data.substring( 22 );  
    //POST到服务器上，生成图片    
    var re=/[\w\u4e00-\u9fa5]/ig;  
    var f_name = Date.now();
    $.ajax({
        type: 'POST',
        url: '/uploadImage',
        data: {
            imgData: b64,
            file_name: f_name
        }
        
    }).done(function(predictions) {
        console.log(predictions);
    });                       
}

//将图片Base64 转成文件
function dataURLtoFile(dataurl, filename) {
    console.log("转文件")
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

function renderPredictions(predictions, canvas, context, mediasource) {

    context.clearRect(0, 0, canvas.width, canvas.height);
    // console.log("render", mediasource.width, mediasource.height)

    context.save();
    // if (this.modelParams.flipHorizontal) {
      context.scale(-1, 1);
      context.translate(-mediasource.width, 0);
    // }
    //draw canvas
    context.drawImage(mediasource, 0, 0, canvas.width, canvas.height);
    context.restore();
    context.font = '10px Arial';

    // console.log('number of detections: ', predictions.length);
    for (let i = 0; i < predictions.length; i++) {
      context.beginPath();
      context.fillStyle = "rgba(255, 255, 255, 0.6)";
      context.fillRect(predictions[i].bbox[0], predictions[i].bbox[1] - 17, predictions[i].bbox[2], 17)
      context.rect(...predictions[i].bbox);

      // draw a dot at the center of bounding box


      context.lineWidth = 1;
      context.strokeStyle = '#0063FF';
      context.fillStyle = "#0063FF" // "rgba(244,247,251,1)";
      context.fillRect(predictions[i].bbox[0] + (predictions[i].bbox[2] / 2), predictions[i].bbox[1] + (predictions[i].bbox[3] / 2), 5, 5)

      context.stroke();
      context.fillText(
        predictions[i].score.toFixed(3) + ' ' + " | hand",
        predictions[i].bbox[0] + 5,
        predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10);
    }

    // Write FPS to top left
    context.font = "bold 12px Arial"
    context.fillText("[FPS]: " + this.fps, 10, 20)
}