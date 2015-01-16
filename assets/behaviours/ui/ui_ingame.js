"use strict";
//>> LREditor.Behaviour.name : UIInGame
//>> LREditor.Behaviour.params : {"coins":null,"lives":null,"quit_button":null,"mute_button":null}
var UIInGame = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);

	this.coins = null;
	this.lives = null;
	this.quit_button = null;
	this.mute_button = null;

	this.livesUIOpen = false;
	this.coinsUIOpen = false;
	this.menuUIOpen = false;

	this.playerSave = this.entity.game.playerSave;

	this.entity.game.pollinator.on("onLivesChanged",this.onLivesChanged,this);
	this.entity.game.pollinator.on("onCoinsChanged",this.onCoinsChanged,this);
	this.entity.game.pollinator.on("onCoinCollected",this.showCoins,this);

	this.entity.onDestroy.add(this.onDestroy,this);
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
		this.coinsUI = this.coins.parent.go;
		this.coinsUIy = this.coinsUI.entity.cameraOffset.y;
		this.coinsUI.entity.cameraOffset.y = -30;
	}
	if( _data.lives ){
		this.lives = _data.lives.entity;
		this.livesUI = this.lives.parent.go;
		this.livesUIy = this.coinsUI.entity.cameraOffset.y;
		this.livesUI.entity.cameraOffset.y = -30;
	}
	if( _data.mute_button ){
		this.mute_button = _data.mute_button;
	}
	if( _data.quit_button ){
		this.quit_button = _data.quit_button;
	}

	this.showCoins();
}

UIInGame.prototype.onDestroy = function(){
	this.entity.game.pollinator.off("onLivesChanged",this.onLivesChanged,this);
	this.entity.game.pollinator.off("onCoinsChanged",this.onCoinsChanged,this);
	this.entity.game.pollinator.off("onCoinCollected",this.showCoins,this);
}

UIInGame.prototype.start = function(_data){
	this.onCoinsChanged();
	this.onLivesChanged();
}

UIInGame.prototype.onLivesChanged = function(){
	if(this.lives){
		this.showLives();
		this.lives.text = this.playerSave.getValue("lives");
	}
}

UIInGame.prototype.onCoinsChanged = function(){
	if(this.coins){
		this.coins.text = this.playerSave.getActiveLevelSave().coins;
	}
}

function createDebugSave(_this){
	var debugSave = _this.playerSave.createLevelSave("debug");
	debugSave.coins = 0;
	debugSave.kimis = [];
	debugSave.coinsIDs = [];
	debugSave.checkpoint = {active:false,
							kimis: [], 
							coinsIDs : []};
	_this.playerSave.activateLevelSave("debug");
}

//===============================================
//			SHOW / HIDE
//===============================================
UIInGame.prototype.showCoins = function(){
	if(! this.coinsUIOpen ){
		this.hideMenu();
		this.coinsUIOpen = true;
		var tween = this.go.game.add.tween(this.coinsUI.entity.cameraOffset);
	    tween.to( {y:this.coinsUIy},350,Phaser.Easing.Default,true,0,0,false);
	    //timer to close the ui
	    this.go.game.time.events.add(
	      Phaser.Timer.SECOND * 3, 
	      function(){ this.hideCoins();},
	      this);
	}
}

UIInGame.prototype.hideCoins = function(){
	if( this.coinsUIOpen ){
		this.showMenu();
		this.coinsUIOpen = false;
		var tween = this.go.game.add.tween(this.coinsUI.entity.cameraOffset);
	    tween.to( {y:-30},350,Phaser.Easing.Default,true,0,0,false);
	}
}

UIInGame.prototype.showLives = function(){
	if(! this.livesUIOpen ){
		this.hideMenu();
		this.livesUIOpen = true;
		var tween = this.go.game.add.tween(this.livesUI.entity.cameraOffset);
	    tween.to( {y:this.coinsUIy},350,Phaser.Easing.Default,true,0,0,false);
	    //timer to close the ui
	    this.go.game.time.events.add(
	      Phaser.Timer.SECOND * 3, 
	      function(){ this.hideLives();},
	      this);
	}
}

UIInGame.prototype.hideLives = function(){
	if( this.livesUIOpen ){
		this.showMenu();
		this.livesUIOpen = false;
		var tween = this.go.game.add.tween(this.livesUI.entity.cameraOffset);
	    tween.to( {y:-30},350,Phaser.Easing.Default,true,0,0,false);
	}
}

UIInGame.prototype.showMenu = function(){
	if(!this.menuUIOpen){

		this.menuUIOpen = true;
		//quit button
		var tween = this.go.game.add.tween(this.quit_button.entity.cameraOffset);
	    tween.to( {x: 30},350,Phaser.Easing.Default,true,0,0,false);
		//mute button
		tween = this.go.game.add.tween(this.mute_button.entity.cameraOffset);
	    tween.to( {x: this.entity.game.camera.width-30},350,Phaser.Easing.Default,true,0,0,false);
	}
}

UIInGame.prototype.hideMenu = function(){
	if(this.menuUIOpen){
		this.menuUIOpen = false;
		var tween = this.go.game.add.tween(this.quit_button.entity.cameraOffset);
	    tween.to( {x: -30},350,Phaser.Easing.Default,true,0,0,false);
		//mute button
		tween = this.go.game.add.tween(this.mute_button.entity.cameraOffset);
		tween.to( {x: this.entity.game.camera.width+30},350,Phaser.Easing.Default,true,0,0,false);
	}
}
