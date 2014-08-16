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

FallingObject.prototype.touchGround = function(){
	this.die();	
}

FallingObject.prototype.die = function(){
	Enemy.prototype.die.call(this);
	if( this.repeatTime <0 )
		return;
	this.go.x = this.initX;
	this.go.y = this.initY;
	this.go.body.setZeroVelocity();
	//set a timer
    this.entity.game.time.events.add(
      Phaser.Timer.SECOND * this.repeatTime, 
      function(){ this.pop()},
      this);
}