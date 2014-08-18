"use strict";

//>>LREditor.Behaviour.name: Acolyte
var Acolyte = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.health = 1;
	this.dead = false;

	this.sinAngle = 0;
	this.offsetY = -30;
	this.offsetX = -20;
	this.rangeY = 10;
}

Acolyte.prototype = Object.create(LR.Behaviour.prototype);
Acolyte.prototype.constructor = Acolyte;

Acolyte.prototype.update = function(){
	if( this.dead )
		return;
	this.sinAngle += this.entity.game.time.elapsed * 0.001;
	if(this.sinAngle >= 360)
		this.sinAngle = 0;
	var y = Math.sin(this.sinAngle);
	this.entity.y = this.player.entity.y + this.player.gravity * (this.offsetY + this.rangeY * y);
	this.entity.x = this.player.entity.x + this.offsetX * this.player.direction;
}

Acolyte.prototype.gainHealth = function(){
	if( this.health >= 3)
		return;
	if(this.health == 0)
		this.zing();
	this.health ++;
	this.changeForm();
}

Acolyte.prototype.loseHealth = function(){
	if(this.dead)
		return;
	this.health --;
	if(this.health <= 0){
		this.die();
	}else{
		this.changeForm();
	}
}

Acolyte.prototype.zing = function(){
	this.entity.revive();
	this.dead = false;
}

Acolyte.prototype.die = function(){
	this.entity.kill();
	this.dead = true;
	this.health =0;
}

Acolyte.prototype.changeForm = function(){
	this.entity.frame = this.health -1;
	var tween = this.entity.game.add.tween(this.entity.scale);
	tween.to( {x:1.2,y:1.2},100,null,true,0,1,true);
}