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
	if(_data.stinger) this.stingerScript = _data.stinger.getBehaviour(Francis.Stinger)
	// var child = null;
	// for(var i=0; i<5; i++){
	// 	child = LR.Entity.FindByName(this.entity,"tail"+(i+1));
	// 	var script = child.go.getBehaviour(Francis.Part);
	// 	this.parts.push(script);
	// }
	// this.parts.push(this.stingerScript.go.getBehaviourInChildren(Francis.Part));
}

Francis.Tail.prototype.start = function(){
	this.idleize();
}

Francis.Tail.prototype.idleize = function(){
	this.go.launchTween("idle");
	//this.parts.forEach(function(element){element.idleize()});
}
