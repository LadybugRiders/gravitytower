"use strict";

//>>LREditor.Behaviour.name: HangerPulley
//>>LREditor.Behaviour.params : {"hookX" : 0, "hookY" : 0, "up":true, "target":null, "range" : 50 ,"speed" : 1, "retractSpeed" : 0.5,"moveCamera":false,"targetBlock":null}
var HangerPulley = function(_gameobject){
	Hanger.call(this,_gameobject);
	this.up = true;
	this.range = 50;
	this.target = null;	
	this.state = "retracted";

	this.cameraMoveCount = 0;
	this.isCameraMoving = false;
	this.cameraState = "idle";
}

HangerPulley.prototype = Object.create(Hanger.prototype);
HangerPulley.prototype.constructor = HangerPulley;

HangerPulley.prototype.create = function(_data){
	Hanger.prototype.create.call(this,_data);
	if( _data.up != null ) this.up = _data.up;
	if( _data.range != null ) this.range = _data.range;
	if( _data.target != null ) this.target = _data.target;
	if( _data.speed != null ) this.speed = _data.speed;
	if( _data.retractSpeed != null ) this.retractSpeed = _data.retractSpeed;
	if( _data.moveCamera ){
		this.moveCamera = _data.moveCamera;
		this.camera = this.entity.game.camera;
	}
	if(_data.targetBlock) this.targetBlock = _data.targetBlock;

	this.initY = this.entity.parent.y;
	this.targetY = this.initY + (this.up?1:-1) * this.range;
}

HangerPulley.prototype.update = function(){
	
	if(this.player && this.released == false){

		this.player.go.x = this.entity.world.x + this.hookX ;
	  	this.player.go.y = this.entity.world.y + this.hookY ;

	  	//move camera to target if asked
		if(this.isCameraMoving){
			this.updateMoveCamera();
		}

	  	if( this.state == "pulled"){
	  		//make the whole hanger group go up/down
		  	this.entity.parent.go.y += this.speed * (this.up?1:-1) * this.game.time.elapsed * 0.001;
		  	//make the target go the other direction
		  	this.target.y += this.speed * (this.up?-1:1) * this.game.time.elapsed * 0.001;

		  	if( ( this.up && this.entity.parent.go.y >= this.targetY) || 
		  		( !this.up && this.entity.parent.go.y <= this.targetY) ){
		  		this.entity.parent.go.y = this.targetY;
		  		this.state = "extended";		  		
		  	}
	  	}	  	
	}
	if( this.state == "retract"){
		//make the whole hanger group go up/down
	  	this.entity.parent.go.y += this.retractSpeed * (this.up?-1:1) * this.game.time.elapsed * 0.001;
	  	//make the target go the other direction
	  	this.target.y += this.retractSpeed * (this.up?1:-1) * this.game.time.elapsed * 0.001;
	  	if( ( this.up && this.entity.parent.go.y <= this.initY) || 
	  		( !this.up && this.entity.parent.go.y >= this.initY) ){
	  		this.entity.parent.go.y = this.initY;
	  		this.state = "retracted";		  		
	  	}
	}
}

HangerPulley.prototype.hang = function(){
	Hanger.prototype.hang.call(this);
	this.state = "pulled";
	if(this.targetBlock)
		this.targetBlock.go.sendMessage("onPull");
	if( this.moveCamera == true && this.cameraMoveCount < 1 ){
		this.moveCameraToTarget();
	}
}

HangerPulley.prototype.release = function(){
	if( this.player ){
		//unhang the player
		this.player.onReleaseHang(this.formerGrav, null);	
		this.player = null;
		this.playerHair = null;
		this.released = true;
		this.state = "retract";
		if(this.targetBlock)
			this.targetBlock.go.sendMessage("onRetract");
	}
}

//=====================================================
//					CAMERA
//=====================================================

HangerPulley.prototype.moveCameraToTarget = function(){	
	this.cameraMoveCount ++;
	this.tempCameraTarget = this.camera.target;
	this.camera.target = null;
	this.isCameraMoving = true;
	this.currentCameraTarget = this.target.entity.parent.go;
	this.cameraState = "moving";
}

HangerPulley.prototype.updateMoveCamera = function(){	
	if(this.cameraState != "moving")
		return;
	var camCenter = new Phaser.Point(this.camera.x + this.camera.width*0.5,
									this.camera.y + this.camera.height*0.5);

	var deltaVector = Phaser.Point.subtract(this.currentCameraTarget.entity.world,camCenter);
	var vector = new Phaser.Point(deltaVector.x,deltaVector.y).normalize();
	vector.x *= 6 * this.entity.game.time.elapsed *0.1;
	vector.y *= 6 * this.entity.game.time.elapsed *0.1;
	//move camera
	this.camera.x += vector.x;
	this.camera.y += vector.y;

	if( deltaVector.getMagnitude() - vector.getMagnitude() <= 0.001 ){
		this.cameraState = "wait";
		if(this.currentCameraTarget == this.tempCameraTarget.go){
			this.currentCameraTarget = null;
			this.isCameraMoving = false;
			this.camera.target = this.tempCameraTarget;
		}else{
			this.currentCameraTarget = this.tempCameraTarget.go;
			this.entity.game.time.events.add(
			      Phaser.Timer.SECOND * 1, 
			      function(){this.cameraState ="moving";},
			      this);
		}
	}
}