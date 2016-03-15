cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    follow(node){
		//cc.follow可以让地图跟踪某个玩家，可以用来保持某个玩家在摄像头的中央, 这是对所有客户端进行统一绘制算法的关键
        this.node.runAction(cc.follow(node));
    }
    
    
});
