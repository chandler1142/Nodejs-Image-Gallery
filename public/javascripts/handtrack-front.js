
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var context=canvas.getContext('2d');
var url = "ws://localhost:8080/wsServer";

// var socket = new WebSocket(url);

// socket.onopen=onOpen;
// function onOpen(event){

// }

var constraints={
        video:true,
        audio:false
};

navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
    video.srcObject=stream;
    video.width = video.width || 640;
    video.height = video.height || video.width * (3 / 4)
    video.play();
}).catch(function(err){

});

// setInterval(main ,500);

function main(){
    let start = Date.now();
    drawCanvas();
    readCanvas();
    drawCanvas();
    let end = Date.now();
    console.log("upload cost: " + (end-start));
}

function drawCanvas(){
    context.drawImage(video,0,0,video.width, video.height);
}

function readCanvas(){
    var canvasData = canvas.toDataURL('image/jpeg',1);
    upload(canvasData);
}

function upload(image) {
    var imgFile=dataURLtoFile(image,"img.png");
    var xhr=new XMLHttpRequest();
    var fd=new FormData();
    fd.append("multipartFile",imgFile);

    $.ajax({
        url: "/uploadImage",
        type: "POST",
        processData:false,
        data: fd,
        contentType:false,
        mimeType:"multipart/form-data",
        success:function(data){
            console.log(data);
            var predictions = JSON.parse(data);
            for (var i = 0; i < predictions.length; i++) {
                predictions[i].bbox[0] = predictions[i].bbox[0] * video.height;
                predictions[i].bbox[1] = predictions[i].bbox[1] * video.width;
                predictions[i].bbox[2] = predictions[i].bbox[2] * video.height;
                predictions[i].bbox[3] = predictions[i].bbox[3] * video.width;
            }
            console.log(predictions);
            renderPredictions(predictions, canvas, context, video);            
        }
    })                        
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