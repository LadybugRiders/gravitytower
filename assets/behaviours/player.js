"use strict";

//>>LREditor.Behaviour.name: Player

var Player = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);

  //Speed Values
  this.baseSpeed = 200;
  this.speed = this.baseSpeed;
  this.acc = 10;

  this.dead = false;
  this.jumpPower = 300;
  this.gravity = 1;

  this.direction = 1;

  //get the feet shape by its name
  this.feetSensor = this.go.getShapeByName("feet");
  this.mainShape = this.go.getShapeByName("mainShape");

  //============= INPUTS =======================
  //use the inputManager to be notified when the JUMP key is pressed
  this.go.game.inputManager.bindKeyPress("jump",this.jump,this);
  //press to move
  this.go.game.inputManager.bindKeyPress("left", this.onMoveLeft, this);
  this.go.game.inputManager.bindKeyPress("right", this.onMoveRight, this);
  //Stop on release
  this.go.game.inputManager.bindKeyRelease("left", this.onMoveRelease, this);
  this.go.game.inputManager.bindKeyRelease("right", this.onMoveRelease, this);

  //inputs variables
  this.isMovePressed = false;

  //Make camera follow the player
  this.entity.game.camera.bounds = null;
  this.entity.game.camera.follow(this.entity,Phaser.Camera.FOLLOW_PLATFORMER);

  //State
  this.state = "idle";
  this.lastState = this.state;

};

Player.prototype = Object.create(LR.Behaviour.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function(_data) {
  this.hair = _data.hair_object;
}

Player.prototype.update = function() {
  if( this.dead == true )
    return;
  switch(this.state){
    case "run" : this.updateRun(); 
      break;
  }
}

Player.prototype.postUpdate = function(){
  this.updateHair();
}


//This method is automatically called when the body of the player collides with another cody
Player.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
  //if the collision is from the feet shape
  if( _myShape == this.feetSensor ){
    if( _otherBody.go.layer == "ground" ||_otherBody.go.layer == "box"){
      this.onGround = true;
      if( this.isMovePressed )
        this.run();
      else
        this.idleize();
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

Player.prototype.updateHair = function(){  
  this.hair.x = this.go.x;
  this.hair.y = this.go.y;

  this.hair.entity.scale.x = this.entity.scale.x;
  this.hair.entity.angle = this.entity.angle;
}

//=========================================================
//                  KEY CALLBACKS
//=========================================================

Player.prototype.onMoveLeft = function(_key){
  this.isMovePressed = true;
  this.run(-1);
  this.scaleByGravity();
}

Player.prototype.onMoveRight = function(_key){
  this.isMovePressed = true;
  this.run(1);
  this.scaleByGravity();
}

Player.prototype.onMoveRelease = function(){
  this.isMovePressed = false;
  if( this.onGround ){
    this.idleize();
  }
}

Player.prototype.idleize = function(_key){
  this.idle();
  this.scaleByGravity();
}

//=========================================================
//                  ACTIONS
//=========================================================

Player.prototype.idle = function(_direction){
  this.changeState("idle");
  if( _direction != null ) this.direction = _direction;

  this.entity.body.velocity.x = 0;
  //flip and play anim
  this.go.entity.scale.x = this.direction * this.gravity;
  this.scaleByGravity();

  this.entity.animations.play('idle');
  this.hair.entity.play('idle');

  this.preBlink();
}


Player.prototype.run = function(_direction, _speed ){
  this.changeState("run");
  if( _direction != null ) this.direction = _direction;
  if( _speed == null ) _speed = this.speed;
  
  //flip and play anim
  this.entity.animations.play('run');
  this.scaleByGravity();
  //play hair anim
  this.hair.entity.play('run');

  this.entity.body.velocity.x = this.direction * _speed;
}


Player.prototype.jump = function(_force){
  if( this.onGround || _force == true){
    this.changeState("jump");
    this.onGround = false;
    //apply jump force
    this.go.body.velocity.y = -this.jumpPower * this.gravity;
    this.entity.animations.play('jump');
    this.scaleByGravity();
  }
}

//=========================================================
//                  BLINK
//=========================================================

Player.prototype.preBlink = function(){
  //set a timer
  this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 3, 
      this.onBlinkTimerEnded,
      this);
}

Player.prototype.onBlinkTimerEnded = function(){
  if( this.state == "idle"){
    this.entity.animations.play("blink");
    this.preBlink();
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

//Called by a trigger finish (in general)
Player.prototype.finish = function(_data){  
  this.entity.animations.play('win', 10, true);
  this.enabled = false;
  //set a timer
  this.entity.game.time.events.add(
    Phaser.Timer.SECOND * 0.1, 
    function(){ this.entity.game.state.start("Level",true,false,{levelName: _data.level});},
    this);
}

//=========================================================
//                  GRAVITY
//=========================================================

// Change gravity. An object is passed as a parameter and contains the new gravity
Player.prototype.changeGravity = function(_data){
  //keep and apply gravity
  this.gravity = _data.gravity < 0 ? -1 : 1;
  this.entity.body.data.gravityScale = _data.gravity;
  //rotate
  var angle = _data.gravity < 0 ? 180 : 0;
  this.entity.body.angle = angle;
  this.entity.angle = angle;
  //Scale
  this.scaleByGravity();
}

Player.prototype.scaleByGravity = function(){
  this.entity.scale.x = this.direction  * this.gravity;
}

//=========================================================
//                  STATES
//=========================================================

Player.prototype.changeState = function(_newState){
  this.lastState = this.state;
  this.state = _newState;
}