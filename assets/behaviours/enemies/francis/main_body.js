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

	this.changeDeadZone(100,200,100);

	this.cameraFirstPos = new Phaser.Point(-300,-200);
	this.cameraTempPos = new Phaser.Point();
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

	//WALL BLOCKING THE PLAYER in the left
	if(_data.block_wall != null){
		this.block_wall = _data.block_wall;
		LR.Entity.FindByName(this.block_wall.entity,"wall_block").kill();
		LR.Entity.FindByName(this.block_wall.entity,"smoke").kill();
	}
	//Blocker - prevents Komo from going throught Francis Body
	this.blocker = _data.blocker;

	this.fallingWalls = _data.fwManager.getBehaviour(FallingWallsManager);
	this.finishWall = _data.finishWall;
	//finish block
	this.finishBlock = _data.finishBlock;
	this.finishBlock.entity.alpha = 0;
	this.finishBlock.enableSensor();

	this.initPos = this.go.position;
}

Francis.MainBody.prototype.update = function(){
	switch(this.state){
		case "idle":this.idle(); break;
		case "bouldering" : this.bouldering(); break;
	}
}

Francis.MainBody.prototype.followPlayer = function(){
	this.entity.game.camera.follow(this.playerScript.entity,Phaser.Camera.FOLLOW_PLATFORMER);
}

Francis.MainBody.prototype.unfollowPlayer = function(){
	this.entity.game.camera.unfollow();
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
	this.cameraTempPos = new Phaser.Point(this.entity.game.camera.x, this.entity.game.camera.y);
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

	this.blocker.playTween("moveRight");

	var instance = this;
	this.moveCamera(this.cameraTempPos.x,this.cameraTempPos.y,1000,
					function(){
						instance.followPlayer();
					}
	);
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
	this.tail.throwPlayer1();	
	this.changeDeadZone(this.dzPlayerPart2.x,this.dzPlayerPart2.y,1000);
}

Francis.MainBody.prototype.onPlayerHung = function(){
	this.blocker.enableSensor();
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
	//this.tail.onOrbHit();
	this.blocker.enableSensor();
	//eye
	this.eye.stopAnim("blink");
	this.eye.playAnim("stunned");
	var tween = this.tail.go.playTween("comeBack")[0];
	//Death
	if(_orbHealth < 0){
		this.playerScript.freeze();
		//make parts die
		this.arm.die();
		//push the player
		var vector = new Phaser.Point(1.5,0.2);
		this.playerScript.onReleaseHang(1, vector);	
		//die after camera's moved
		this.moveCamera(200,-100,1500,this.die);
	}else{
		this.moveCamera(200,-240,1500,this.struggle);
	}
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
	this.tail.stingerScript.resetPos();

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
	this.blocker.playTween("goBack");
	this.blocker.disableSensor();
	this.playerScript.unfreeze();
	this.entity.game.camera.follow(this.playerScript.entity);
	this.boulder();
	this.fallingWalls.cleanAll();
}

//=====================================================
//				  SIGNALS
//=====================================================

Francis.MainBody.prototype.onArmStomp = function(){
	if(this.state == "intro"){
		this.moveCamera(-600,-100,1000,this.onIntroBackToPlayerTweenFinished);
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
	/*this.onIntroBackToPlayerTweenFinished();
	this.changeDeadZone(100,200,1000);
	this.stun();
	return;*/
	this.state = "intro";
	this.unfollowPlayer();
	this.moveCamera(-200,-150,2000,this.introPincerAct);
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
      this.boulder, this);
}

//====================== DIE SCENE =============================

Francis.MainBody.prototype.die = function(){
	this.state = "dying";
	this.playerScript.freeze();
	//eye
	this.eye.stopAnim("blink");
	this.eye.playAnim("stunned");
	this.tail.stun();
	this.arm.stun();
	this.legs.stun();
	//eye
	this.eye.stopAnim("blink");
	this.eye.playAnim("stunned");
	//other parts
	this.bodyGO.playTween("stunned",true);

	//make block appear	
	this.finishBlock.entity.alphaBeforeHide = 1;
	this.finishBlock.disableSensor();

	this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 1, 
      this.rot,
      this);
}

Francis.MainBody.prototype.rot = function(){
	var color = 0x8d8d8d;
	var time = 3000;
	this.arm.rot(color,time);
	this.tail.rot(color,time);
	this.legs.rot(color,time);
	//unreferenced parts
	for(var i=0; i < this.bodyGO.entity.children.length; i++){
		var child = this.bodyGO.entity.children[i];
		if(child.type == 0){
			child.go.playTweenColor(color,time);
		}
	}
	this.entity.game.time.events.add( time + 1000, this.rotOrb, this);
}

Francis.MainBody.prototype.rotOrb = function(){
	this.tail.stingerScript.orb.getBehaviour(Francis.Orb).rot(0x8d8d8d,2000);
	this.entity.game.time.events.add(3000, this.moveCameraToFinishWall, this);
}

Francis.MainBody.prototype.moveCameraToFinishWall = function(){	
	this.moveCamera(600,-500,1500,this.moveFinishWall);
}

Francis.MainBody.prototype.moveFinishWall = function(){	
	this.finishWall.playTween("budge",false);
	this.finishWall.playTween("tremble",false);
	this.entity.game.time.events.add( 3000, this.endDieCutscene, this);
}

Francis.MainBody.prototype.endDieCutscene = function(){	
	var instance = this;
	var tween = this.moveCamera(500,-500);
	tween.onComplete.add(
		function(){
			instance.playerScript.unfreeze();
			instance.entity.game.camera.follow(instance.playerScript.entity);
		},this
	);
}
//=====================================================
//				  PLACE CAMERA
//=====================================================

Francis.MainBody.prototype.changeDeadZone = function(_x,_y,_duration,_promise){
	var tween = this.entity.game.add.tween(this.entity.game.camera.deadzone);
	if(_promise)
		tween.onComplete.add(_promise,this);
	tween.to( {"x": _x, "y":_y}, _duration , Phaser.Easing.Linear.None,true);
	return tween;
}

Francis.MainBody.prototype.moveCamera = function(_x,_y,_duration,_promise){
	this.entity.game.camera.unfollow();
	var tween = this.entity.game.add.tween(this.entity.game.camera);
	if(_promise)
		tween.onComplete.add(_promise,this);
	tween.to( {"x": _x, "y":_y}, _duration , Phaser.Easing.Linear.None,true);
	return tween;
}