"use strict";
//>>LREditor.Behaviour.name: Breakable
//>>LREditor.Behaviour.params : {  }
var Breakable = function(_gameobject) {	
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.broken = false;
}

Breakable.prototype = Object.create(LR.Behaviour.Trigger.prototype);
Breakable.prototype.constructor = Breakable;

Breakable.prototype.update = function( _data ){
	if(this.broken && ! this.entity.inCamera)
		this.entity.kill();
}

Breakable.prototype.onTriggered = function(_gameobject){
	if( this.broken == false && _gameobject.layer == "player"){
		var playerHair = _gameobject.getBehaviour(PlayerHair);
		if( playerHair && playerHair.isShapeAndStatusBlade()){
			this.crush(playerHair.x > this.entity.x ? -1 : 1);
		}
	}
}

Breakable.prototype.crush = function(_direction){
	this.broken = true;
	this.entity.body.dynamic = true;
	var xForce = 50 + Math.random() * 50;
	var yForce = 100 + Math.random() * 100;
	this.go.body.mass = 1;	
	this.entity.body.velocity.x = _direction * xForce;	
	this.entity.body.velocity.y = -yForce;
	this.go.enableSensor();
}