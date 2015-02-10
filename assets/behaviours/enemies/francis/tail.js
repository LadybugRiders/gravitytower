"use strict";
//>>LREditor.Behaviour.name : Francis.Tail
if(!Francis)
	var Francis = {};

Francis.Tail = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.parts = new Array();
	this.stingerScript = null;
}

Francis.Tail.prototype = Object.create(LR.Behaviour.prototype);
Francis.Tail.prototype.constructor = Francis.Tail;

Francis.Tail.prototype.create = function(_data){
	if(_data.stinger) this.stingerScript = _data.stinger.getBehaviour(Francis.Stinger);
}

Francis.Tail.prototype.start = function(){
	this.idleize();
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
}
