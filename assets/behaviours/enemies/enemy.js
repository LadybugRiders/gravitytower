"use strict";
//>>LREditor.Behaviour.name: Enemy
//>>LREditor.Behaviour.params : { "direction": 1, "jumpable" : true, "cutable" : true, "hatable":true, "dead":false}
var Enemy = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
	this.entity.body.setCircle(23,-1,-1);
	this.onGround = false;
	this.jumpPower = 200;
	this.gravity = 1;
	this.speed = 100;
  //weaknesses
  this.jumpable = true;
  this.cutable = true;
  this.hatable = true;

  this.dead = true;
}

Enemy.prototype = Object.create(LR.Behaviour.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function( _data ){
	if(_data.direction) this.direction = _data.direction;
  if( _data.jumpable ) this.jumpable = _data.jumpable;
  if( _data.cutable ) this.cutable = _data.cutable;
  if( _data.hatable ) this.hatable = _data.hatable;
  if(_data.dead == true ) this.entity.kill();
}

Enemy.prototype.pop = function( _data){
  this.entity.revive();
  if( _data.gravity != null ) this.go.gravity = _data.gravity;
}

Enemy.prototype.onGravityChanged = function(_data){
	this.gravity = _data.gravity;
}

Enemy.prototype.jump = function(_force, _jumpPower){
  if( this.onGround || _force == true){
    this.changeState("jump");
    this.onGround = false;
    //apply jump force
    if( _jumpPower != null)
      this.go.body.velocity.y = -_jumpPower * this.gravity;
    else
      this.go.body.velocity.y = -this.jumpPower * this.gravity;
    this.entity.animations.play('jump');
    this.scaleByGravity();
  }
}

Enemy.prototype.run = function(_direction, _speed ){
  this.changeState("run");
  if( _direction != null ) this.direction = _direction;
  if( _speed == null ) _speed = this.speed;
  
  //flip and play anim
  this.entity.animations.play('run');
  this.scaleByGravity();

  this.entity.body.velocity.x = this.direction * _speed ;
}


Enemy.prototype.die = function(_direction, _speed ){
  this.dead = true;
  this.entity.kill();
}

//=================================================================
//						CONTACTS
//=================================================================

//This method is automatically called when the body of the player collides with another cody
Enemy.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
  //if the collision is from the feet shape
  if( _otherBody.go.layer == "ground" ){
  	this.onGround = true;
  }

  if( this.dead == false &&  _otherBody.go.layer == "player"){
    var playerHair = _otherBody.go.getBehaviour(PlayerHair);
    console.log(playerHair);
    //hit by a blade
    if( playerHair && playerHair.isShapeAndStatusBlade(_otherShape)){
      this.onHitHBlade(playerHair.x > this.entity.x ? -1 : 1);
    }
    //if hit by a hat
    if( playerHair && playerHair.isShapeAndStatusHat(_otherShape)){
      this.onHitHat();
    }
  }
}

Enemy.prototype.onEndContact = function(_otherBody, _myShape, _otherShape, _equation){
  if( _otherBody.go.layer == "ground" ){
    this.onGround = false;
  }
}

//=================================================================
//                  WEAKNESSES
//=================================================================
Enemy.prototype.onHitJump = function(){
  if(this.jumpable)
    this.die();
}

Enemy.prototype.onHitBlade = function( _direction ){
  if(this.bladable)
    this.die();
}

Enemy.prototype.onHitHat = function(){
  if(this.hatable)
    this.die();
}

//=================================================================
//						UTILS
//=================================================================

Enemy.prototype.scaleByGravity = function(){
  this.entity.scale.x = this.direction  * this.gravity;
}

Enemy.prototype.changeState = function(_newState){
  this.lastState = this.state;
  this.state = _newState;
}