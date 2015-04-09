"use strict";
//>>LREditor.Behaviour.name : Francis.Tail
if(!Francis)
	var Francis = {};

Francis.Tail = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.parts = new Array();
	this.stingerGroup = null;
	this.stingerScript = null;

	this.state = "idle";

	//natural graphic rotation of the tail without angle applied
	this.naturalRotation= 30;
	//length from the base position to the stinger
	this.tailLength = 380;

	this.currentTriggerAttackID = -1;
	this.initLocalPosition = new Phaser.Point(this.go.x,this.go.y);
}

Francis.Tail.prototype = Object.create(LR.Behaviour.prototype);
Francis.Tail.prototype.constructor = Francis.Tail;

Francis.Tail.prototype.create = function(_data){
	this.stingerGroup = _data.stinger;
	this.stingerScript = this.stingerGroup.getBehaviourInChildren(Francis.Stinger);
	this.stingerScript.tailScript = this;
	this.mainBody = _data.mainBody.getBehaviour(Francis.MainBody);
}

Francis.Tail.prototype.start = function(){
	//this.idleize();
	this.smallIdleize();
}

Francis.Tail.prototype.update = function(){
	switch(this.state){
		case "attack" : this.attacking(); break;
	}
}

Francis.Tail.prototype.idleize = function(){
	this.go.playTween("idle");
	this.entity.children.forEach(function(element){element.go.playTween("idle")});
}

Francis.Tail.prototype.smallIdleize = function(){
	this.go.playTween("idleSmall",true);
}

Francis.Tail.prototype.stun = function(){
	this.go.playTween("stunned",true);
	for(var i=0; i < this.entity.children.length; i ++){
		this.entity.children[i].go.playTween("stunned",true);
	}
	this.stingerScript.onReadyHang();
}

Francis.Tail.prototype.unstun = function(){
	this.go.playTween("unstun",true);
	for(var i=0; i < this.entity.children.length; i ++){
		//this.entity.children[i].go.playTween("unstun",true);
	}
	//this.stingerScript.onUnreadyHang();
}

Francis.Tail.prototype.throwPlayer1 = function(){
	this.stingerScript.throwPlayer1();
}

//============ ATTACKS ==========================
Francis.Tail.prototype.tailAttack = function(_data){
	if( this.currentTriggerAttackID == _data.sender.id)
		return;
	this.currentTriggerAttackID = _data.sender.id;
	if( this.state != "attack"){
		//stop tween and get parts in attack position
		this.go.stopAllTweens();
		for(var i=0; i < this.entity.children.length; i ++){
			var childGo = this.entity.children[i].go;
			childGo.stopAllTweens();
			var tweenData = childGo.tweensData["attack"];
			if( tweenData ){
				var properties = JSON.parse(tweenData.data.properties);
				childGo.entity.x = properties.x;
				childGo.entity.y = properties.y;
				childGo.entity.angle = properties.angle;
			}

			/*
			if(this.entity.children[i].go.tweenExists("attack"));
				this.entity.children[i].go.playTween("attack",true);*/
		}
	}
	//tell stinger to attack
	this.stingerScript.attack(_data);
	this.state = "attack";
}

Francis.Tail.prototype.tailRetreat = function(){
	if(this.stingerScript.state == "stuck")
		this.stingerScript.retreat();
}

Francis.Tail.prototype.onOrbHit = function(){
	this.stingerScript.onOrbHit();
}

Francis.Tail.prototype.attacking = function(){
	for(var i=0; i < this.entity.children.length; i ++){
		var childGo = this.entity.children[i].go;
		childGo.stopAllTweens();
		var tweenData = childGo.tweensData["attack"];
		if( tweenData ){
			var properties = JSON.parse(tweenData.data.properties);
			childGo.entity.x = properties.x;
			childGo.entity.y = properties.y;
			childGo.entity.angle = properties.angle;
		}
	}
}

Francis.Tail.prototype.lastAttack = function(){
	
}

Francis.Tail.prototype.struggle = function(){
	//this.entity.children.forEach(function(element){element.go.playTween("idle")});
	var tween = this.go.playTween("struggle",true,this.onStruggleEnded,this);
}

Francis.Tail.prototype.onStruggleEnded = function(){
	this.stingerScript.orb.getBehaviour(Francis.Orb).release();
	this.mainBody.onEndStruggle();
}

Francis.Tail.prototype.rot = function(_color,_time){
	//unreferenced parts
	for(var i=0; i < this.entity.children.length; i++){
		var child = this.entity.children[i];
		if(child.type == 0){
			child.go.playTweenColor(_color,_time);
		}
	}
	this.stingerScript.go.playTweenColor(_color,_time);
}
