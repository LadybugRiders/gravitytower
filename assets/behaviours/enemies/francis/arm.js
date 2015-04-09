"use strict";
//>>LREditor.Behaviour.name : Francis.Arm
if(!Francis)
	var Francis = {};

Francis.Arm = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.parts = new Array();
	this.pincer = null;
	this.state = "idle";

	this.boulderCountBase = 2;
	this.boulderMax = 2;

	this.go.onTweenComplete.add(this.onTweenComplete,this);

	this.onStomp = new Phaser.Signal();

	this.mainBodyScript = null;

	this.bouldersToLaunch = new Array();
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
		this.hintsGroups = new Array();
		for(var i=0; i < this.boulders.entity.children.length; i++){
			var rockGroup = this.boulders.entity.children[i];
			var rockScript = LR.Entity.FindByName(rockGroup,"rock").go.getBehaviour(FallingObject);
			this.bouldersScripts.push(rockScript);
			rockScript.die(false);
			//hints
			var hintGroup = LR.Entity.FindByName(rockGroup,"hintGroup");
			this.hintsGroups.push( hintGroup);
		}
	}
	this.stopHints();

	if(_data.boulderMe) this.boulderMe = _data.boulderMe;
	this.secondArm = _data.secondArm;
	this.pincer = _data.pincer;
}

Francis.Arm.prototype.update = function(){
	/*switch(this.state){
		//case "bouldering" : this.bouldering(); break;
	}*/
}

Francis.Arm.prototype.idleize = function(){
	this.go.playTween("idle");
}

Francis.Arm.prototype.wait = function(){
	this.state = "wait";
}

Francis.Arm.prototype.die = function(){
	this.state = "die";
	this.secondArm.stopAllTweens();
	for(var i=0; i < this.pincer.entity.children.length; i++){
		var child = this.pincer.entity.children[i];
		child.go.stopAllTweens();
	}
}

Francis.Arm.prototype.rot = function(_color,_time){
	this.secondArm.playTweenColor(_color,_time);
	for(var i=0; i < this.pincer.entity.children.length; i++){
		var child = this.pincer.entity.children[i];
		child.go.playTweenColor(_color,_time);
	}
	//unreferenced parts
	for(var i=0; i < this.entity.children.length; i++){
		var child = this.entity.children[i];
		if(child.type == 0){
			child.go.playTweenColor(_color,_time);
		}
	}
}

Francis.Arm.prototype.boulder = function(){
	//this.state ="boulderingMe"; //DEBUG
	if( this.state == "wait"){
		return;
	}
	this.state = "bouldering";
	this.boulderCount = this.boulderCountBase;
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
	//wait a little before launching boulders
	this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 1, 
      this.onHintsEnded,
      this);
	var count = 0;
	//Try launching a random boulder
	var r = Math.round( Math.random() * this.bouldersScripts.length );
	var bS = this.bouldersScripts[r];
	if( bS && bS.dead ){
		this.bouldersToLaunch.push(bS);
		this.playHint(this.hintsGroups[r]);
		count ++;
		if( count >= this.boulderMax)
			return;
	}
	//launch others 
	for(var i=0; i < this.bouldersScripts.length; i ++){
		bS = this.bouldersScripts[i];
		if(bS.dead){
			this.bouldersToLaunch.push(bS);
			this.playHint(this.hintsGroups[i]),
			count ++;
			if(count >= this.boulderMax)
				break;
		}
	}
}

Francis.Arm.prototype.onHintsEnded = function(){
	for(var i=0 ; i < this.bouldersToLaunch.length; i++){
		this.bouldersToLaunch[i].launch();
	}
	this.bouldersToLaunch = new Array();
	this.stopHints();
}

Francis.Arm.prototype.playHint = function(_hintGroup){
	for(var i=0 ; i < _hintGroup.children.length; i++){
		_hintGroup.children[i].alpha = 1;
		_hintGroup.children[i].go.playTween("openHint",true);
	}
}


Francis.Arm.prototype.stopHints = function(){
	for(var i=0 ; i < this.hintsGroups.length; i++){
		var hintGroup = this.hintsGroups[i];
		for( var j = 0 ; j< hintGroup.children.length; j++){
			hintGroup.children[j].go.stopAllTweens();
			hintGroup.children[j].alpha = 0;
			hintGroup.children[j].angle = 0;
		}
	}
}
//================================================
//				   STUN
//================================================

Francis.Arm.prototype.stun = function(){
	this.state = "stunned";
	var tween = this.go.playTween("stunned",true);
}

Francis.Arm.prototype.unstun = function(){
	this.state = "unstun";
	this.go.playTween("unstun",true);
}

//================================================
//				   STOMP
//================================================

Francis.Arm.prototype.stomp = function(){
	console.log(this.state);
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
			//if we haven't launched enough times
			if(this.boulderCount > 0){
				this.launchStompBoulder();
			//It's time to boulder itself
			}else{
				this.launchStompBoulder();
				this.boulderCountBase = 3;
				this.boulderMax = 3;
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