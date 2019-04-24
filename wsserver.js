var ws = require('nodejs-websocket')
var PORT = 8082

var server = ws.createServer(function(conn){
    console.log('New connection')
    conn.on("text",function(str){
        console.log("Received"+str)
        // conn.sendText(str.toUpperCase()+"!!!") //大写收到的数据
        conn.sendText(str)  //收到直接发回去
    })
    conn.on("close",function(code,reason){
        console.log("connection closed")
    })
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
    })
}).listen(PORT)


var sendAll = function broadcast(str) {
    console.log("sendAll: " + str);
    server.connections.forEach(function(connection) {
        connection.send(str);
    })
}

module.exports.sendAll = sendAll;