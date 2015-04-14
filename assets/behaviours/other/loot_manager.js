"use strict";

//>>LREditor.Behaviour.name: LootManager
//>>LREditor.Behaviour.params : {}
var LootManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.entity.game.pollinator.on("onEnemyDied",this.pop,this);
	this.lootsScripts = new Array();
}

LootManager.prototype = Object.create(LR.Behaviour);
LootManager.prototype.constructor = LootManager;

LootManager.prototype.create = function(_data){
	this.entity.x =0; this.entity.y = 0;
	for(var i=0; i < this.entity.children.length ; i++){
		var child = this.entity.children[i];
		var lootS = child.go.getBehaviour(Collectable);
		this.lootsScripts.push(lootS);
		lootS.kill();
	}
}

LootManager.prototype.onDestroy = function(){
	this.entity.game.pollinator.off("onEnemyDied",this.pop,this);
}

LootManager.prototype.getDeadLoot = function(){
	var loot = null;
	for(var i=0; i < this.lootsScripts.length ; i++){
		var loot = this.lootsScripts[i];
		if( loot.dead ){
			return loot;
		}
	}
	return null;
}

LootManager.prototype.pop = function(_data){
	if( _data.sender ){
		var loot = null;
		//try getting a random loot
		var r = Math.round( Math.random() * (this.lootsScripts.length-1) );
		loot = this.lootsScripts[r];
		console.log(loot);
		//if it fails, get the first loot available
		if( loot == null || loot.dead == false )
			loot = this.getDeadLoot();
		//put the loot at the sender's position
		if( loot != null ){
			loot.respawnable = true;
			//respawn
			loot.revive(_data.sender.world.x,_data.sender.world.y);
		}
	}
}