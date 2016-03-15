cc.Class({
    extends: cc.Component,

    properties: {
		//聊天的输入框
        inputBox:{
            default: null,
            type: cc.EditBox,
        }
    },
    
    onLoad(){
		//有点多余 怪我咯
        let self = this;
    },
    
	//发送聊天消息
    say(){
		//获取输入框中的聊天消息
        let message = this.inputBox.string;
		//如果聊天消息不为空
        if(message){
			//发送聊天消息给服务器
            window.remote.emit('消息',message);
            this.inputBox.string = '';
        }
    },
    //发送完成后的提示
    tips(){
        this.inputBox.placeholder = '头顶的消息只会维持5秒哦'
    },
    //恢复原来的提示
    resume(){
        this.inputBox.placeholder = '说点什么吧...'  
    },
    
    

});
