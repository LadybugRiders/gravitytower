"use strict";
//>>LREditor.Behaviour.name : Francis.MainBody
//>>LREditor.Behaviour.params : {"tail":null,"stinger":null,"legs":null,"eye":null,"pincer":null}
if(!Francis)
	var Francis = {};

Francis.MainBody = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.tail = null;
	this.stinger = null;

	this.state = "none";
}

Francis.MainBody.prototype = Object.create(LR.Behaviour.prototype);
Francis.MainBody.prototype.constructor = Francis.MainBody;

Francis.MainBody.prototype.create = function(_data){
	if(_data.tail) this.tail = _data.tail.getBehaviour(Francis.Tail);
	if(_data.stinger ) this.stinger = _data.stinger.getBehaviour(Francis.Stinger);
	if(_data.arm ) this.arm = _data.arm.getBehaviour(Francis.Arm);
	if(_data.legs) this.legs = _data.legs.getBehaviour(Francis.Legs);
	if(_data.eye) this.eye = _data.eye;
	if(_data.player){
		this.playerScript = _data.player.getBehaviour(Player);
	}

	this.bodyGO = LR.GameObject.FindByName(this.go,"body");

	this.arm.mainBodyScript = this;

	//signals
	this.arm.onStomp.add(this.onArmStomp,this);

	//WALL BLOCKING THE PLAYER
	if(_data.block_wall != null){
		this.block_wall = _data.block_wall;
		LR.Entity.FindByName(this.block_wall.entity,"wall_block").kill();
		LR.Entity.FindByName(this.block_wall.entity,"smoke").kill();
	}
}


Francis.MainBody.prototype.update = function(){
	switch(this.state){
		case "idle":this.idle(); break;
		case "bouldering" : this.bouldering(); break;
	}
}

Francis.MainBody.prototype.idle = function(){

}

Francis.MainBody.prototype.boulder = function(){
	this.state = "bouldering";
	this.arm.boulder();
}

Francis.MainBody.prototype.bouldering = function(){

}

//=====================================================
//================ STUN ===============================
//=====================================================

Francis.MainBody.prototype.beginBoulderMe = function(){	
	this.entity.game.camera.unfollow();
	this.moveCamera(-200,-150);
	this.playerScript.freeze();
}

//called by the head trigger callback
Francis.MainBody.prototype.onHitByRock = function(_data){
	if(_data.sender.name == "head"){
		this.stun();
	}
}

Francis.MainBody.prototype.stun = function(){
	this.state = "stunned";
	this.tail.stun();
	this.arm.stun();
	this.legs.stun();
	//eye
	this.eye.stopAnim("blink");
	this.eye.playAnim("stunned");
	//other parts
	this.bodyGO.playTween("stunned",true);
}

Francis.MainBody.prototype.unstun = function(){
	this.state = "wait";
	this.arm.idleize();
}


Francis.MainBody.prototype.moveTo = function(){

}


//=====================================================
//				  SIGNALS
//=====================================================

Francis.MainBody.prototype.onArmStomp = function(){
	if(this.state == "intro"){
		this.changeDeadZone(100,200,this.onIntroBackToPlayerTweenFinished);
	}
}

//=====================================================
//				  CUTSCENES
//=====================================================

//====================== INTRO =============================
//first make the camera move to Francis
Francis.MainBody.prototype.launchIntro = function(){
	this.onIntroBackToPlayerTweenFinished();
	this.changeDeadZone(100,200);
	return;
	this.state = "intro";
	this.changeDeadZone(-200,250,this.introPincerAct);
	this.playerScript.freeze();
}

// make the pincer stomp the ground
Francis.MainBody.prototype.introPincerAct = function(){
	this.arm.stomp();
}

//When the camera is back to the player, make the block wall appear
Francis.MainBody.prototype.onIntroBackToPlayerTweenFinished = function(){
	//make the block appear with smoke
	LR.Entity.FindByName(this.block_wall.entity,"wall_block").revive();
	var smoke = LR.Entity.FindByName(this.block_wall.entity,"smoke");
	smoke.revive();
	smoke.play("blow",10,false,true);
	smoke.go.playSound("blow");

	//begin the fight !!!
	this.playerScript.unfreeze();
	this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 1, 
      this.boulder,
      this);

}

//=====================================================
//				  PLACE CAMERA
//=====================================================

Francis.MainBody.prototype.changeDeadZone = function(_x,_y,_promise){
	var tween = this.entity.game.add.tween(this.entity.game.camera.deadzone);
	if(_promise)
		tween.onComplete.add(_promise,this);
	tween.to( {"x": _x, "y":_y}, this.duration , Phaser.Easing.Linear.None,true);
}

Francis.MainBody.prototype.moveCamera = function(_x,_y,_promise){
	var tween = this.entity.game.add.tween(this.entity.game.camera);
	if(_promise)
		tween.onComplete.add(_promise,this);
	tween.to( {"x": _x, "y":_y}, this.duration , Phaser.Easing.Linear.None,true);
}