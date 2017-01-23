/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function(){
    
    var Content=$('#content');
    var Input=$('#input');
    var Status=$('#status');
    
    var userName=false;
    
    var conn=new WebSocket('ws://127.0.0.1:1337');
    
    conn.onopen=function(){
        Input.removeAttr('disabled');
        Status.text('Choose name:');
    };
    
    conn.onerror=function(error){
        Content.html($('<p>',{text: 'Connection problem or server is down.' }));
        
    };
    
    conn.onmessage=function(msg){
        try{
            var JSON=JSON.parse(msg.data);
        }catch(e){
            console.log('This doesnt look like a JSON');
        }
        
        if(JSON.type==='username'){
            Status.text(userName+': ');
            Input.removeAttr('disabled').focus();
        }
        else if(JSON.type==='message'){
            Input.removeAttr('disabled');
            addMessage(JSON.data.userName,JSON.data.Text,new Date(JSON.data.Time));
            
        } else{
            console.log('This is not json :'+JSON);
        }
        
        
    };
    
    Input.keydown(function(key){
        if(key.keyCode===13){
            var message=$(this).val();
            if(!message){
                return;
            }
            
            conn.send(message);
            $(this).val('');
            
            Input.attr('disabled','disabled');
            
            if(userName===false){
                userName=message;
            }
        }
    });
    
    setInterval(function(){
        if(conn.readyState!==1){
            Status.text('Error');
            Input.attr('disabled','disabled').val('Cant communicate with the websocket');
            
        }
    },3000);
    
    function addMessage(author,message,dt){
        Content.prepend('<p><span style="color:'+'">'+author+ '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
    }
});