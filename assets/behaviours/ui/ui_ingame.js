"use strict";
//>> LREditor.Behaviour.name : UIInGame
//>> LREditor.Behaviour.params : {"coins":null,"lives":null}
var UIInGame = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);

	this.coins = null;
	this.lives = null;

	this.playerSave = this.entity.game.playerSave;

	this.entity.game.pollinator.on("onLivesChanged",this.onLivesChanged,this);
	this.entity.game.pollinator.on("onCoinsChanged",this.onCoinsChanged,this);

	//DEBUG
	if( this.entity.game.playerSave.getActiveLevelSave() == null){
		createDebugSave(this);
	}

}

UIInGame.prototype = Object.create(LR.Behaviour.prototype);
UIInGame.prototype.constructor = UIInGame;

UIInGame.prototype.create = function(_data){
	if( _data.coins ){
		this.coins = _data.coins.entity;
	}
	if( _data.lives ){
		this.lives = _data.lives.entity;
	}
}

UIInGame.prototype.start = function(_data){
	this.onCoinsChanged();
	this.onLivesChanged();
}

UIInGame.prototype.onLivesChanged = function(_data){
	if(this.lives)
		this.lives.text = this.playerSave.getValue("lives");
}

UIInGame.prototype.onCoinsChanged = function(_data){
	if(this.coins){
		this.coins.text = this.playerSave.getActiveLevelSave().coins;
	}
}

function createDebugSave(_this){
	var debugSave = _this.playerSave.createLevelSave("debug");
	debugSave.coins = 0;
	debugSave.kimis = [];
	debugSave.coinsAtCheckpoint = 0;
	debugSave.collectedCoinsIDs = [];
	debugSave.collectedCoinsIDsAtCheckpoint = [];
	debugSave.kimisAtCheckpoint = debugSave.kimis;
	_this.playerSave.activateLevelSave("debug");
}