"use strict";

//>>LREditor.Behaviour.name: SelectLevelButton
//>>LREditor.Behaviour.params : {"level":"level1"}
var SelectLevelButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
	this.level = "";
	this.slots = new Array();
};

SelectLevelButton.prototype = Object.create(LR.Behaviour.Button.prototype);
SelectLevelButton.prototype.constructor = SelectLevelButton;

SelectLevelButton.prototype.create = function(_data) {
	if( _data.level ) this.level = _data.level;
	var slot = null;
	for(var i=0; i < 3 ; i++){
		slot = LR.GameObject.FindByName(this.entity.parent,"slot"+i);
		
		if( slot )
			this.slots.push(slot);
	}
}

SelectLevelButton.prototype.fillSlots = function(_count) {
	if(_count > 3) _count=3;
	for(var i=0; i < _count ; i++){
		this.slots[i].frame = 0;
	}
}

SelectLevelButton.prototype.onInputDown = function() {
	this.entity.game.state.start("Level",true,false,
								{levelName: this.level}
		);
};