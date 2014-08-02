"use strict";

//>>LREditor.Behaviour.name: StartButton

var StartButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
};

StartButton.prototype = Object.create(LR.Behaviour.Button.prototype);
StartButton.prototype.constructor = StartButton;

StartButton.prototype.onClick = function() {
	// start level 1
  this.entity.game.state.start("Level", true, false, {levelName: "level1"});
};