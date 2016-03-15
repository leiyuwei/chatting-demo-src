var PathUtil = function(node,radio,tileSize){
		//计算A星路径
       this.convertToAStarPath = function(location,curTile){
        var oldX = (location.x - node.x)/tileSize.x;
        var oldY = (location.y - node.y)/tileSize.y;
        
        var newX =  Math.floor(oldX + oldY);
        var newY = -Math.floor(oldY - oldX);
        
        
        var openList = [];
        var closeList = [];
        var finalList = [];
        
        var start = {
            x:curTile.x,
            y:curTile.y,
            h: (Math.abs(newX) + Math.abs(newY))*10,
            g: 0,
            f: this.h + this.g,
            p: null,
        };
        start.f = start.h + start.g;
        
        openList.push(start);
        
        var destination = {x:start.x+newX,y:start.y+newY};
        
        while(openList.length !== 0){
            var parent = openList.shift();
            
            closeList.push(parent);
            
            if(parent.h === 0){break;}
            
            for(var i = -1; i<= 1; i++){
                for(var j = -1; j <= 1; j++){
                    var rawX = parent.x + i;
                    var rawY = parent.y + j;
                    var neibour = {
                        x: rawX,
                        y: rawY,
                        h: Math.max(Math.abs(rawX - destination.x),Math.abs(rawY - destination.y))*10,
                        g: parent.g + ((i !== 0 && j !== 0)? 14 : 10),
                        p: parent,
                    }
                    neibour.f = neibour.h + neibour.g;
                    
                    if(closeList.some((item)=>{return item.x == neibour.x && item.y == neibour.y;})){
                        continue;
                    }
                    
                    openList.push(neibour);
                }
            }
            
            openList.sort((a,b)=>{return a.f - b.f});
        }
        
        var des = closeList.pop();
        while(des.p){
            des.dx = des.x - des.p.x;
            des.dy = des.y - des.p.y;
            finalList.unshift(des);
            des = des.p;
        };
        
        return finalList;
    },
    //处理玩家移动速度 用以保持直线和斜线统一的移动速度
    this.playerSpeed = function(step){
        return radio * ((step.dx != 0) && (step.dy != 0) ? 1.4 : 1) / 10
    },
    //瓦片坐标转换成直角坐标
    this.playerStep = function(step){
        return cc.v2(  (step.dx+step.dy)*tileSize.x/2 , -(step.dy-step.dx)* tileSize.y/2);
    }
    
    
}

module.exports = PathUtil;