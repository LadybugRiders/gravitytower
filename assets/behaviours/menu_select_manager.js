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
  if(_data.levelsGroup){
    this.levelsGroup = _data.levelsGroup;
    this.levelButtons = this.levelsGroup.getBehavioursInChildren(SelectLevelButton);
  }
  if(_data.livesText){
    this.livesText = _data.livesText.entity;
    this.livesText.text = this.playerSave.getValue("lives");
  }
  if(_data.coinsText){
    this.coinsText = _data.coinsText.entity;
    this.coinsText.text = this.playerSave.getValue("coins");
  } 

  if(_data.kimisText){
    this.kimisText = _data.kimisText.entity;
    this.kimisText.text = this.playerSave.getValue("kimis");
  } 

  this.fillKimisSaved();
  this.checkLevelData();
}

/*
Creates the game data at first launch
*/
MenuSelectManager.prototype.checkGameData = function() {
  var save = this.playerSave.getSave();

  var isNew = (save.kimis == null);

  if( save.lives == null ) this.playerSave.setValue("lives",3);
  if( save.coins == null ) this.playerSave.setValue("coins",0);
  if( save.currentLevelID == null ) this.playerSave.setValue("currentLevelID",-1);
  if( save.kimis == null ) this.playerSave.setValue("kimis",0);

  if(isNew){
    this.entity.game.playerSave.writeSave();
  }
}

/*
Check if we just arrive from a level and assign/write data save accordingly
*/
MenuSelectManager.prototype.checkLevelData = function(_data) {
  if( this.playerSave.getValue("finished") == true ){
    var levelSave = this.playerSave.getActiveLevelSave();
    
    if( levelSave == null )
      return;
    //Add coins to the total
    var coins = levelSave["coins"];
    coins += this.playerSave.getValue("coins");
    this.playerSave.setValue("coins",coins);
    this.coinsText.text = ""+coins;

    //Kimis
    //get kimis before playing level
    var formerKimis = this.playerSave.getPermanentSave().levels[this.playerSave.getValue("currentLevelID")].kimis;
    var collectedKimis = levelSave["kimis"];

    var kimisCollected = collectedKimis.length - formerKimis.length;
    this.applyKimisCollected(kimisCollected,this.playerSave.getValue("currentLevelID"),true);
    this.playerSave.setValue("kimis",this.playerSave.getValue("kimis")+kimisCollected);
    this.kimisText.text = this.playerSave.getValue("kimis");
    //finish level
    this.playerSave.setValue("currentLevelID",-1);
    this.playerSave.setValue("finished",false);
    levelSave.finished = true;
    //save all
    this.entity.game.playerSave.writeSave();
  }
}

/*
Fill kimis slot per level
*/
MenuSelectManager.prototype.applyKimisCollected = function(_kimisCount,_index) {
  var levelGroup = null;
  //Search the entity representing the level
  for(var i=0; i < this.levelButtons.length; i++){
    if(this.levelButtons[i].levelID == _index){
      levelGroup = this.levelButtons[i].entity.parent;
      break;
    }
  }
  var startIndex = this.playerSave.getPermanentSave().levels[this.playerSave.getValue("currentLevelID")].kimis.length;
  // the _add parameters tells us we are coming from a played level, in which case some kimis 
  // may already have been sloted

  //search slots and change their frame to make a gold kimis appear
  for(var i=0; i < _kimisCount; i++){
      var slot = LR.GameObject.FindByName(levelGroup,"slot"+(startIndex+i+1));
      if( slot ){
        slot.frame = 0;
      }
  }
}

MenuSelectManager.prototype.fillKimisSaved = function() {

  //For every graphic level
  for(var i=0; i < this.levelButtons.length; i++){
    var levelData = this.playerSave.getLevelSave(this.levelButtons[i].levelID);
    if(levelData){
      var levelGroup = this.levelButtons[i].entity.parent;
      //fill slots according to the number of kimis resued by level 
      for(var k=0; k < levelData.kimis.length; k++){
        var slot = LR.GameObject.FindByName(levelGroup,"slot"+(k+1));
        if( slot ){
          slot.frame = 0;
        }
      }
    }
  }
}