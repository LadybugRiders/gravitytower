"use strict";

//>>LREditor.Behaviour.name: TutoCloseButton
//>>LREditor.Behaviour.params : {"tutoManager":null}
var TutoCloseButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
};

TutoCloseButton.prototype = Object.create(LR.Behaviour.Button.prototype);
TutoCloseButton.prototype.constructor = TutoCloseButton;

TutoCloseButton.prototype.create = function(_data) {
	if(_data.tutoManager) this.tutoManager = _data.tutoManager;
}

TutoCloseButton.prototype.onInputDown = function() {
	if( this.tutoManager )
		this.tutoManager.sendMessage("closeTuto");
};