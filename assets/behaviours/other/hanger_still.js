"use strict";

//>>LREditor.Behaviour.name: HangerStill
//>>LREditor.Behaviour.params : {"hookX" : 0, "hookY" : 0, "direction":1}
var HangerStill = function(_gameobject){
	Hanger.call(this,_gameobject);
	this.direction = 1;
}

HangerStill.prototype = Object.create(Hanger.prototype);
HangerStill.prototype.constructor = HangerStill;

HangerStill.prototype.create = function(_data){
	Hanger.prototype.create.call(this,_data);
	if( _data.direction != null ) this.direction = _data.direction;
}

HangerStill.prototype.update = function(){
	if(this.player && this.released == false){
		this.player.go.x = this.entity.world.x + this.hookX ;
	  	this.player.go.y = this.entity.world.y + this.hookY ;
	}
}

HangerStill.prototype.release = function(){
	if( this.player ){
		//compute direction of the release
		var vector = new Phaser.Point();
		if( this.player.isMovePressed == 1 && this.player.direction == this.direction){
			vector.x = this.direction * 0.6;
		}
		vector.y = 0.8;
		//unhang the player
		this.player.onReleaseHang(this.formerGrav, vector);	
		this.player = null;
		this.playerHair = null;
		this.released = true;
	}
}