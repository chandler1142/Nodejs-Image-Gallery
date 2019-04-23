
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
    video.play();
}).catch(function(err){

});

setInterval(main ,1000);

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
    var data = canvas.toDataURL("image/jpg"); 
    var b64 = data.substring( 22 );  
    //POST到服务器上，生成图片    
    var re=/[\w\u4e00-\u9fa5]/ig;  
    var f_name = 'test';
    $.ajax({
        type: 'POST',
        url: '/uploadImage',
        data: {
            imgData: b64,
            file_name: f_name
        }
        
    }).done(function( data ) {
        console.log(data);
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