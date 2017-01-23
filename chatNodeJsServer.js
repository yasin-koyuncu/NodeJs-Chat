

/* global http */

var port=1337;

var webSocket=require('websocket').server;
var Http=require('http');

var client=[];

var server=http.createServer();

server.listen(port,function(){
    console.log((new Date())+ "Server listen on port "+port);
});

var webSocketServer= new webSocketserver({
    httpServer:server
});

webSocketServer.on('request',function(request){
    
    console.log('Connection from origin '+request.origin);
    
    var conn=request.accept(null,request.origin);
    var index=client.push(conn)-1;
    
    var name=false;
    
    console.log('Connection accepted ');
    
    
    conn.on('message',function(msg){
        
        if(msg.type==='utf8'){
            if(name===false){
                name=msg.utf8Data;
                conn.sendUTF(JSON.stringify({ type:'username' }));      
                console.log((new Date())+' User is '+name);
            }
            else{
                console.log((new Date())+' Received msg from '+name+': '+msg.utf8Data);
                
                var object={
                    Time:(new Date()).getTime(),
                    Text:msg.utf8Data,
                    userName:name
                };
                
                var JSONObject=JSON.stringify({type:'message',data:object});
                
                for(var i=0;i<client.length;i++){
                    client[i].sendUTF(JSONObject);
                }
                    
            }
        }
    });
    
});