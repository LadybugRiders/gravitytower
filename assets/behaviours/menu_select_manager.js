"use strict";

//>>LREditor.Behaviour.name: MenuSelectManager
//>>LREditor.Behaviour.params : {"levelsGroup":null}
var MenuSelectManager = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
  this.levelsGroup = {};
  this.playerSave = this.entity.game.playerSave;
  this.checkGameData();

  this.buttons = new Array();

};

MenuSelectManager.prototype = Object.create(LR.Behaviour.prototype);
MenuSelectManager.prototype.constructor = MenuSelectManager;

MenuSelectManager.prototype.create = function(_data) {
  this.checkMusic();
  //Get graphics
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

  //data
  this.fillKimisSaved();
  this.checkLevelData();
}

MenuSelectManager.prototype.checkMusic = function(){
  var currentSounds = this.entity.game.sound._sounds;
  var mySoundKey = this.go.getSound("music").key;
  var soundPlaying = false;
  for(var i=0; i < currentSounds.length; i++){
    var snd = currentSounds[i];
    if( snd.key == mySoundKey && snd.isPlaying == true){
      soundPlaying = true;
      break;
    }
  }
  if( ! soundPlaying ){    
      this.entity.game.sound.stopAll();
      this.go.playSound("music");
  }
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
  if( save.health == null ) this.playerSave.setValue("health",1);

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
    var levelID = this.playerSave.getValue("currentLevelID");
    if(levelID >= 0 ){
      var formerKimis = this.playerSave.getPermanentSave().levels[levelID].kimis;
      var collectedKimis = levelSave["kimis"];
      //kimis
      var kimisCollected = collectedKimis.length - formerKimis.length;
      this.applyKimisCollected(kimisCollected,levelID,true);
      this.playerSave.setValue("kimis",this.playerSave.getValue("kimis")+kimisCollected);
      this.kimisText.text = this.playerSave.getValue("kimis");
      //finish level
      this.playerSave.setValue("currentLevelID",-1);
      this.playerSave.setValue("finished",false);
      levelSave.finished = true;
      this.activateFinishedLevel(levelID+1);
      this.fillKimisSaved();
    }
    //save all
    this.entity.game.playerSave.writeSave();
  }
}

/*
Fill kimis slot per level. This is to be called when we just finished a level
_kimisCount : the number of kimis collected
_index : the index of the level
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

  //get from permanent save kimis that have been collected BEFORE playing this level
  var startIndex = this.playerSave.getPermanentSave().levels[this.playerSave.getValue("currentLevelID")].kimis.length;
 
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

    if(levelData && levelData.finished == true){
      var levelGroup = this.levelButtons[i].entity.parent;
      var btn = this.getButton(this.levelButtons[i].levelID);
      if( btn ){
        btn.fillSlots(levelData.kimis.length);
      }
    }
  }
}

MenuSelectManager.prototype.activateFinishedLevel = function(_levelID) {
  var btn = this.getButton(_levelID);
  if( btn )
    btn.activate();
}

MenuSelectManager.prototype.getButton = function(_levelID){
   for(var i=0; i < this.levelButtons.length; i++){
    var btn = this.levelButtons[i];
    if( btn.levelID == _levelID){
      return btn;
    }
  }
}
