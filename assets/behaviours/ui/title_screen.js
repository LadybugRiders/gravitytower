"use strict";

//>>LREditor.Behaviour.name: TitleScreen
//>>LREditor.Behaviour.params : {"title_text":null}
var TitleScreen = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
	this.mobile = ! this.entity.game.device.desktop;
	
	this.entity.game.inputManager.bindMousePress(this.onMousePress,this);
	this.entity.game.inputManager.bindMouseRelease(this.onMouseRelease,this);
};

TitleScreen.prototype = Object.create(LR.Behaviour.prototype);
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.create = function(_data){
	if(_data.title_text) this.title_text = _data.title_text;
	if(this.mobile)
		this.title_text.entity.text = "Tap to begin";
	else
		this.title_text.entity.text = "Click to begin";

}

TitleScreen.prototype.update = function(){
}

TitleScreen.prototype.onMousePress = function(){
	this.entity.game.state.start("Level",true,false,{levelName: "menu_select_levels"});
}
