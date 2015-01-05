"use strict";

//>>LREditor.Behaviour.name: OneWayPlatform
//>>LREditor.Behaviour.params : {"bottom":true}
var OneWayPlatform = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.bottom = true;
	this.go.setPostBroadPhaseCallback(this.onPostBroadphase,this);
}

OneWayPlatform.prototype = Object.create(LR.Behaviour);
OneWayPlatform.prototype.constructor = OneWayPlatform;

OneWayPlatform.prototype.create = function(_data){
	if( _data.bottom ) this.bottom = _data.bottom;
}

OneWayPlatform.prototype.onPostBroadphase = function(_otherBody){
	if(this.go.body == null)
		return false;
	if(this.bottom ){
		if( this.entity.body.bottom < _otherBody.bottom && _otherBody.velocity.y < 0)
			return false;
	}else{		
		if( this.entity.body.bottom > _otherBody.bottom &&_otherBody.velocity.y > 0)
			return false;
	}
	return true;
}