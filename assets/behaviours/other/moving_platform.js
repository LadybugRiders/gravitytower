"use strict";

//>>LREditor.Behaviour.name: MovingPlatform
//>>LREditor.Behaviour.params : {"xRange":100,"yRange":0,"speed":50}
var MovingPlatform = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.xRange = 100;
	this.yRange = 0;
	this.speed = 1;
	//internal variables
	this.veloX = 0;
	this.veloY = 0;
	//
	this.direction = 1;
}

MovingPlatform.prototype = Object.create(LR.Behaviour);
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.create = function(_data){
	if(_data.xRange != null) this.xRange = _data.xRange;
	if(_data.yRange != null) this.yRange = _data.yRange;
	if(_data.speed != null) this.speed = _data.speed;	

	this.basePosition = new Phaser.Point(this.entity.position.x,this.entity.position.y);
	var targetPosition = new Phaser.Point(this.entity.position.x + this.xRange,
											 this.entity.position.y + this.yRange);
	this.vector = Phaser.Point.subtract(targetPosition,this.basePosition);
	this.totalRange = this.vector.getMagnitude();
	this.vector = this.vector.normalize();
}

MovingPlatform.prototype.update = function(){

	this.go.body.velocity.x = this.vector.x * this.direction * this.speed;
	this.go.body.velocity.y = this.vector.y * this.direction * this.speed;
	
	var distanceDone = Phaser.Point.subtract(this.entity.position, this.basePosition).getMagnitude();
	
	if(this.direction > 0 && distanceDone >= this.totalRange ){
		this.direction = -1;
	}else if(this.direction < 0 && distanceDone <= 0.01){
		this.direction = 1;
	}
	
}