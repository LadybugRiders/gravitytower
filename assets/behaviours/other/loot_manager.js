"use strict";

//>>LREditor.Behaviour.name: LootManager
//>>LREditor.Behaviour.params : {}
var LootManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.entity.game.pollinator.on("onEnemyDied",this.pop,this);
}

LootManager.prototype = Object.create(LR.Behaviour);
LootManager.prototype.constructor = LootManager;

LootManager.prototype.create = function(_data){
	this.entity.x =0; this.entity.y = 0;
	for(var i=0; i < this.entity.children.length ; i++){
		if(this.entity.children[i].kill)
			this.entity.children[i].kill();
	}
}

LootManager.prototype.onDestroy = function(){
	this.entity.game.pollinator.off("onEnemyDied",this.pop,this);
}

LootManager.prototype.pop = function(_data){
	if( _data.sender ){
		var loot = null;
		//try getting a random loot
		var r = Math.round( Math.random() * this.entity.children.length );
		loot = this.entity.children[r];
		//if it fails, get the first loot available
		if( loot == null || loot.alive == true )
			loot = this.entity.getFirstDead();
		//put the loot at the sender's position
		if( loot != null ){
			var bh = loot.go.getBehaviour(Collectable);
			if( bh )
				bh.respawnable = true;
			loot.revive();
			loot.body.x = _data.sender.world.x;
			loot.body.y = _data.sender.world.y;
		}
	}
}