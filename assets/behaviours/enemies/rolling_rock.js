"use strict";
//>>LREditor.Behaviour.name: RollingRock
//>>LREditor.Behaviour.params : { "direction": 1, "jumpable" : true, "cutable" : true, "hatable":true, "dead":true, "smoke":null}
var RollingRock = function(_gameobject) {	
	Enemy.call(this,_gameobject);
	this.entity.body.setCircle(23,-1,-1);
	this.onGround = false;
	this.gravity = 1;
	this.speed = 100;
  //weaknesses
  this.jumpable = false;
  this.cutable = false;
  this.hatable = false;
}

RollingRock.prototype = Object.create(Enemy.prototype);
RollingRock.prototype.constructor = RollingRock;