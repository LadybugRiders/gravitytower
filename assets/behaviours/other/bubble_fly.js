"use strict";

//>>LREditor.Behaviour.name: BubbleFly
//>>LREditor.Behaviour.params : {"checkpoint":null}
var BubbleFly = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.playerScript = null;
	this.state = "idle";

	this.movePressed = false;
	this.jumpPressed = false;
	this.direction = 1;

	this.rightIsPressed = false;
	this.leftIsPressed = false;

	this.dead = false;

	this.currentSpeedX = 0;
	this.currentSpeedY = 0;

	this.maxSpeedX = 100;

	this.maxVelocityY = -110;
	this.accY = -50;

}

BubbleFly.prototype = Object.create(LR.Behaviour);
BubbleFly.prototype.constructor = BubbleFly;

BubbleFly.prototype.create = function(_data){
	var toCreate = true;
	if(_data.checkpoint != null){
  		var playerSave = this.entity.game.playerSave;
 		var levelSave = playerSave.getActiveLevelSave();
 		if( levelSave.checkpoint == null || levelSave.checkpoint.id != _data.checkpoint.id){
 			toCreate = false;
 		}
	}

	if( toCreate ){
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
	}else{
		this.entity.kill();
	}
}

BubbleFly.prototype.update = function(_data){
	if( this.playerScript && this.dead == false){
		this.processSpeed();

		this.playerScript.go.x = this.entity.x;
		this.playerScript.go.y = this.entity.y;
		this.playerScript.entity.angle += 10 * this.entity.game.time.elapsed * 0.001;	
	}
}

BubbleFly.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	if(this.dead == false && _otherBody.go.layer == "player" && this.playerScript == null ){
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
	if(this.dead)
		return;
	this.playerScript.freeze();
	this.playerScript.go.gravity = 0;
	this.entity.go.gravity = 0.06;
	this.go.changeLayer("noplayer");
}

BubbleFly.prototype.deactivate = function(){
	//Reset player proper properties
	this.playerScript.unfreeze();
	this.playerScript.go.gravity = 1;
	this.playerScript.entity.angle = 0;
	this.playerScript.go.body.setZeroVelocity();
	//change this entity's properties
	this.entity.go.gravity = 0;
	this.go.changeLayer("default");
	this.playerScript = null;
	this.dead = true;
	this.entity.kill();
}

BubbleFly.prototype.pop = function(){
	this.dead = true;
	this.playerScript.die();
	this.deactivate();
}

//========================================================
//					MOVES
//========================================================


BubbleFly.prototype.onMoveLeft = function(_key){
	if(this.playerScript == null)
		return;
	this.leftIsPressed = true;
	this.movePressed = true;
	if(this.direction > 0){
		this.currentSpeedX *= 0.5;
	}
	
	this.direction = -1;
}

BubbleFly.prototype.onMoveRight = function(_key){
	if(this.playerScript == null)
		return;
	this.rightIsPressed = true;
	this.movePressed = true;
	if(this.direction < 0){
		this.currentSpeedX *= 0.5;
	}

	this.direction = 1;
}

BubbleFly.prototype.onMoveRelease = function(_data){
	if(_data.lr_name == "left") this.leftIsPressed = false;
	if(_data.lr_name == "right") this.rightIsPressed = false;
	if(this.playerScript == null)
		return;

	if( ! this.leftIsPressed && !this.rightIsPressed )
		this.movePressed = false;
}

BubbleFly.prototype.onJump = function(_key){
	if(this.playerScript == null)
		return;
	if(this.entity.body.velocity.y > 0){
		this.entity.body.velocity.y = this.accY;
	}else{
		this.entity.body.velocity.y += this.accY;
		if(this.entity.body.velocity.y < this.maxVelocityY){
			this.entity.body.velocity.y = this.maxVelocityY;
		}
	}
	this.jumpPressed = true;
	this.go.playSound("up",0.2);
}

BubbleFly.prototype.onJumpRelease = function(_key){
	if(this.playerScript == null)
		return;
	this.jumpPressed = false;
}