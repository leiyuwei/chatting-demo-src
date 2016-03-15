cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    onLoad(){
        //初始化和服务器的连接
        let self = this;
        if(cc.sys.isNative){
            window.io = SocketIO;
        }else{
            window.io = require('socket.io');
        }
        window.remote = window.io('www.concatboss.cn:3000');
    }
});
