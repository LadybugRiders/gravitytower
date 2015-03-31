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

	this.cameraFirstPos = new Phaser.Point(-300,-200);
	this.dzPlayerPart1 = new Phaser.Point(100,200);
	this.dzPlayerPart2 = new Phaser.Point(100,140);
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

	this.initPos = this.go.position;
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
	if(this.state == "stunned")
		return;
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
	this.moveCamera(-200,-150,1000);
	this.playerScript.freeze();
	this.state = "boulderMe";
}

//called by the head trigger callback
Francis.MainBody.prototype.onHitByRock = function(_data){
	if(this.state == "boulderMe" && _data.sender.name == "head"){
		this.stun();
	}
}

Francis.MainBody.prototype.stun = function(){
	if(this.state == "stunned")
		return;
	this.state = "stunned";
	this.tail.stun();
	this.arm.stun();
	this.legs.stun();
	//eye
	this.eye.stopAnim("blink");
	this.eye.playAnim("stunned");
	//other parts
	this.bodyGO.playTween("stunned",true);
	//release player
	this.playerScript.unfreeze();
	this.changeDeadZone(this.dzPlayerPart1.x,this.dzPlayerPart2,
						1000,this.onIntroBackToPlayerTweenFinished);
}

Francis.MainBody.prototype.unstun = function(){
	this.state = "wait";
	this.arm.unstun();
	this.tail.unstun();
	this.legs.unstun();
	var tween = this.bodyGO.playTween("unstun",true)[0];
	tween.onComplete.add(this.throwPlayer1,this);

	this.eye.stopAnim("stunned");
	this.eye.playAnim("blink");

	this.changeDeadZone(100,100,1000);
}

//=============THROW PLAYER ================

Francis.MainBody.prototype.throwPlayer1 = function(){
	console.log("throwPlayer1");
	this.tail.throwPlayer1();	
	this.changeDeadZone(this.dzPlayerPart2.x,this.dzPlayerPart2.y,1000);
}

Francis.MainBody.prototype.onPlayerHung = function(){
	this.unstun();
}

//============= LAST ATTACK ==================
//call by the last tail attack trigger
Francis.MainBody.prototype.lastAttack = function(_data){
	if( this.state == "lastAttack")
		return;

	this.changeDeadZone(320,100,1000);
	this.state = "lastAttack";
	var tween = this.go.playTween("moveRight")[0];
	this.attackData = _data;
	tween.onComplete.add(this.onLastAttackReady,this);
	this.tail.go.playTween("lastAttackRotate",true);
}

Francis.MainBody.prototype.onLastAttackReady = function(){
	this.tail.tailAttack(this.attackData);	
}

//========= HIT !!!! =====================
Francis.MainBody.prototype.onOrbHit = function(_orbHealth){
	this.moveCamera(200,-240,1500,this.struggle);
	this.tail.onOrbHit();
	var tween = this.tail.go.playTween("comeBack")[0];
	//eye
	this.eye.stopAnim("blink");
	this.eye.playAnim("stunned");
}

Francis.MainBody.prototype.struggle = function(){
	this.tail.struggle();
	this.eye.stopAnim("stunned");
	this.eye.playAnim("blink");
}

Francis.MainBody.prototype.onEndStruggle = function(){
	//Trhow Player
	var vector = new Phaser.Point(-2.5,-0.2);
	this.playerScript.onReleaseHang(1, vector);	
	this.moveCamera(this.cameraFirstPos.x,this.cameraFirstPos.y,1000);

	this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 1, 
      this.moveBack,
      this);
}


Francis.MainBody.prototype.moveBack = function(){
	this.go.playTween("moveLeft",true,this.onMovedBack,this);
	this.changeDeadZone(this.dzPlayerPart1,this.dzPlayerPart2,200);
	this.tail.idleize();
}

Francis.MainBody.prototype.onMovedBack = function(){
	this.playerScript.unfreeze();
	this.entity.game.camera.follow(this.playerScript.entity);
}

//=====================================================
//				  SIGNALS
//=====================================================

Francis.MainBody.prototype.onArmStomp = function(){
	if(this.state == "intro"){
		this.changeDeadZone(this.dzPlayerPart1.x,this.dzPlayerPart1.y,
							1000,this.onIntroBackToPlayerTweenFinished);
	}
}

//=====================================================
//				  CUTSCENES
//=====================================================

//====================== INTRO =============================
//first make the camera move to Francis
Francis.MainBody.prototype.launchIntro = function(){
	//keep Camera
	this.cameraFirstPos = new Phaser.Point(this.entity.game.camera.x,this.entity.game.camera.y);
	
	//DEBUG
	this.onIntroBackToPlayerTweenFinished();
	this.changeDeadZone(100,200,1000);
	this.stun();
	this.playerScript.freeze();
	return;
	this.state = "intro";
	this.changeDeadZone(-200,250,3000,this.introPincerAct);
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

Francis.MainBody.prototype.changeDeadZone = function(_x,_y,_duration,_promise){
	var tween = this.entity.game.add.tween(this.entity.game.camera.deadzone);
	if(_promise)
		tween.onComplete.add(_promise,this);
	tween.to( {"x": _x, "y":_y}, _duration , Phaser.Easing.Linear.None,true);
}

Francis.MainBody.prototype.moveCamera = function(_x,_y,_duration,_promise){
	this.entity.game.camera.unfollow();
	var tween = this.entity.game.add.tween(this.entity.game.camera);
	if(_promise)
		tween.onComplete.add(_promise,this);
	tween.to( {"x": _x, "y":_y}, _duration , Phaser.Easing.Linear.None,true);
}