"use strict";

//>>LREditor.Behaviour.name: HangerStill
//>>LREditor.Behaviour.params : {"hookX" : 0, "hookY" : 0, "direction":1}
var HangerStill = function(_gameobject){
	Hanger.call(this,_gameobject);
	this.direction = 1;
	this.hookPosition = new Phaser.Point();
}

HangerStill.prototype = Object.create(Hanger.prototype);
HangerStill.prototype.constructor = HangerStill;

HangerStill.prototype.create = function(_data){
	Hanger.prototype.create.call(this,_data);
	if( _data.direction != null ) this.direction = _data.direction;
}

HangerStill.prototype.update = function(){
	if(this.player && this.released == false){
		var vec = this.deltaVector.normalize();
		this.player.go.x = this.hookPosition.x - vec.x * this.distanceToHook;
	  	this.player.go.y = this.hookPosition.y - vec.y * this.distanceToHook;
	  	this.distanceToHook -= 20 * this.entity.game.time.elapsed * 0.01;
	  	if( this.distanceToHook <= 0)
	  		this.distanceToHook = 0;
	}
}

HangerStill.prototype.hang = function(){
	Hanger.prototype.hang.call(this);
	this.hookPosition.x = this.entity.world.x + this.hookX;
	this.hookPosition.y = this.entity.world.y + this.hookY ;
	this.deltaVector = Phaser.Point.subtract(this.hookPosition,this.player.entity.position);
	this.distanceToHook = this.deltaVector.getMagnitude();
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