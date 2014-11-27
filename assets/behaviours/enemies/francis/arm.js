"use strict";
//>>LREditor.Behaviour.name : Francis.Arm
if(!Francis)
	var Francis = {};

Francis.Arm = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.parts = new Array();
	this.pincer = null;
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
	//this.parts.push(this.pincer.go.getBehaviourInChildren(Francis.Part));
}

Francis.Arm.prototype.start = function(){
	//this.idleize();
}

Francis.Arm.prototype.idleize = function(){
	//this.parts.forEach(function(element){element.idleize()});
}