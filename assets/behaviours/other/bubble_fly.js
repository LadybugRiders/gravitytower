"use strict";

//>>LREditor.Behaviour.name: BubbleFly
//>>LREditor.Behaviour.params : {"bottom":true}
var BubbleFly = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.playerScript = null;
	this.state = "idle";

	this.movePressed = false;
	this.jumpPressed = false;
	this.direction = 1;

	this.currentSpeedX = 0;
	this.currentSpeedY = 0;

	this.maxSpeedX = 100;

	//============= INPUTS =======================
  	//use the inputManager to be notified when the JUMP key is pressed
  	this.go.game.inputManager.bindKeyPress("jump",this.onJump,this);
 	this.go.game.inputManager.bindKeyRelease("jump",this.onJumpRelease,this);
  	//press to move
  	this.go.game.inputManager.bindKeyPress("left", this.onMoveLeft, this);
  	this.go.game.inputManager.bindKeyPress("right", this.onMoveRight, this);
  	//Stop on release
  	this.go.game.inputManager.bindKeyRelease("left", this.onMoveRelease, this);
  	this.go.game.inputManager.bindKeyRelease("right", this.onMoveRelease, this);
}

BubbleFly.prototype = Object.create(LR.Behaviour);
BubbleFly.prototype.constructor = BubbleFly;

BubbleFly.prototype.create = function(_data){
	
}

BubbleFly.prototype.update = function(_data){
	if( this.playerScript ){
		this.playerScript.go.x = this.entity.x;
		this.playerScript.go.y = this.entity.y;
		this.playerScript.entity.angle += 10 * this.entity.game.time.elapsed * 0.001;
	
		this.processSpeed();
	}
}

BubbleFly.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	if(_otherBody.go.layer == "player" && this.playerScript == null ){
		this.playerScript = _otherBody.go.getBehaviour(Player);
		if(this.playerScript == null)
			return;
		this.activate();
	}
}

BubbleFly.prototype.processSpeed = function(){
	if( this.movePressed ){
		this.currentSpeedX +=  this.direction * 60 * this.entity.game.time.elapsed * 0.001;
		if( this.currentSpeedX >= this.maxSpeedX){
			this.currentSpeedX = this.maxSpeedX;
		}
		this.entity.body.velocity.x = this.currentSpeedX;
	}
}

BubbleFly.prototype.activate = function(){	
	this.playerScript.freeze();
	this.playerScript.go.gravity = 0;
	this.entity.go.gravity = 0.06;
	this.go.changeLayer("noplayer");
}

BubbleFly.prototype.deactivate = function(){	
	this.playerScript.unfreeze();
	this.playerScript.go.gravity = 1;
	this.entity.go.gravity = 0;
	this.go.changeLayer("default");
}
//========================================================
//					MOVES
//========================================================


BubbleFly.prototype.onMoveLeft = function(_key){
	if(this.playerScript == null)
		return;
	this.movePressed = true;
	if(this.direction > 0){
		this.currentSpeedX *= 0.5;
	}
	this.direction = -1;
}

BubbleFly.prototype.onMoveRight = function(_key){
	if(this.playerScript == null)
		return;
	this.movePressed = true;
	if(this.direction < 0){
		this.currentSpeedX *= 0.5;
	}
	this.direction = 1;
}

BubbleFly.prototype.onMoveRelease = function(){
	if(this.playerScript == null)
		return;
	this.movePressed = false;
}

BubbleFly.prototype.onJump = function(_key){
	if(this.playerScript == null)
		return;
	this.entity.body.velocity.y = -70;
	this.jumpPressed = true;
}

BubbleFly.prototype.onJumpRelease = function(_key){
	if(this.playerScript == null)
		return;
	this.jumpPressed = false;
}