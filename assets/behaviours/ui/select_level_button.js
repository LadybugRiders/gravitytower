"use strict";

//>>LREditor.Behaviour.name: SelectLevelButton
//>>LREditor.Behaviour.params : {"level":"level1","levelID":1}
var SelectLevelButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
	this.level = "";
	this.levelID = 0;
	this.slots = new Array();
};

SelectLevelButton.prototype = Object.create(LR.Behaviour.Button.prototype);
SelectLevelButton.prototype.constructor = SelectLevelButton;

SelectLevelButton.prototype.create = function(_data) {
	if( _data.level ) this.level = _data.level;
	if( _data.levelID ) this.levelID = _data.levelID;
	var slot = null;
	for(var i=0; i < 3 ; i++){
		slot = LR.Entity.FindByName(this.entity.parent,"slot"+i);
		
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
	var playerSave = this.entity.game.playerSave;
	//store current levelID in the save
	playerSave.setValue("currentLevelID",this.levelID);
	//get or create level data
	var levelSave = playerSave.getLevelSave(this.levelID);
	if( levelSave == null)
		levelSave = playerSave.createLevelSave(this.levelID);
	//activate level save so that it will be accessible quickly after
	playerSave.activateLevelSave(this.levelID);
	//create data if none is created
	if( levelSave.kimis == null){
		levelSave.kimis = [];
	}

	//reset level save for temporary data
	levelSave.coins = 0;
	levelSave.coinsAtCheckpoint = 0;
	levelSave.collectedCoinsIDs = [];
	levelSave.collectedCoinsIDsAtCheckpoint = [];
	levelSave.kimisAtCheckpoint = levelSave.kimis;

	//Write data
	playerSave.writeSave();

	//start level
	this.entity.game.state.start("Level",true,false,
								{levelName: this.level}
		);
};