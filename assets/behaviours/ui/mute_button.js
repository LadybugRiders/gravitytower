"use strict";

//>>LREditor.Behaviour.name: MuteButton
//>>LREditor.Behaviour.params : {}
var MuteButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
};

MuteButton.prototype = Object.create(LR.Behaviour.Button.prototype);
MuteButton.prototype.constructor = MuteButton;

MuteButton.prototype.create = function(_data) {
	this.playerSave = this.entity.game.playerSave;
	var dataMute = this.playerSave.getValue("mute");
	if( dataMute == null ){
		this.playerSave.setValue("mute",false); 
		this.playerSave.writeSave();
	}else{
		if(dataMute == true) this.mute();
	}
}

MuteButton.prototype.onInputDown = function() {
	if( this.entity.game.sound.mute )
		this.unmute();
	else
		this.mute();
}

MuteButton.prototype.mute = function(){
  	this.entity.game.sound.mute = true;
	this.playerSave.setValue("mute",true); 
	this.playerSave.writeSave();
  	this.entity.setFrames(0,0,0,0);
}

MuteButton.prototype.unmute = function(){
 	this.entity.game.sound.mute = false;
	this.playerSave.setValue("mute",false);
	this.playerSave.writeSave();
  	this.entity.setFrames(1,1,1,1);
}