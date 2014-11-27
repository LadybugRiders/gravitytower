"use strict";

//>>LREditor.Behaviour.name: MenuSelectManager
//>>LREditor.Behaviour.params : {"levelsGroup":null}
var MenuSelectManager = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
  this.levelsGroup = {};
  this.playerSave = this.entity.game.playerSave;
  this.checkGameData();
};

MenuSelectManager.prototype = Object.create(LR.Behaviour.prototype);
MenuSelectManager.prototype.constructor = MenuSelectManager;

MenuSelectManager.prototype.create = function(_data) {
  if(_data.levelsGroup) this.levelsGroup = _data.levelsGroup;
  if(_data.livesText) _data.livesText.entity.text = this.playerSave.getValue("lives");
  if(_data.coinsText) _data.coinsText.entity.text = this.playerSave.getValue("coins");
}

/*
Creates the game data at first launch
*/
MenuSelectManager.prototype.checkGameData = function(_data) {
  var save = this.playerSave.getSave();

  var isNew = (save.kimis == null);

  if( save.lives == null ) this.playerSave.setValue("lives",3);
  if( save.coins == null ) this.playerSave.setValue("coins",0);
  if( save.curLevelCoins == null ) this.playerSave.setValue("curLevelCoins",0);
  if( save.fromLevel == null ) this.playerSave.setValue("fromLevel",-1);
  if( save.kimis == null ) this.playerSave.setValue("kimis",0);

  console.log(save);

  if(isNew){
    this.entity.game.playerSave.writeSave();
  }
}