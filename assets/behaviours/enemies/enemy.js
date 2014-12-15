"use strict";
//>>LREditor.Behaviour.name: Enemy
//>>LREditor.Behaviour.params : { "direction": 1, "gravity":1, "jumpable" : true, "cutable" : true, "hatable":true, "dead":false, "smoke":null}
var Enemy = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
	this.onGround = false;
	this.jumpPower = 200;
	this.gravity = 1;
  this.direction = 1;
	this.speed = 100;
  //weaknesses
  this.jumpable = true;
  this.cutable = true;
  this.hatable = true;
  //speed
  this.baseSpeed = 10;
  this.speed = this.baseSpeed;
  this.currentSpeed = 0;
  this.maxSpeed = 100;
  this.runAcc = 7;
  //vars
  this.canMove = true;
  this.facingWall = 0;

  this.range = 100;

  this.dead = false;

  this.state = "idle";
  this.lastState = "idle";
}

Enemy.prototype = Object.create(LR.Behaviour.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.start = function(){  
  this.initX = this.entity.x;
  this.initY = this.entity.y;
}

Enemy.prototype.create = function( _data ){
	if(_data.direction) this.direction = _data.direction;
  if( _data.jumpable ) this.jumpable = _data.jumpable;
  if( _data.cutable ) this.cutable = _data.cutable;
  if( _data.hatable ) this.hatable = _data.hatable;
  if( _data.gravity){
    this.gravity = _data.gravity;
    this.go.gravity = this.gravity;
  }
  if( _data.smoke ){
   this.smoke = _data.smoke;
   this.smoke.entity.visible = false;
  }
  if(_data.dead == true ) this.entity.kill();

  this.scaleByGravity();
}


//=================================================
//        ACTIONS
//=================================================

Enemy.prototype.updateRun = function(){
  if( this.facingWall == this.direction || !this.canMove )
    return;
  this.currentSpeed += this.direction *  this.runAcc * this.entity.game.time.elapsed * 0.1;
  
  if( Math.abs( this.currentSpeed ) > this.maxSpeed)
    this.currentSpeed = this.direction * this.maxSpeed;

  this.entity.body.velocity.x = this.currentSpeed;
}

Enemy.prototype.updateMoveRange = function(){
  var rangeDone = this.initX - this.entity.x ;
  if(this.direction < 0 && rangeDone > this.range * 0.5){
    this.direction = 1;
    this.scaleByGravity();
    this.currentSpeed = 0;
  }
  if(this.direction > 0 && rangeDone < -this.range *0.5){
    this.direction = -1;
    this.scaleByGravity();
    this.currentSpeed = 0;
  }
}

Enemy.prototype.pop = function( _data){
  this.dead = false;
  this.entity.revive();
  if( !_data)
    return;
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
  if(this.smoke){
    this.smoke.entity.x = this.entity.x;
    this.smoke.entity.y = this.entity.y;
    this.smoke.entity.revive();
    this.smoke.entity.animations.play("blow").killOnComplete = true;
  }
}

//=================================================================
//						CONTACTS
//=================================================================

//This method is automatically called when the body of the player collides with another cody
Enemy.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
  //if the collision is from the feet shape
  if( _otherBody.go.layer == "ground" ){
  	this.onGround = true;
    this.onTouchGround();
  }

  if( this.dead == false &&  _otherBody.go.layer == "player"){
    var playerHair = _otherBody.go.getBehaviour(PlayerHair);
    //hit by a blade
    if( playerHair ){
      if(playerHair.isShapeAndStatusBlade(_otherShape)){
        console.log("HS");
        this.onHitBlade(playerHair.x > this.entity.x ? -1 : 1);
      }
      //if hit by a hat
      if( playerHair.isShapeAndStatusHat(_otherShape)){
        this.onHitHat();
      }
    }else{//else we hit the player
      this.hitPlayer(_otherBody.go,_otherShape,_equation);
    }    
  }
}

Enemy.prototype.onEndContact = function(_otherBody, _myShape, _otherShape, _equation){
  if( _otherBody.go.layer == "ground" ){
    this.onGround = false;
  }
}

Enemy.prototype.hitPlayer = function(_go, _playerShape, _equation){
  _go.sendMessage("hit", {"shape":_playerShape,"sender":this.go,"equation":_equation});
  this.onHitPlayer();
}

Enemy.prototype.onTouchGround = function(){
  
}

Enemy.prototype.onHitPlayer = function(){

}

//=================================================================
//                  WEAKNESSES
//=================================================================
Enemy.prototype.onHitJump = function(){
  if(this.jumpable){
    this.die();
  }else{
    this.hitPlayer(this.go);
  }
}

Enemy.prototype.onHitBlade = function( _direction ){
  if(this.cutable)
    this.die();
}

Enemy.prototype.onHitHat = function(){
  if(this.hatable && this.entity.body.velocity.y < -1){
    this.die();
  }
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