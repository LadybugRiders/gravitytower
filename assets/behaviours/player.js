"use strict";

//>>LREditor.Behaviour.name: Player

var Player = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);

  this.speed = 200;
  this.acc = 10;
  this.dead = false;
  this.jumpPower = 400;

	this.cursors = this.go.game.input.keyboard.createCursorKeys();

  //get the feet shape by its name
  this.feetSensor = this.go.getShapeByName("feet");

  //use the inputManager to be notified when the JUMP key is pressed
  this.go.game.inputManager.bindKeyPress("jump",this.jump,this);
  //press to move
  this.go.game.inputManager.bindKeyPress("left", this.moveLeft, this);
  this.go.game.inputManager.bindKeyPress("right", this.moveRight, this);
  //Stop on release
  this.go.game.inputManager.bindKeyRelease("left", this.idleize, this);
  this.go.game.inputManager.bindKeyRelease("right", this.idleize, this);

  //Make camera follow the player
  this.entity.game.camera.bounds = null;
  this.entity.game.camera.follow(this.entity,Phaser.Camera.FOLLOW_PLATFORMER);

  //State
  this.state = "idle";
  this.lastState = this.state;
};

Player.prototype = Object.create(LR.Behaviour.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if( this.dead == true )
    return;
  switch(this.state){
    case "run" : this.updateRun(); 
      break;
  }
}

//This method is automatically called when the body of the player collides with another cody
Player.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
  //if the collision is from the feet shape
  if( _myShape == this.feetSensor ){
    if( _otherBody.go.layer == "ground"){
      this.onGround = true;
    }else if(_otherBody.go.layer == "enemy"){
      _otherBody.go.sendMessage("kill");
      this.jump(true);
    }
  }else{
    if(_otherBody.go.layer == "enemy"){
      this.die();
    }
  }
}

//=========================================================
//                  UPDATES
//=========================================================

Player.prototype.updateRun = function(){
  this.entity.body.velocity.x = this.direction * this.speed;
}

//=========================================================
//                  KEY CALLBACKS
//=========================================================

Player.prototype.moveLeft = function(_key){
  this.run(-1);
}

Player.prototype.moveRight = function(_key){
  this.run(1);
}

Player.prototype.idleize = function(_key){
  this.idle();
}

//=========================================================
//                  ACTIONS
//=========================================================

Player.prototype.idle = function(_direction){
  this.changeState("idle");
  if( _direction != null ) this.direction = _direction;

  this.entity.body.velocity.x = 0;
  //flip and play anim
  this.go.entity.scale.x = this.direction;
  this.entity.animations.play('idle', 10, true);
}


Player.prototype.run = function(_direction, _speed ){
  this.changeState("run");
  if( _direction != null ) this.direction = _direction;
  
  //flip and play anim
  this.go.entity.scale.x = this.direction;
  this.entity.animations.play('run', 10, true);

  this.entity.body.velocity.x = this.direction * this.speed;
}


Player.prototype.jump = function(_force){
  if( this.onGround || _force == true){
    this.onGround = false;
    //apply jump force
    this.go.body.velocity.y = -this.jumpPower * this.entity.body.data.gravityScale;
    this.entity.animations.play('jump', 10, true);
  }
}

//=========================================================
//                  DEATH
//=========================================================

Player.prototype.die = function(){
  if(this.dead == true)
    return;
  this.dead = true;
  this.onGround = false;
  //Enable all shapes to be sensors
  this.go.enableSensor();
  //Disable contact events
  this.enableEvents = false;

  this.entity.animations.play('dead', 10, true);
  this.go.body.moveUp(300);
  this.entity.game.camera.follow(null);

  //set a timer
    this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 3, 
      function(){ this.entity.game.state.restart(true);},
      this);
}

Player.prototype.finish = function(){  
  this.entity.animations.play('win', 10, true);
  this.enabled = false;
  //set a timer
  this.entity.game.time.events.add(
    Phaser.Timer.SECOND * 3, 
    function(){ this.entity.game.state.start("Level",true,false,{levelName: "landing"});},
    this);
}

//=========================================================
//                  GRAVITY
//=========================================================

// Change gravity. An object is passed as a parameter and contains the new gravity
Player.prototype.changeGravity = function(_data){
  this.entity.body.data.gravityScale = _data.gravity;
  var angle = _data.gravity < 0 ? 180 : 0;
  this.entity.body.angle = angle;
  this.entity.angle = angle;
}

//=========================================================
//                  STATES
//=========================================================

Player.prototype.changeState = function(_newState){
  this.lastState = this.state;
  this.state = _newState;
}