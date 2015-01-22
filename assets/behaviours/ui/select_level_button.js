"use strict";

//>>LREditor.Behaviour.name: SelectLevelButton
//>>LREditor.Behaviour.params : {"level":"level1","levelID":1,"previousLevelID":null}
var SelectLevelButton = function(_gameobject) {
	LR.Behaviour.Button.call(this, _gameobject);
	this.level = "";
	this.levelID = 0;
	this.slots = new Array();
	this.chainingActive = true;
	this.playable = true;

	this.star = null;
	this.number = null;
};

SelectLevelButton.prototype = Object.create(LR.Behaviour.Button.prototype);
SelectLevelButton.prototype.constructor = SelectLevelButton;

SelectLevelButton.prototype.create = function(_data) {
	this.activeTint = this.entity.tint;

	if( _data.level ) this.level = _data.level;
	if( _data.levelID ) this.levelID = _data.levelID;
	if( _data.star ) this.star = _data.star;
	if( _data.number ) this.number = _data.number;

	if(this.star) this.star.entity.visible = false;

	var slot = null;
	for(var i=0; i < 3 ; i++){
		slot = LR.Entity.FindByName(this.entity.parent,"slot"+i);
		
		if( slot )
			this.slots.push(slot);
	}

	//disable levels that are not yet playable
	if(this.chainingActive == true && _data.previousLevelID != -1){
		var playerSave = this.entity.game.playerSave.getSave();
		//console.log(playerSave);
		//if the current level is completed, do nothing
		var levelSave = playerSave.levels[this.currentLevelID]; 
		if( levelSave && levelSave.completed == true )
			return;

		this.deactivate();

		//if a previous levelID is given
		if(_data.previousLevelID != null ){
			//Search the previous level data
			var prevLvlData = playerSave.getLevelSave(_data.previousLevelID);
			if(playerSave.levels[key].finished == true){
				this.activate();
			}
		}else{			
			//console.log(playerSave);
			for( var key in playerSave.levels){
				if( parseInt(key) == (this.levelID -1)){
					if(playerSave.levels[key].finished == true){
						this.activate();
					}
					break;
				}
			}
		}
	}
}

SelectLevelButton.prototype.activate = function(){
	this.playable = true;
	this.entity.tint = this.activeTint;
	if(this.number) this.number.entity.tint = 0xffffff;
}

SelectLevelButton.prototype.deactivate = function(){
	this.playable = false;
	this.entity.tint = 0xffffff;
	if(this.number) this.number.entity.tint = 0xD1D1D1;
}

SelectLevelButton.prototype.fillSlots = function(_count) {
	if(_count > 3) _count=3;
	for(var i=0; i < _count ; i++){
		this.slots[i].frame = 0;
	}
	if(this.star) this.star.entity.visible = true;
}

SelectLevelButton.prototype.onInputDown = function() {
	if(!this.playable)
		return;
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
	levelSave.completed = false;

	//reset level save for temporary data
	levelSave.coins = 0;
	levelSave.coinsIDs = [];
	//checkpoint data
	levelSave.checkpoint = { active : false,
							kimis: JSON.parse(JSON.stringify(levelSave.kimis)), 
							coinsIDs : []
						};

	//Write data
	playerSave.writeSave();

	//start level
	this.entity.game.state.start("Level",true,false,
								{levelName: this.level}
		);
};