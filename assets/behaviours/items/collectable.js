"use strict";

//>>LREditor.Behaviour.name: Collectable
//>>LREditor.Behaviour.params : {"callbackName":"", "messageObject" : {}, "otherNotified":null}

var Collectable = function(_gameobject) {	
	LR.Behaviour.Trigger.call(this,_gameobject);
}

Collectable.prototype = Object.create(LR.Behaviour.Trigger.prototype);
Collectable.prototype.constructor = Collectable;

Collectable.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	if( _otherBody.go.layer == "player"){
		var player = _otherBody.go.getBehaviour(Player);
		if( player ){
			this.onCollected();
			LR.Behaviour.Trigger.prototype.onBeginContact.call(this,_otherBody, _myShape, _otherShape, _equation);			
		}
	}
}

Collectable.prototype.onCollected = function(_gameobject){
	this.entity.kill();
}