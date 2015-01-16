"use strict";
//>>LREditor.Behaviour.name: BigRollingRock
//>>LREditor.Behaviour.params : { "direction": 1, "gravity":1, "speed":100}
var BigRollingRock = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
	this.onGround = false;
	this.gravity = 1;
	this.speed = 100;
	this.direction = 1;
  	this.go.setPostBroadPhaseCallback(this.onPostBroadphase,this);
}

BigRollingRock.prototype = Object.create(LR.Behaviour.prototype);
BigRollingRock.prototype.constructor = BigRollingRock;

BigRollingRock.prototype.onPostBroadphase = function(_otherBody){
  if( _otherBody.go.layer == "box" )
    return false;
  return true;
}

BigRollingRock.prototype.create = function(_data){
	if(_data.speed != null ) this.speed = _data.speed;
}

BigRollingRock.prototype.launch = function(){
	this.entity.visble = true;
	this.go.gravity = 1;
	this.launched = true;
	this.go.playSound("music",0.5,true);
}

BigRollingRock.prototype.stop = function(){
	this.entity.visble = false;
	this.launched = false;
	this.go.stopSound("music");
	this.entity.kill();
}

BigRollingRock.prototype.update = function(){
	if( this.launched == true ){
		this.entity.angle += 0.2 * this.game.time.elapsed;
		this.entity.body.velocity.x = this.direction * this.speed;
	}
}

BigRollingRock.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape){
	
	if(_otherBody.go.layer == "player" && _otherShape.lr_name == "mainShape"){
		this.go.gravity = 1;
		_otherBody.go.sendMessage("die");
	}else{
		var brkBH = _otherBody.go.getBehaviour(Breakable);
		if(brkBH){
			brkBH.crush(this.body.velocity.x);
		}
	}
}

BigRollingRock.prototype.changeGravity = function(_data){
	this.go.gravity = _data.gravity;
}

BigRollingRock.prototype.changeSpeed = function(_data){
	this.speed = _data.speed;
}