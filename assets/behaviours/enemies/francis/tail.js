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
}

Francis.Tail.prototype.start = function(){
	this.idleize();
}

Francis.Tail.prototype.update = function(){
	
}

Francis.Tail.prototype.idleize = function(){
	this.go.playTween("idle");
	this.entity.children.forEach(function(element){element.go.playTween("idle")});
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
	this.stingerScript.onUnreadyHang();
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
		this.go.stopTweenAll();
		for(var i=0; i < this.entity.children.length; i ++){
			if(this.entity.children[i].go.tweenExists("attack"))
				this.entity.children[i].go.playTween("attack",true);
		}
	}
	//tell stinger to attack
	this.stingerScript.attack(_data);
	this.state = "attack";
}

Francis.Tail.prototype.attacking = function(){
	
}
