"use strict";

//>>LREditor.Behaviour.name: TutoManager
//>>LREditor.Behaviour.params : {"player":null, "background":null, "button":null}
var TutoManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.currentTuto = null;
}

TutoManager.prototype = Object.create(LR.Behaviour.prototype);
TutoManager.prototype.constructor = TutoManager;

TutoManager.prototype.create = function(_data){
	if(_data.player) this.player = _data.player.getBehaviour(Player);
	if( _data.background ){
		this.background = _data.background;
		this.background.entity.kill();
	}
	if( _data.button){
		this.button = _data.button;
		this.button.entity.kill();
	}
}

TutoManager.prototype.launchTuto = function(_data){
	this.currentTuto = LR.Entity.FindByName(this.entity, _data.name);
	if(this.currentTuto == null)
		return;
	this.button.entity.revive(),
	this.background.entity.revive();
	this.currentTuto.callAll("revive",true);
	this.player.freeze();
}

TutoManager.prototype.closeTuto = function(){
	this.button.entity.kill();
	this.background.entity.kill();
	if( this.currentTuto ){
		this.currentTuto.destroy();
		this.currentTuto = null;
	}
	this.player.unfreeze();
}