"use strict";
//>>LREditor.Behaviour.name : Francis.Stinger
//>>LREditor.Behaviour.params : {"orb":null,"stinger":null}
if(!Francis)
	var Francis = {};

Francis.Stinger = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);
	this.state = "idle";
	this.mainOffset = new Phaser.Point(0,0);
	this.orbOffset = new Phaser.Point();
}

Francis.Stinger.prototype = Object.create(LR.Behaviour.prototype);
Francis.Stinger.prototype.constructor = Francis.Stinger;

Francis.Stinger.prototype.create = function(_data){
	if(_data.stinger) this.stinger = _data.stinger;
	if(_data.orb){
		this.orb = _data.orb;
		this.orbOffset.x = this.orb.x - this.stinger.x;
		this.orbOffset.y = this.orb.y - this.stinger.y;
	} 
}

Francis.Stinger.prototype.update = function(_data){
	this.placeOrb();
}

Francis.Stinger.prototype.placeOrb = function(_data){
	this.orb.x = this.stinger.entity.x + this.orbOffset.x;
	this.orb.y = this.stinger.entity.y + this.orbOffset.y;
}