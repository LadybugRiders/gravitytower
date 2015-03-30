"use strict";
//>>LREditor.Behaviour.name : Francis.Leg
//>>LREditor.Behaviour.params : { "part1":null, "part2":null }
if(!Francis)
	var Francis = {};

Francis.Leg = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);
}

Francis.Leg.prototype = Object.create(LR.Behaviour.prototype);
Francis.Leg.prototype.constructor = Francis.Leg;

Francis.Leg.prototype.create = function(_data){
	if(_data.part1) this.part1 = _data.part1;
	if(_data.part2) this.part2 = _data.part2;
}

//============ STUN ========================
Francis.Leg.prototype.stun = function(){
	this.part1.playTween("stunned",true);
	this.part2.playTween("stunned",true);
}

Francis.Leg.prototype.unstun = function(){
	this.part1.playTween("unstun",true);
	this.part2.playTween("unstun",true);
}