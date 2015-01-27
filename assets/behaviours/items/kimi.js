"use strict";
//>>LREditor.Behaviour.name: Kimi
//>>LREditor.Behaviour.params : { "id" : 1 }
var Kimi = function(_gameobject) {	
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.kimi_id = 0;

	this.cosTemp = LR.Utils.toRadians(90);
}

Kimi.prototype = Object.create(LR.Behaviour.Trigger.prototype);
Kimi.prototype.constructor = Kimi;

Kimi.prototype.create = function( _data ){
	if( _data.id ) this.kimi_id = _data.id;
	var levelSave = this.entity.game.playerSave.getActiveLevelSave();
	if( levelSave && levelSave.kimis ){
		//console.log(levelSave);
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
	if( _gameobject.layer == "player" && !this.collected){
		this.collected = true;
		this.playerGO = _gameobject;
		this.go.getShape().sensor = true;
		this.go.gravity = 0;
		this.game.playerSave.getActiveLevelSave().kimis.push(this.kimi_id);
		this.go.playSound("collect",0.3);
	}
}

Kimi.prototype.update = function(_gameobject){
	if(this.collected){
		this.entity.angle -= this.entity.game.time.elapsed *0.35;
		if( !this.goToPlayer){
			this.cosTemp -= 0.0025 * this.entity.game.time.elapsed;
			var cos = Math.cos(this.cosTemp);
			this.go.y = this.playerGO.y - cos * 50;
			if(this.lastCos != null && this.lastCos > cos)
				this.goToPlayer = true;
			this.lastCos = cos;
		}else{
			var vector = Phaser.Point.subtract(this.playerGO.entity.world,this.entity.world);
			var speedVector = new Phaser.Point(vector.x, vector.y).normalize();
			var accelerator = 4 + vector.getMagnitude() *0.02;
			speedVector.x *= accelerator;
			speedVector.y *= accelerator;
			this.go.x += speedVector.x ;
			this.go.y += speedVector.y ;
			if(vector.getMagnitude() <= speedVector.getMagnitude() ){
				this.entity.kill();
			}
		}
		
	}
}
