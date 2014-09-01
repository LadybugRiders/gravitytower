"use strict";
//>>LREditor.Behaviour.name : Francis.MainBody
//>>LREditor.Behaviour.params : {"tail":null,"stinger":null,"legs":null,"eye":null,"pincer":null}
if(!Francis)
	var Francis = {};

Francis.MainBody = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.tail = null;
	this.stinger = null;
}

Francis.MainBody.prototype = Object.create(LR.Behaviour.prototype);
Francis.MainBody.prototype.constructor = Francis.MainBody;

Francis.MainBody.prototype.create = function(_data){
	if(_data.tail) this.tail = _data.tail.getBehaviour(Francis.Tail);
	if(_data.stinger ) this.stinger = _data.stinger.getBehaviour(Francis.Stinger);
	if(_data.arm ) this.arm = _data.arm.getBehaviour(Francis.Arm);
	if(_data.legs) this.legs = _data.legs;
	if(_data.eye) this.eye = _data.eye;

	this.head = LR.Entity.FindByName(this.entity,"head");
	this.body1 = LR.Entity.FindByName(this.entity,"body1");
	this.body2 = LR.Entity.FindByName(this.entity,"body2");
	this.little_pincer = LR.Entity.FindByName(this.entity,"pincer_back");

	this.head.go.getBehaviour(Francis.Part).setMainBody(this);
	this.body2.go.getBehaviour(Francis.Part).setMainBody(this);
	this.little_pincer.go.getBehaviour(Francis.Part).setMainBody(this);

	this.tail.setMainBody(this);
	this.arm.setMainBody(this);
}

Francis.MainBody.prototype.update = function(){
	this.body1.go.x-=0.1;
}

Francis.MainBody.prototype.moveTo = function(){

}