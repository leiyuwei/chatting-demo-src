//坐标转换工具
var CoordinateUtil = require('coordinateutil');

cc.Class({
    extends: cc.Component,

    properties: {
		//玩家工厂
        playerPrefab:{
            default: null,
            type: cc.Prefab,
        },
		//背景节点
        background:{
            default: null,
            type: cc.Node,
        },
		//初始瓦片位置 默认 12, 42
        enterTile:{
            default: cc.v2(12,42),
            type: cc.Vec2,
        },
		//初始坐标位置 默认688,-552 (=.=如果tiledMap能再给力点就没有这个属性了)
        enterPosition:{
            default: cc.v2(688,-552),
            type: cc.Vec2,
        },
		//瓦片尺寸
        tileSize:{
            default: cc.v2(64,48),
            type: cc.Vec2,
        },
    },
    
    onLoad(){
        var self = this;
        //获取坐标转换工具
        self.coordinateutil = new CoordinateUtil(self.enterTile,self.enterPosition,self.tileSize,self.background);
        //获取当前玩家名字
        self.playerName = cc.sys.localStorage.getItem('playerName');
        
        //绘制玩家
        window.remote.on('玩家',(data)=>{
            Object.keys(data).forEach((index)=>{
                let item = data[index];
                //玩家名字
                let playerName = item.playerName;
				//玩家当前瓦片
                let curTile = item.curTile;
				//玩家最近一次点击
                let location = item.location;
                //生成玩家实例
                let player = cc.instantiate(self.playerPrefab);
                //添加到背景中
                self.background.addChild(player);
                //修改玩家逻辑节点名字
                player.name = playerName;
                //修改玩家坐标     
                player.position = self.coordinateutil.playerPosition(curTile);
                
                console.log('player.position: ',player.position);
                //获取玩家的渲染组件
                let playerComponent = player.getComponent('player');
                //渲染玩家的名字标签
                playerComponent.setPlayerName(playerName);
                //设置当前瓦片位置(=.=多余了怪我咯)
                playerComponent.setCurTile(curTile);
                //如果是当前玩家 
                if(self.playerName == playerName){
					//则让摄像头跟踪这个玩家
                    playerComponent.followed();
                }
                //根据最近一次点击移动玩家
                playerComponent.move(location);
                
            });
        });
        
        //销毁玩家
        window.remote.on('离线',(name)=>{
				//通过玩家逻辑节点的名字销毁玩家
                self.background.getChildByName(name).removeFromParent(true);
        });
        
        //移动玩家
        window.remote.on('点击',(data)=>{
			//移动玩家的名字
            let playerName = data.playerName;
			//移动玩家的最新点击
            let location = data.location;
            //获取玩家的渲染组件
            let playerComponent = self.background.getChildByName(playerName).getComponent('player');
			//根据最新点击移动玩家
            playerComponent.move(location);
        });
        
        //绘制消息
        window.remote.on('消息',(data)=>{
			//发消息的玩家名字
            let playerName = data.playerName
			//所发送的消息
            let message = data.message;
            //获取玩家的渲染组件
            let playerComponent = self.background.getChildByName(playerName).getComponent('player');
			//绘制消息
            playerComponent.say(message);
        });
    },
    
    start(){
        var self = this;
        
        
        //发送消息给服务器 我登录了
        window.remote.emit('玩家',{playerName:self.playerName,curTile:self.enterTile,location:self.enterPosition});
        
        //监听地图的点击
        self.background.on('mouseup',(event)=>{
			//将点击从屏幕坐标转换成地图坐标 发送给服务器
            window.remote.emit('点击',self.coordinateutil.convertToBackground(event.getLocation()));
        },self);
    }
});
