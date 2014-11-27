"use strict";
//>>LREditor.Behaviour.name: RollingRock
//>>LREditor.Behaviour.params : { "direction": 1, "jumpable" : true, "cutable" : true, "hatable":true, "dead":true, "smoke":null}
var RollingRock = function(_gameobject) {	
	Enemy.call(this,_gameobject);
	this.entity.body.setCircle(23,-1,-1);
	this.onGround = false;
	this.gravity = 1;
	this.speed = 100;
	//weaknesses
	this.jumpable = false;
	this.cutable = false;
	this.hatable = false;
	this.direction = 1;
	this.launched = false;
}

RollingRock.prototype = Object.create(Enemy.prototype);
RollingRock.prototype.constructor = RollingRock;

RollingRock.prototype.create = function(_data){
	if(_data.direction) this.direction = _data.direction;
}

RollingRock.prototype.launch = function(){
	this.go.gravity = 1;
	this.launched = true;
}

RollingRock.prototype.update = function(){
	if( this.launched == true ){
		this.entity.body.velocity.x = this.direction * 100;
	}
}