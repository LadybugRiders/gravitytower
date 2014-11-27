"use strict";
//>>LREditor.Behaviour.name : Francis.Part
if(!Francis)
	var Francis = {};

Francis.Part = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);
	this.position = new Phaser.Point();
	this.initPos = new Phaser.Point(this.entity.x,this.entity.y);
}

Francis.Part.prototype = Object.create(LR.Behaviour.prototype);
Francis.Part.prototype.constructor = Francis.Part;

Francis.Part.prototype.create = function(_data){
	this.idleBegin = _data.idleBegin;
	this.idleEnd = _data.idleEnd;
	if(this.idleBegin)
		this.idleBegin.angle = this.entity.angle;
}

Francis.Part.prototype.update = function(){
	this.go.x = this.position.x ;
	this.go.y = this.position.y ;
}

Francis.Part.prototype.goTo = function (_tweenData) {
	var target = this.entity.body || this.entity;
	var data = {};
	data.x = _tweenData.x ;
	data.y = _tweenData.y ;
	this.entity.game.add.tween(target).to(
		this.idleBegin,2000,null,true,0,1,false
	);
	/*this.entity.game.add.tween(this.target).to(
		{"angle":this.idleBegin.angle},2000,null,true,0,1,false
	);*/
}

Francis.Part.prototype.idleize = function(){
	var target = this.entity.body || this.entity;
	this.entity.game.add.tween(target).to(
		this.idleEnd,2000,null,true,0,Number.MAX_VALUE,true
	);
// 	this.entity.game.add.tween(target).to(
// 		{angle:this.idleEnd.angle},2000,null,true,0,Number.MAX_VALUE,true
// 	);
}
