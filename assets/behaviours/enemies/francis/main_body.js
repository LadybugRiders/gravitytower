"use strict";
//>>LREditor.Behaviour.name : Francis.MainBody
//>>LREditor.Behaviour.params : {"tail":null,"stinger":null,"legs":null,"eye":null,"pincer":null}
if(!Francis)
	var Francis = {};

Francis.MainBody = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.tail = null;
	this.stinger = null;
}

Francis.MainBody.prototype = Object.create(LR.Behaviour.prototype);
Francis.MainBody.prototype.constructor = Francis.MainBody;

Francis.MainBody.prototype.create = function(_data){
	if(_data.tail) this.tail = _data.tail.getBehaviour(Francis.Tail);
	if(_data.stinger ) this.stinger = _data.stinger.getBehaviour(Francis.Stinger);
	if(_data.arm ) this.arm = _data.arm.getBehaviour(Francis.Arm);
	if(_data.legs) this.legs = _data.legs;
	if(_data.eye) this.eye = _data.eye;

	this.placeCamera();
	//this.blink();
}


Francis.MainBody.prototype.update = function(){
	this.go.x-=0.1;
}

Francis.MainBody.prototype.moveTo = function(){

}

Francis.MainBody.prototype.placeCamera = function(){
	this.entity.game.camera.deadzone.x = -20;
	this.entity.game.camera.deadzone.y = 200;
}

Francis.MainBody.prototype.blink = function(){
	//if( this.state == "idle"){
    	this.eye.entity.animations.play("blink");
 	//}
  //set a timer
  	this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 6, 
      this.blink,
      this);
}
