//寻路工具
var PathUtil = require('pathutil');

cc.Class({
    extends: cc.Component,

    properties: {
		//当前所在瓦片， 默认12, 42
        curTile:{
            default: cc.v2(12,42),
            type: cc.Vec2,
        },
		//当前动画是否移动的标识, 这是分离点击逻辑和移动渲染的关键
        stop:true,
		//移动速度控制参数
        radio:1,
		//瓦片尺寸 默认为 64, 48
        tileSize:{
            default: cc.v2(64,48),
            type: cc.Vec2,
        }
    },
    
    onLoad(){
		//获取地图节点
        this.background = this.node.parent;
		//获取名字标签
        this.playerNameLabel = this.node.getChildByName('playerNameNode').getComponent(cc.Label);
		//获取对话框标签
        this.messageLabel = this.node.getChildByName('message').getComponent(cc.Label);
        //获取寻路工具
        this.pathutil = new PathUtil(this.node,this.radio,this.tileSize);   
    },
    
	//绘制聊天消息
    say(message){
		//在对话框标签绘制聊天消息
        this.messageLabel.string = message;
        console.log(message);
        let self = this;
		//5秒后聊天消息消失
        setTimeout(()=>{
            self.messageLabel.string = '';
        },5000);
    },
    
	//让该玩家成为地图跟随的对象， 保证摄像头对该玩家进行跟踪
    followed(){
        //成为地图跟随的对象
        this.background.getComponent('background').follow(this.node);
    },
    
	//设置玩家名字
    setPlayerName(playerName){
        this.playerNameLabel.string = playerName;
    },
    
	//设置当前瓦片
    setCurTile(curTile){
        this.curTile = curTile;
    },
    
	//移动的点击逻辑部分 参数为点击在地图的坐标
    move(location){
		//获取A星路径 
        this.path = this.pathutil.convertToAStarPath(location,this.curTile);
		//如果已经停止移动， 就提醒继续新的绘制移动
        if(stop){
            this._move();
        }
    },
    
	//移动的渲染部分 
    _move(){
		//移动标志位开启
        this.stop = false;
        
		//如果已经移到了目标瓦片上
        if(this.path.length == 0){
			//移动标志位关闭
            this.stop = true;
			//退出移动的递归
            return;
        }
        //取出下一个瓦片
        var step = this.path.shift();
        //本地更新瓦片位置(有点多余了=.=怪我咯)
        this.curTile = cc.v2(step.x,step.y);
        //远程更新瓦片位置
        window.remote.emit('瓦片',this.curTile);
		//移向该瓦片
        this.node.runAction(
            cc.sequence(
                cc.moveBy(
					//移动速度
                    this.pathutil.playerSpeed(step), 
					//移动位置(瓦片坐标转成直角坐标系坐标)
                     this.pathutil.playerStep(step)
                ),
				//移动完继续递归所在方法取得下一个瓦片
                cc.callFunc(this._move,this)
            )    
        );
    }
    
    
});
