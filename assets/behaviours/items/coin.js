"use strict";

//>>LREditor.Behaviour.name: Coin
//>>LREditor.Behaviour.params : {"callbackName":"", "messageObject" : {}, "otherNotified":null}

var Coin = function(_gameobject) {	
	Collectable.call(this,_gameobject);
}

Coin.prototype = Object.create(Collectable.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.create = function(_gameobject){
	Collectable.prototype.create.call(this,_gameobject);
	console.log(this.game.playerSave.getActiveLevelSave());
	var coinsIDs = this.game.playerSave.getActiveLevelSave().coinsIDs;
	for(var i=0; i < coinsIDs.length; i++){
		if( coinsIDs[i] == this.go.id ){
			this.entity.kill();
			break;
		}
	}
}

Coin.prototype.onCollected = function(_gameobject){
	Collectable.prototype.onCollected.call(this,_gameobject);
	this.game.playerSave.getActiveLevelSave().coinsIDs.push(this.go.id);
}