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
	var coinsIDs = this.game.playerSave.getActiveLevelSave().coinsIDs;
	for(var i=0; i < coinsIDs.length; i++){
		if( coinsIDs[i] == this.go.id ){
			this.entity.kill();
			break;
		}
	}
}

Coin.prototype.onCollected = function(_gameobject){
	if(this.collected)
		return;
  	this.entity.game.pollinator.dispatch("onCoinCollected");
	this.entity.body.destroy();
	this.collected = true;
	this.game.playerSave.getActiveLevelSave().coinsIDs.push(this.go.id);
	this.goToCoinUI();
}

Coin.prototype.goToCoinUI = function(){
	//we are going to fix the coin to the camera. So we need to compute the screen
	//position of the object
	var offsetX = Math.abs(this.entity.world.x -this.entity.game.camera.x) ;
	var offsetY = Math.abs(this.entity.world.y -this.entity.game.camera.y) ;

	this.entity.fixedToCamera = true;
	this.entity.cameraOffset.x = offsetX;
	this.entity.cameraOffset.y = offsetY;

	//create tween to the ui coin in the corner of the screen
	var tween = this.entity.game.add.tween(this.entity.cameraOffset);
    tween.to( {x:570, y:25},350,Phaser.Easing.Default,true,0,0,false);

    tween.onComplete.add(
    	function(){
  			this.entity.game.pollinator.dispatch("onCoinsChanged");
    		this.entity.kill();
    	},
    	this
    );
}