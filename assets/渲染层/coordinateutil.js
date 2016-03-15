var CoordinateUtil = function(enterTile,enterPosition,tileSize,background){
    //瓦片坐标转换成地图坐标
    this.playerPosition = function(curTile){
        let temp_1 = cc.pSub(curTile,enterTile);
                
        let temp_2 = cc.v2((temp_1.x + temp_1.y) * tileSize.x/2, (temp_1.x - temp_1.y) * tileSize.y/2);
                
        return cc.pAdd(enterPosition,temp_2);
    },
    //点击的屏幕坐标转换成地图坐标
    this.convertToBackground = function(location){
        return cc.pSub(background.convertToNodeSpace(location),cc.pMult(cc.v2(background.width,background.height),0.5));
    }
    
 
}

module.exports = CoordinateUtil;
