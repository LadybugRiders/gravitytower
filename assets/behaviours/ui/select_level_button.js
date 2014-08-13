"use strict";

//>>LREditor.Behaviour.name: SelectLevelButton
//>>LREditor.Behaviour.params : {"level":"level1"}
var SelectLevelButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
	this.level = "";
};

SelectLevelButton.prototype = Object.create(LR.Behaviour.Button.prototype);
SelectLevelButton.prototype.constructor = SelectLevelButton;

SelectLevelButton.prototype.create = function(_data) {
	if( _data.level ) this.level = _data.level;
}

SelectLevelButton.prototype.onInputDown = function() {
	this.entity.game.state.start("Level",true,false,
								{levelName: this.level}
		);
};