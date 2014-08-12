"use strict";

//>>LREditor.Behaviour.name: InputTactile
//>>LREditor.Behaviour.params : {"leftName":"left_button" , "rightName":"right_button","player":null}
var InputTactile = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
	this.mobile = ! this.entity.game.device.desktop;
	
	if (this.mobile){
		this.entity.game.inputManager.bindMousePress(this.onMousePress,this);
		this.entity.game.inputManager.bindMouseRelease(this.onMouseRelease,this);
	}
};

InputTactile.prototype = Object.create(LR.Behaviour.prototype);
InputTactile.prototype.constructor = InputTactile;

InputTactile.prototype.create = function(_data) {
	if(! this.mobile)
		return;
	if( _data.player) this.player = _data.player.getBehaviour(Player);

	var button = LR.GameObject.FindByName(this.entity, _data.leftName);
	//LEFT BUTTON
	if( button ){
		button.visible = true;
		this.leftButton = button.go.getBehaviour(DirectionButton);
		this.leftButton.player = this.player;
		this.entity.game.inputManager.registerButton(this.leftButton.entity);
	}
	//RIGHT BUTTON
	button = LR.GameObject.FindByName(this.entity, _data.rightName);
	if( button ){
		button.visible = true;
		this.rightButton = button.go.getBehaviour(DirectionButton);
		this.rightButton.player = this.player;
		this.entity.game.inputManager.registerButton(this.rightButton.entity);
	}
};

InputTactile.prototype.onMousePress = function(){
	if(this.player)
		this.player.onJump();
}

InputTactile.prototype.onMouseRelease = function(){
	if(this.player)
		this.player.onJumpRelease();
}