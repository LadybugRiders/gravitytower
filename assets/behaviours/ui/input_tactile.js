"use strict";

//>>LREditor.Behaviour.name: InputTactile
//>>LREditor.Behaviour.params : {"leftName":"left_button" , "rightName":"right_button","player":null}
var InputTactile = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
};

InputTactile.prototype = Object.create(LR.Behaviour.prototype);
InputTactile.prototype.constructor = InputTactile;

InputTactile.prototype.create = function(_data) {
	if( _data.player) this.player = _data.player.getBehaviour(Player);

	var button = LR.GameObject.FindByName(this.entity, _data.leftName);
	//LEFT BUTTON
	if( button ){
		this.leftButton = button.go.getBehaviour(DirectionButton);
		this.leftButton.player = this.player;
	}
	//RIGHT BUTTON
	button = LR.GameObject.FindByName(this.entity, _data.rightName);
	if( button ){
		this.rightButton = button.go.getBehaviour(DirectionButton);
		this.rightButton.player = this.player;
	}
};