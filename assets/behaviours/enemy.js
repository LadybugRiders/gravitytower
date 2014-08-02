"use strict";

//>>LREditor.Behaviour.name: Enemy

var Enemy = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
  //ANIMATIONS  
  this.idleAnim = this.entity.animations.add("idle", [ 0, 1 , 2 , 1 ]); 
  this.entity.play( "idle", 5, true);
};

Enemy.prototype = Object.create(LR.Behaviour.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.kill = function(_data){
  this.entity.kill();
}