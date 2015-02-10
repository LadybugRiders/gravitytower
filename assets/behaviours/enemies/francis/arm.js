"use strict";
//>>LREditor.Behaviour.name : Francis.Arm
if(!Francis)
	var Francis = {};

Francis.Arm = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.parts = new Array();
	this.pincer = null;
	this.state = "idle";

	this.go.onTweenComplete.add(this.onTweenComplete,this);

	this.onStomp = new Phaser.Signal();

	this.mainBodyScript = null;
}

Francis.Arm.prototype = Object.create(LR.Behaviour.prototype);
Francis.Arm.prototype.constructor = Francis.Arm;

Francis.Arm.prototype.create = function(_data){
	if(_data.pincer) this.pincer = _data.pincer.getBehaviour(Francis.Pincer);
	var child = null;
	for(var i=0; i<3; i++){
		child = LR.Entity.FindByName(this.entity,"arm"+(i+1));
		var script = child.go.getBehaviour(Francis.Part);
		this.parts.push(script);
	}
	var entity = LR.Entity.FindByName(this.entity,"little_pincer");
	this.parts.push(entity.go.getBehaviour(Francis.Part));

	if(_data.boulders) this.boulders = _data.boulders;
	//get boulders scripts
	if(this.boulders){
		this.bouldersScripts = new Array();
		for(var i=0; i < this.boulders.entity.children.length; i++){
			var rockGroup = this.boulders.entity.children[i];
			var rockScript = LR.Entity.FindByName(rockGroup,"rock").go.getBehaviour(FallingObject);
			this.bouldersScripts.push(rockScript);
			rockScript.die(false);
		}
	}

	if(_data.boulderMe) this.boulderMe = _data.boulderMe;
}

Francis.Arm.prototype.update = function(){
	switch(this.state){
		case "bouldering" : this.bouldering(); break;
	}
}

Francis.Arm.prototype.idleize = function(){
	this.go.playTween("idle");
}

Francis.Arm.prototype.boulder = function(){
	this.state ="boulderingMe"; //DEBUG
	//this.state = "bouldering";
	this.boulderCount = 2;
	this.boulderMax = 2;
	this.launchStompBoulder();
}

Francis.Arm.prototype.launchStompBoulder = function(){
	this.boulderCount --;

	this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 1, 
      this.stomp,
      this);
}

Francis.Arm.prototype.launchBoulder = function(){
	var count = 0;
	var r = Math.round( Math.random() * this.bouldersScripts.length );
	var bS = this.bouldersScripts[r];
	if( bS && bS.dead ){
		bS.launch();
		count ++;
		if( count >= this.boulderMax)
			return;
	}
	for(var i=0; i < this.bouldersScripts.length; i ++){
		bS = this.bouldersScripts[i];
		if(bS.dead){
			bS.launch();
			count ++;
			if(count >= this.boulderMax)
				break;
		}
	}
}

Francis.Arm.prototype.bouldering = function(){

}

//================================================
//				   STUN
//================================================

Francis.Arm.prototype.stun = function(){
	this.go.playTween("stunned",true);
}

//================================================
//				   STOMP
//================================================

Francis.Arm.prototype.stomp = function(){
	this.go.stopTween("idle");
	this.go.playChainedTweens("ready_quick","stomp");
}

Francis.Arm.prototype.onTweenComplete = function(_data){
	if(_data.tweenData.name == "stomp"){
		this.go.playSound("stomp");
		this.onStomp.dispatch();
		//continue bouldering
		if(this.state == "bouldering"){
			this.launchBoulder();
			console.log(thi)
			if(this.boulderCount > 0){
				this.launchStompBoulder();
			}else{
				this.launchStompBoulder();
				this.state = "boulderingMe";
			}
		}else if(this.state == "boulderingMe"){
			this.entity.game.time.events.add(
		      Phaser.Timer.SECOND * 1.5, 
		      this.boulderMe.getBehaviour(FallingObject).launch,
		      this.boulderMe.getBehaviour(FallingObject));
			
			this.mainBodyScript.beginBoulderMe();
		}
	}
}