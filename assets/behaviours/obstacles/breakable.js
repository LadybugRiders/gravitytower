"use strict";
//>>LREditor.Behaviour.name: Breakable
//>>LREditor.Behaviour.params : { "death_effect" : null }
var Breakable = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
	this.broken = false;
}

Breakable.prototype = Object.create(LR.Behaviour.prototype);
Breakable.prototype.constructor = Breakable;

Breakable.prototype.create = function( _data ){
	if( _data.death_effect){
		this.death_effect = _data.death_effect;	
		this.death_effect.entity.visible = false;
	}
}

Breakable.prototype.update = function( _data ){
	if(this.broken ){
		this.entity.body.angle +=10;
		if(! this.entity.inCamera)
			this.entity.kill();
	}
}

Breakable.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	if( this.broken == false && _otherBody.go.layer == "player"){
		var playerHair = _otherBody.go.getBehaviour(PlayerHair);
		if( playerHair && playerHair.isShapeAndStatusBlade(_otherShape)){
			this.crush(playerHair.player.body.velocity.x);
		}
	}
}

Breakable.prototype.crush = function(_velocity){
	this.broken = true;
	this.entity.body.dynamic = true;
	var xForce = _velocity + Math.random() * 50;
	var yForce = 100 + Math.random() * 100;
	this.go.body.mass = 1;	
	this.entity.body.velocity.x = xForce;	
	this.entity.body.velocity.y = -yForce;
	this.go.enableSensor();
	if( this.death_effect){
		this.death_effect.entity.visible = true;
		this.death_effect.entity.play("blow").killOnComplete = true;
	}
}