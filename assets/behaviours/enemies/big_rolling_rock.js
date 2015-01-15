"use strict";
//>>LREditor.Behaviour.name: BigRollingRock
//>>LREditor.Behaviour.params : { "direction": 1, "gravity":1, "speed":100}
var BigRollingRock = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
	this.onGround = false;
	this.gravity = 1;
	this.speed = 100;
	this.direction = 1;
	//this.entity.game.camera.follow(this.entity);
	this.launch();
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
	this.go.gravity = 1;
	this.launched = true;
}

BigRollingRock.prototype.update = function(){
	if( this.launched == true ){
		this.entity.angle += 0.2 * this.game.time.elapsed;
		this.entity.body.velocity.x = this.direction * this.speed;
		console.log(this.body.velocity.y);
	}
}

BigRollingRock.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape){
	if(_otherBody.layer == "player" && _otherShape.lr_name == "mainShape"){
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