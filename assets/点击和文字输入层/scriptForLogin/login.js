cc.Class({
    extends: cc.Component,

    properties: {
        inputBox:{
            default: null,
            type: cc.EditBox,
        }
    },
    
    onLoad(){
        let self = this;
        //重名提醒
        window.remote.on('重名',()=>{
			//清空名字
            self.inputBox.string = '';
			//设置重名提醒消息
            self.inputBox.placeholder = '和其他玩家重名啦';
        });
        
        //登录成功
        window.remote.on('进入大厅',(playerName)=>{
			//本地存储当前用户名
            cc.sys.localStorage.setItem('playerName',playerName);
			//转场进入大厅
            cc.director.loadScene('main');  
        });
    },
    //重名提醒完后恢复原先的提醒
    resume(){
        this.inputBox.placeholder = '请输入您的角色名';
    },
    //登录
    login(){
		//获取玩家输入的名字
        let userName = this.inputBox.string;
		//如果名字不为空
        if(userName){
			//发送给服务器
            window.remote.emit('登录',userName);
        }
    }
    
    

});
