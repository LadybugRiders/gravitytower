"use strict";

//>>LREditor.Behaviour.name: DirectionButton
//>>LREditor.Behaviour.params : {"direction":"left"}
var DirectionButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
};

DirectionButton.prototype = Object.create(LR.Behaviour.Button.prototype);
DirectionButton.prototype.constructor = DirectionButton;

DirectionButton.prototype.create = function(_data) {
	if( _data.direction ) this.direction = _data.direction == "left" ? -1 : 1;
}

DirectionButton.prototype.onInputDown = function() {
	if( this.player ){
		if( this.direction < 0)
			this.player.onMoveLeft();
		else
			this.player.onMoveRight();
	}
};

DirectionButton.prototype.onInputUp = function() {
	if( this.player ){
		this.player.onMoveRelease();
	}
};