"use strict";

//>>LREditor.Behaviour.name: Collectable
//>>LREditor.Behaviour.params : {"callbackName":"", "messageObject" : {}, "otherNotified":null}

var Collectable = function(_gameobject) {	
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.collected = false;
}

Collectable.prototype = Object.create(LR.Behaviour.Trigger.prototype);
Collectable.prototype.constructor = Collectable;

Collectable.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	if( this.collected == false && _otherBody.go.layer == "player"){
		var player = _otherBody.go.getBehaviour(Player);
		if( player && !player.dead){
			this.onCollected();
			this.collected = true;
			LR.Behaviour.Trigger.prototype.onBeginContact.call(this,_otherBody, _myShape, _otherShape, _equation);			
		}
	}
}

Collectable.prototype.onCollected = function(_gameobject){
	this.go.playSound("collect");
	this.kill();
}

Collectable.prototype.kill = function(){
	console.log("fqjs");
	this.dead = true;
	this.go.x = -100000;
	this.entity.visible = false;
}

Collectable.prototype.revive = function(_x,_y){
	this.dead = false;
	this.entity.visible = true;
	if( _x != null ) this.go.x = _x;
	if( _y != null ) this.go.y = _y;
}