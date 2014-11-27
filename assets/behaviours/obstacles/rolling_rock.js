"use strict";
//>>LREditor.Behaviour.name: RollingRock
//>>LREditor.Behaviour.params : { "direction": 1}
var RollingRock = function(_gameobject) {	
	Enemy.call(this,_gameobject);
	this.entity.body.setCircle(23,-1,-1);
	this.onGround = false;
	this.jumpable = false;
	this.entity.kill();
}

RollingRock.prototype = Object.create(Enemy.prototype);
RollingRock.prototype.constructor = RollingRock;

RollingRock.prototype.create = function( _data ){
	if(_data.direction) this.direction = _data.direction;
}

RollingRock.prototype.update = function(){
	if( this.onGround ){
		this.run();
	}
}

RollingRock.prototype.launch = function( _data){
	this.entity.revive();
	_data.sender.entity.kill();
	this.entity.go.gravity = 1;
}
