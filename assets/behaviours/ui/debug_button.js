"use strict";

//>>LREditor.Behaviour.name: DebugButton
//>>LREditor.Behaviour.params : {"debug":"deleteSave"}
var DebugButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
};

DebugButton.prototype = Object.create(LR.Behaviour.Button.prototype);
DebugButton.prototype.constructor = DebugButton;

DebugButton.prototype.create = function(_data) {
	if( _data.debug) this.debugType = _data.debug;
}

DebugButton.prototype.onInputDown = function() {
	switch(this.debugType){
		case "deleteSave" : 
				console.log("qsj");
				this.entity.game.playerSave.deleteSave();
				this.entity.game.state.start("Level",true,false,{levelName: "menu_select_levels"});
			break;
	}
};