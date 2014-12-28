"use strict";

//>>LREditor.Behaviour.name: TriggerFixCamera
//>>LREditor.Behaviour.params : {"messageObject" : {}, "otherNotified":null, "activeCountLimit": 0, "target":null,"speed":10}

var TriggerFixCamera = function(_gameobject){
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.target = new Phaser.Point();
	this.targetCam = this.target;
	this.tempEntityTargetCam = null;
	this.speed = 5;
	this.launched = false;
	this.camera = this.entity.game.camera;
	this.triggerShape = null;
} 

TriggerFixCamera.prototype = Object.create(LR.Behaviour.Trigger.prototype);
TriggerFixCamera.prototype.constructor = TriggerFixCamera;

TriggerFixCamera.prototype.create = function(_data){
	LR.Behaviour.Trigger.prototype.create.call(this,_data);
	if(_data.target) this.target = _data.target;
	if(_data.speed) this.speed = _data.speed;
}

TriggerFixCamera.prototype.onBeginContact = function(_otherBody,_myShape,_otherShape){	
	if( this.launched || _otherShape.lr_name != "mainShape" )
		return;
	this.launched = true;
	this.initPos = this.camera.position;
	//remove target before moving
	this.tempEntityTargetCam = this.camera.target;
	this.camera.target = null;
	this.triggerShape = _otherShape;
}

TriggerFixCamera.prototype.onEndContact = function(_otherBody,_myShape, _otherShape){
	
	if( _otherShape == this.triggerShape){
		this.camera.target = this.tempEntityTargetCam;
	}
}

TriggerFixCamera.prototype.update = function(){	
	if( this.launched ){
		var camCenter = new Phaser.Point(this.camera.x + this.camera.width*0.5,
										this.camera.y + this.camera.height*0.5);

		var deltaVector = Phaser.Point.subtract(this.target.entity.world,camCenter);
		var vector = new Phaser.Point(deltaVector.x,deltaVector.y).normalize();
		vector.x *= this.speed * this.entity.game.time.elapsed *0.1;
		vector.y *= this.speed * this.entity.game.time.elapsed *0.1;
		//move camera
		this.camera.x += vector.x;
		this.camera.y += vector.y;

		if( deltaVector.getMagnitude() - vector.getMagnitude() <= 0.001 ){
			this.launched = false;
		}
	}
}
