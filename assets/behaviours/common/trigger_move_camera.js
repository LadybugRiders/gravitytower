"use strict";

//>>LREditor.Behaviour.name: TriggerMoveCamera
//>>LREditor.Behaviour.params : {"messageObject" : {}, "otherNotified":null, "activeCountLimit": 0, "targetX":0,"targetY":0,"speed":10,"yoyo":false,"relative":false}

var TriggerMoveCamera = function(_gameobject){
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.target = new Phaser.Point();
	this.targetCam = this.target;
	this.tempEntityTargetCam = null;
	this.speed = 5;
	this.yoyo = false;
	this.launched = false;
	this.camera = this.entity.game.camera;
} 

TriggerMoveCamera.prototype = Object.create(LR.Behaviour.Trigger.prototype);
TriggerMoveCamera.prototype.constructor = TriggerMoveCamera;

TriggerMoveCamera.prototype.create = function(_data){
	LR.Behaviour.Trigger.prototype.create.call(this,_data);
	if(_data.targetX) this.target.x = _data.targetX;
	if(_data.targetY) this.target.y = _data.targetY;
	if(_data.speed) this.speed = _data.speed;
	if(_data.yoyo) this.yoyo = _data.yoyo;
	if(_data.relative) this.relative = _data.relative;
}

TriggerMoveCamera.prototype.onTriggered = function(_gameobject){	
	if( this.launched )
		return;
	this.launched = true;
	this.initPos = this.camera.position;
	//remove target before moving
	this.tempEntityTargetCam = this.camera.target;
	this.camera.target = null;

	if(this.relative)
		this.targetCam = Phaser.Point.add(this.camera.position,this.target);
	else
		this.targetCam = this.target;
}

TriggerMoveCamera.prototype.update = function(){	
	if( this.launched ){
		var camCenter = new Phaser.Point(this.camera.x + this.camera.width*0.5,
										this.camera.y + this.camera.height*0.5);

		var deltaVector = Phaser.Point.subtract(this.targetCam,camCenter);
		var vector = new Phaser.Point(deltaVector.x,deltaVector.y).normalize();
		vector.x *= this.speed * this.entity.game.time.elapsed *0.1;
		vector.y *= this.speed * this.entity.game.time.elapsed *0.1;
		//move camera
		this.camera.x += vector.x;
		this.camera.y += vector.y;

		console.log(this.target);

		var deadzoneHit = false;
		if(this.relative)
			this.checkCameraDeadZone();

		if( deltaVector.getMagnitude() - vector.getMagnitude() <= 0.001 || (this.relative && deadzoneHit)){
			this.launched = false;
			this.camera.target = this.tempEntityTargetCam;
		}
	}
}

//checks the camera deadzone to not move the camera to far from the following object
//this prevents the camera from having a weird behaviour when follow its target back after the motion
TriggerMoveCamera.prototype.checkCameraDeadZone = function(){

	if (this.camera.deadzone && this.tempEntityTargetCam)
    {
        var _edge = this.tempEntityTargetCam.x - this.camera.view.x;

        if (_edge < this.camera.deadzone.left)
        {
            this.camera.view.x = this.tempEntityTargetCam.x - this.camera.deadzone.left;
        	return true;
        }
        else if (_edge > this.camera.deadzone.right)
        {
            this.camera.view.x = this.tempEntityTargetCam.x - this.camera.deadzone.right;
        	return true;
        }

        _edge = this.tempEntityTargetCam.y - this.camera.view.y;

        if (_edge < this.camera.deadzone.top)
        {
            this.camera.view.y = this.tempEntityTargetCam.y - this.camera.deadzone.top;
        	return true;
        }
        else if (_edge > this.camera.deadzone.bottom)
        {
            this.camera.view.y = this.tempEntityTargetCam.y - this.camera.deadzone.bottom;
        	return true;
        }
    }
    return false;
}