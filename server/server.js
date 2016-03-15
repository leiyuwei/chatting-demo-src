var express = require('express');

var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

//保存用户连接 为单点聊天做准备 目前未实现
var 用户连接 = [];

//保存用户信息 目前只有当前所在瓦片信息curTile和最近一次点击的位置location
var 用户信息 = {};


io.on('connection', function(socket){
	console.log('有用户连接');
	
	socket.on('登录',function(data){
		
		//重名验证
		if(用户连接[data]){
			//提醒重名
			socket.emit('重名');
			return ;
		}
		
		
		//保存用户名
		socket.name = data;
		console.log('登录-用户名为: ' + socket.name);
		//保存连接
		用户连接[socket.name] = socket;

		//通知前台进入大厅
		socket.emit('进入大厅',socket.name);
	});
	
	//当用户离线
	socket.on('disconnect',function(){
		//删除用户连接
		delete 用户连接[socket.name];
		//删除用户信息
		delete 用户信息[socket.name];
		
		//全局广播前台删除(不包括自己)
		socket.broadcast.emit('离线',socket.name);
		console.log('离线-用户名为: ' + socket.name);
	});
	
	//当有新玩家
	socket.on('玩家',function(data){
		//保存新玩家的当前所在瓦片和最近一次点击位置
		用户信息[socket.name] = data;
		//广播其他用户绘制这个新玩家
		socket.broadcast.emit('玩家',{[socket.name]:data});
		//发送给当前新玩家目前所有在线玩家的信息(信息包括自己)
		socket.emit('玩家',用户信息);
	});
	
	//当玩家对地图点击
	socket.on('点击',function(data){
		//  用户信息[socket.name].location = data;
		//console.log('点击测试: ', 用户信息[socket.name].location);
		//更新该玩家最近的一次点击
		用户信息[socket.name].location = data;
		//全局广播该点击 所有客户端集体绘制该玩家的移动
		io.sockets.emit('点击',{playerName:socket.name,location:data});
	});
	
	//玩家移动过程中 实时更新当前瓦片所在位置， 方便后来登录的玩家绘制在线玩家
	socket.on('瓦片',function(data){
		//更新瓦片
		用户信息[socket.name].curTile = data;
	});
	
	//全局消息
	socket.on('消息',function(data){
		//全局广播消息(包括自己)
		io.sockets.emit('消息',{playerName:socket.name,message:data});
	});
	
	
});

http.listen(3000, function(){
	console.log('正在监听端口3000');
});