"use strict";

//>>LREditor.Behaviour.name: PlayerHair
var PlayerHair = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.player = null;
	this.state = "idle";
	this.upgraded = false;	

	this.hookShape = this.go.getShapeByName("hook");
}

PlayerHair.prototype = Object.create(LR.Behaviour.prototype);
PlayerHair.prototype.constructor = PlayerHair;

PlayerHair.prototype.create = function(_data){
}

PlayerHair.prototype.update = function(){

}

PlayerHair.prototype.postUpdate = function(){

  this.go.x = this.player.go.x;
  this.go.y = this.player.go.y;

  this.entity.scale.x = this.player.entity.scale.x;
  this.entity.angle = this.player.entity.angle;
}

PlayerHair.prototype.idle = function(){
	this.entity.animations.play('idle');
}

PlayerHair.prototype.run = function(){
	this.entity.animations.play('run');
}

PlayerHair.prototype.hook = function(){
	this.upgraded = true;
	this.entity.animations.play('hook');
}


Object.defineProperty( PlayerHair.prototype, "isHook",
  {
    get : function(){
      return this.state == "hook";
    }
  }
);