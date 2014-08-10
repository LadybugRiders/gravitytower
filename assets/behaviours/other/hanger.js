"use strict";

//>>LREditor.Behaviour.name: Hanger
var Hanger = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.player = null;
	this.formerGrav = 1;
	this.formerAngle = 0;
	this.playerBasePos = null;

	this.minAngle = 1;
	this.maxAngle = 180;
	this.currentAngle = this.minAngle;
	this.direction = 1;

	this.speed = 150;
	this.distance = 10;

	this.released = false;

  	this.go.game.inputManager.bindKeyPress("jump",this.release,this);
}

Hanger.prototype = Object.create(LR.Behaviour.prototype);
Hanger.prototype.constructor = Hanger;

Hanger.prototype.create = function(_data){
}

Hanger.prototype.update = function(){
  if(this.player && this.released == false){
  	//Modify the angle from min to max
  	if( this.direction > 0){
  		this.currentAngle += this.speed * this.entity.game.time.elapsed * 0.001;
  		if (this.currentAngle > this.maxAngle ){
  			this.currentAngle = this.maxAngle;
  			this.direction = -1;
  			this.player.go.body.setZeroVelocity();
  		}
  	}else{
  		this.currentAngle -= this.speed * this.entity.game.time.elapsed * 0.001;
  		if( this.currentAngle < this.minAngle){
  			this.currentAngle = this.minAngle;
  			this.direction = 1;
  			this.player.go.body.setZeroVelocity();
  		}
  	}

  	//rotate the base point
  	var rotatedPoint = LR.Utils.rotatePoint(new Phaser.Point(1,0), this.currentAngle);
  	rotatedPoint.x *= this.distance;
  	rotatedPoint.y *= this.distance;

  	this.player.go.x = this.entity.x + rotatedPoint.x ;
  	this.player.go.y = this.entity.y + rotatedPoint.y ;

  	this.player.entity.angle = this.currentAngle - 90;
  }
}

Hanger.prototype.release = function(){
	if( this.player ){
		//compute direction of the release
		var vector = Phaser.Point.subtract(this.player.entity.position,this.entity.position);
		Phaser.Point.normalize(vector,vector);
		//unhang the player
		this.player.onReleaseHang(this.formerGrav, vector);	
		this.player = null
		this.released = true;
	}
}

//This method is automatically called when the body of the player collides with another cody
Hanger.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	console.log("begin" + this.released + (this.player == null));
  	if(_otherBody.go.layer == "player" && this.player == null && this.released == false){
  	this.player = _otherBody.go.getBehaviour(Player);

	  	if( this.player ){
	  		this.player.onHang();

	  		this.formerAngle = this.player.entity.angle;
	  		this.formerGrav = this.player.go.gravity;

	  		this.player.go.gravity = 0;
	  		//keep base player position
	  		this.playerBasePos = new Phaser.Point(this.player.entity.position.x, this.player.entity.position.y);
	  		
	  	}
  }
}

Hanger.prototype.onEndContact = function(_contactData){	
	console.log("end " + this.released);
	if( this.released == false)
		return;
	this.released = false;
}