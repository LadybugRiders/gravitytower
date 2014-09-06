"use strict";
//>> LREditor.Behaviour.name : UIInGame
//>> LREditor.Behaviour.params : {"coins":null,"lives":null}
var UIInGame = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);

	this.coinsScript = null;
	this.livesScript = null;

	this.save = this.entity.game.playerSave;

	this.entity.game.pollinator.on("onLivesChanged",this.onLivesChanged,this);
	this.entity.game.pollinator.on("onCoinsChanged",this.onCoinsChanged,this);

}

UIInGame.prototype = Object.create(LR.Behaviour.prototype);
UIInGame.prototype.constructor = UIInGame;

UIInGame.prototype.create = function(_data){
	if( _data.coins ){
		this.coinsScript = _data.coins.entity;
	}
	if( _data.lives ){
		this.livesScript = _data.lives.entity;
	}
}

UIInGame.prototype.start = function(_data){
	this.onCoinsChanged();
	this.onLivesChanged();
}

UIInGame.prototype.onLivesChanged = function(_data){
	if(this.livesScript)
		this.livesScript.text = this.save.getSave()["lives"];
}

UIInGame.prototype.onCoinsChanged = function(_data){
	if(this.coinsScript)
		this.coinsScript.text = this.save["coins"];
}

