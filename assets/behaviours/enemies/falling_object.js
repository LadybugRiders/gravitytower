"use strict";

//>>LREditor.Behaviour.name: FallingObject
//>>LREditor.Behaviour.params : { "direction": 1, "hatable":true, "dead":false, "smoke":null,"repeatTime":-1}
var FallingObject = function(_gameobject){
	Enemy.call(this,_gameobject);
	this.jumpable = false;
	this.cutable = false;
	this.repeatTime = 1;
}

FallingObject.prototype = Object.create( Enemy.prototype);
FallingObject.prototype.constructor = FallingObject;

FallingObject.prototype.create = function(_data){
	Enemy.prototype.create.call(this,_data);
	if( _data.repeatTime ) this.repeatTime = _data.repeatTime;
}

FallingObject.prototype.launch = function(){
	this.entity.visible = true;
	this.go.x = this.initPos.x;
	this.go.y = this.initPos.y;
	if(this.smoke)
		this.smoke.entity.revive();
	this.go.gravity = 1;
}

FallingObject.prototype.onTouchGround = function(){
	this.die();	
}

FallingObject.prototype.onHitPlayer = function(){
	console.log("onHitPlayer");
	this.die();
}

FallingObject.prototype.die = function(){
  	this.dead = true;
  	this.entity.visible = false;
  	this.go.x = -100000;
	if(this.smoke){
	  	this.smoke.entity.x = this.entity.x;
	  	this.smoke.entity.y = this.entity.y;
	  	this.smoke.entity.revive();
	  	this.smoke.entity.animations.play("blow").killOnComplete = true;
	}
	this.go.playSound("death");
	//this.entity.game.pollinator.dispatch("onEnemyDied",{"sender":this.entity});
	
	this.go.x = this.initPos.x;
	this.go.y = this.initPos.y;
	this.go.body.setZeroVelocity();
	this.go.gravity = 0;

	if( this.repeatTime <0 )
		return;
	//set a timer
	if(this.repeatTime != null){
	    this.entity.game.time.events.add(
	      Phaser.Timer.SECOND * this.repeatTime, 
	      function(){ this.pop()},
	      this);
	}
}