"use strict";
//>>LREditor.Behaviour.name: Kimi
//>>LREditor.Behaviour.params : { "id" : 1 }
var Kimi = function(_gameobject) {	
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.kimi_id = 0;
}

Kimi.prototype = Object.create(LR.Behaviour.Trigger.prototype);
Kimi.prototype.constructor = Kimi;

Kimi.prototype.create = function( _data ){
	if( _data.id ) this.kimi_id = _data.id;
	var levelSave = this.entity.game.playerSave.getLevelSave();
	if( levelSave && levelSave.kimis ){
		this.kimisSave = levelSave.kimis;
		//search for id and kill if already taken
		for(var i=0; i < this.kimisSave.length ; i ++){
			if( this.kimisSave[i] == this.kimi_id ){
				this.entity.kill();
				break;
			}
		}
	}
}

Kimi.prototype.onTriggered = function(_gameobject){
	if( _gameobject.layer == "player"){
		this.entity.kill();
		if( this.kimisSave )
			this.kimisSave.push(this.id);
	}
}
