"use strict";

//>>LREditor.Behaviour.name: PlayerHair
var PlayerHair = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.player = null;
	this.state = "idle";
	this.upgraded = false;	

	this.hookShape = this.go.getShapeByName("hook");
	this.bladeRShape = this.go.getShapeByName("blade_right");
	this.bladeLShape = this.go.getShapeByName("blade_left");
	this.hatShape = this.go.getShapeByName("hat");
}

PlayerHair.prototype = Object.create(LR.Behaviour.prototype);
PlayerHair.prototype.constructor = PlayerHair;

PlayerHair.prototype.create = function(_data){
	this.effect = LR.Entity.FindByName(this.entity.parent, _data.effect);
	this.effect.animations.getAnimation("blow").onComplete.add(this.onBlowComplete,this);
	this.effect.animations.getAnimation("retract").onComplete.add(this.onRetractComplete,this);
	this.effect.visible = false;
}

PlayerHair.prototype.postUpdate = function(){
	if( this.effect.visible == true){
		this.effect.x = this.entity.x; 
		this.effect.y = this.entity.y;
	}
}

PlayerHair.prototype.followPlayer = function(){

  this.go.x = this.player.go.x;
  this.go.y = this.player.go.y;

  this.entity.scale.x = this.player.entity.scale.x;
  this.entity.angle = this.player.entity.angle;
}

PlayerHair.prototype.activatePower = function(_power){
	if( _power == this.state )
		return;
	this.state = _power;
	this.changeForm();
}

PlayerHair.prototype.deactivatePower = function(){
	this.upgraded = false;
	this.idle();
}

PlayerHair.prototype.idle = function(){
	if( this.upgraded )
		return;
	this.entity.animations.play('idle');
	this.state = "idle";
}

PlayerHair.prototype.run = function(){
	if( this.upgraded )
		return;
	this.entity.animations.play('run');
	this.state = "run";
}

//=====================================================
//				ANIMATIONS
//=====================================================

PlayerHair.prototype.changeForm = function(){
	this.upgraded = true;
	this.effect.visible = true;
	this.effect.x = this.entity.x; this.effect.y = this.entity.y;
	this.effect.animations.play("blow");
}

PlayerHair.prototype.onBlowComplete = function(){
	this.entity.animations.play(this.state);
	this.effect.animations.play("retract");
}

PlayerHair.prototype.onRetractComplete = function(){
	this.effect.visible = false;
}

//=====================================================
//				GETTERS
//=====================================================

PlayerHair.prototype.isShapeAndStatusHook = function(_myShape){
	if( ! this.isHook )
		return false;
	if( _myShape !== this.hookShape)
		return;
	return true;
}

PlayerHair.prototype.isShapeAndStatusBlade = function(_myShape){
	if( ! this.isBlade )
		return false;
	if( (_myShape !== this.blade_right && this.player.direction > 0 )
		|| ( _myShape !== this.blade_left && this.player.direction < 0) )
		return;
	return true;
}

PlayerHair.prototype.isShapeAndStatusHat = function(_myShape){
	if( ! this.isHat )
		return false;
	if( _myShape !== this.hatShape)
		return;
	return true;
}

Object.defineProperty( PlayerHair.prototype, "isHook",
  {
    get : function(){
      return this.state == "hook";
    }
  }
);

Object.defineProperty( PlayerHair.prototype, "isBlade",
  {
    get : function(){
      return this.state == "blade";
    }
  }
);

Object.defineProperty( PlayerHair.prototype, "isHat",
  {
    get : function(){
      return this.state == "hat";
    }
  }
);