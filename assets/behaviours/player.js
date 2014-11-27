"use strict";

//>>LREditor.Behaviour.name: Player
//>>LREditor.Behaviour.params : {"hair_name":"hair", "acolyte":null}
var Player = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);

  //Speed Values
  this.baseSpeed = 10;
  this.speed = this.baseSpeed;
  this.currentSpeed = 0;
  this.maxSpeed = 200;
  this.airSpeed = this.maxSpeed * 0.4 ;
  this.runAcc = 7;
  this.airAcc = this.runAcc * 0.5;
  //Jump
  this.jumpAcc = 26;
  this.jumpHeight = 60;
  this.jumpBaseY = 0;
  this.jumpMinHeight = 26;
  this.jumpMinVelocity = 150;

  this.onGround = false;
  this.groundContacts = 0;

  this.dead = false;
  this.isHit = false;
  this.jumpPower = 250;
  this.gravity = 1;

  this.direction = 1;

  //get the feet shape by its name
  this.feetSensor = this.go.getShapeByName("feet");
  this.mainShape = this.go.getShapeByName("mainShape");

  //============= INPUTS =======================
  //use the inputManager to be notified when the JUMP key is pressed
  this.go.game.inputManager.bindKeyPress("jump",this.onJump,this);
  this.go.game.inputManager.bindKeyRelease("jump",this.onJumpRelease,this);
  //press to move
  this.go.game.inputManager.bindKeyPress("left", this.onMoveLeft, this);
  this.go.game.inputManager.bindKeyPress("right", this.onMoveRight, this);
  //Stop on release
  this.go.game.inputManager.bindKeyRelease("left", this.onMoveRelease, this);
  this.go.game.inputManager.bindKeyRelease("right", this.onMoveRelease, this);

  //inputs variables
  this.isMovePressed = false;
  this.isJumpPressed = false;

  //Allowing variables
  this.canJump = true;
  this.canMove = true;

  //Make camera follow the player
  this.entity.game.camera.bounds = null;
  this.entity.game.camera.follow(this.entity,Phaser.Camera.FOLLOW_PLATFORMER);

  //State
  this.state = "idle";
  this.lastState = this.state;

  //respawn
  this.respawnPosition = new Phaser.Point(this.entity.x, this.entity.y);
  this.respawnDirection = 1;

  this.playerSave = this.entity.game.playerSave;

};

Player.prototype = Object.create(LR.Behaviour.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function(_data) {
  //HAIR
  this.hair = _data.hair.getBehaviour(PlayerHair);
  this.hair.player = this;
  //Acolyte
  this.acolyte = _data.acolyte.getBehaviour(Acolyte);
  this.acolyte.player = this;
  //dusts
  this.dusts = [_data.dust1,_data.dust2];
  this.dusts.forEach(function(_element){_element.entity.visible = false;});
}

Player.prototype.update = function() {
  if( this.dead == true )
    return;
  switch(this.state){
    case "run" : this.updateRun(); 
      break;
    case "jump" : this.updateJump();
      break;
    case "fall" : this.updateRunAir();
      break;
  }
}

Player.prototype.postUpdate = function(){
  this.hair.followPlayer();
}

//This method is automatically called when the body of the player collides with another cody
Player.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
  if(this.dead == true)
    return;
  //if the collision is from the feet shape
  if( _myShape == this.feetSensor ){
    //Enemy collision
    if(_otherBody.go.layer == "enemy"){
      var enemy = _otherBody.go.getBehaviour(Enemy);
      if( enemy ){
        _otherBody.go.sendMessage("onHitJump");
        this.jump(true);
      }
    //any solid collision
    }else if( _otherShape.sensor == false || _otherShape.sensor == null){
      this.blowDust();
      this.groundContacts ++;
      this.onGround = true;
      if( this.isMovePressed ){
        this.currentSpeed = this.go.body.velocity.x;
        this.run(this.direction,Math.abs(this.currentSpeed));
      }else{
        this.idleize();
      }
    }
  }
  //If collision from the front (left or right given the direction)
  if( this.collidesFront(_myShape) && !_otherBody.dynamic ){
    //if the collision s solid
    if( _otherShape.sensor == false || _otherShape.sensor == null ){
      var mySides = LR.Utils.getRectShapeSides(this.go,_myShape);
      var otherSides = LR.Utils.getRectShapeSides(_otherBody.go,_otherShape);
      var t = mySides.right < otherSides.right && mySides.left > otherSides.left;
      if( ! t ){
        this.currentSpeed = 0;
        this.facingWall = _myShape.lr_name == "right" ? 1 : -1;
      }
    }
  }
}


Player.prototype.onContactLR = function(_contactData){

}

Player.prototype.onEndContact = function(_otherBody,_myShape, _otherShape){

  if( _myShape == this.feetSensor && this.isLayerGround(_otherBody.go.layer) ){
    this.groundContacts --;
    if( this.groundContacts == 0 && this.state != "jump"){
      this.fall();
    }
  }
  
  //If collision from the front (left or right given the direction)
  if( _myShape.lr_name == (this.facingWall > 0?"right":"left") ){
    //if the collision is solid
    if( _otherShape.sensor == false || _otherShape.sensor == null){
      this.facingWall = 0;
    }
  }
}

//=========================================================
//                  UPDATES
//=========================================================

Player.prototype.updateRun = function(){
  if( this.facingWall == this.direction || !this.canMove )
    return;
  this.currentSpeed += this.direction *  this.runAcc * this.entity.game.time.elapsed * 0.1;
  
  if( Math.abs( this.currentSpeed ) > this.maxSpeed)
    this.currentSpeed = this.direction * this.maxSpeed;

  this.entity.body.velocity.x = this.currentSpeed;
}

Player.prototype.updateJump = function(){ 
  
  //wait for the body to fall (according to gravity)
  //when this.fall is called, the state changes, so updateJump is not called anymore
  if( this.entity.body.velocity.y * this.gravity > 0){
    this.fall();
    return;
  }
  //check the height done by jump and button jump pressed
  var delta = Math.abs( this.jumpBaseY - this.entity.y );
  var deltaJumpOver = delta >= this.jumpHeight;
  
  if( delta >= this.jumpMinHeight && (deltaJumpOver || !this.isJumpPressed) ){
    this.fall();
    return;
  }
  //keep velocity to a minimum if jump still effective
  if( Math.abs( this.go.body.velocity.y) < this.jumpMinVelocity )
    this.go.body.velocity.y = -this.gravity * this.jumpMinVelocity;

  if( this.isMovePressed ){
    this.updateRunAir();
  }
}

Player.prototype.updateRunAir = function(){ 
  if( this.facingWall == this.direction)
    return;
  if( this.isMovePressed ){
    if( Math.abs( this.currentSpeed ) > this.airSpeed){
      return;
    }
     this.currentSpeed += this.direction *  this.airAcc * this.entity.game.time.elapsed * 0.1;
    
    if( Math.abs( this.currentSpeed ) > this.airSpeed)
      this.currentSpeed = this.direction * this.airSpeed;

    this.entity.body.velocity.x = this.currentSpeed;
  }
}

//=========================================================
//                  KEY CALLBACKS
//=========================================================

Player.prototype.onMoveLeft = function(_key){
  this.isMovePressed ++;
  if( ! this.canMove ){
    return;
  }
  //Suppress Momentum in the air
  if( !this.onGround && this.direction > 0){
    this.currentSpeed = 0;
  }
  this.direction = -1;
  if( this.onGround ){
    this.run();
  }
  this.scaleByGravity();
}

Player.prototype.onMoveRight = function(_key){
  this.isMovePressed ++;  
  if( ! this.canMove ){
    return;
  }
  //Suppress Momentum in the air
  if( !this.onGround && this.direction < 0){
    this.currentSpeed = 0;
  }

  this.direction = 1;
  if( this.onGround ){
    this.run();
  }
  this.scaleByGravity();
}

Player.prototype.onMoveRelease = function(){
  this.isMovePressed --;
  if( this.isMovePressed < 0)
    this.isMovePressed = 0;

  if( ! this.canMove )
    return;

  if( this.onGround && this.isMovePressed == 0){
    this.idleize();
  }
}

Player.prototype.onJump = function(_key){
  this.isJumpPressed = true;

  if( ! this.canJump )
    return;

  this.jump(false,this.jumpImpulse);
}

Player.prototype.onJumpRelease = function(_key){
  this.isJumpPressed = false;
  if( ! this.canJump )
    return;
}

Player.prototype.idleize = function(_key){
  this.idle();
  this.scaleByGravity();
}

//=========================================================
//                  EXTERNAL CALLBACKS
//=========================================================

Player.prototype.onActivatePower = function(_data){
  this.hair.activatePower(_data.power);
}

Player.prototype.onHang = function(){
  this.changeState("hanged");
  this.canMove = false;
  this.canJump = false;
  this.entity.body.setZeroVelocity();
}

Player.prototype.onReleaseHang = function(_gravity,_vector){
  this.changeState("jump");
  this.canMove = true;
  this.canJump = true;
  this.changeGravity( { "gravity":_gravity });
  this.entity.body.velocity.x = _vector.x * 300;
  this.entity.body.velocity.y = _vector.y * -180 - Math.abs(_vector.x) * 240;
}

Player.prototype.onCollectCoin = function(_data){
  var count = 1;
  if( _data.count ) count = _data.count;
  this.playerSave.getSave()["curLevelCoins"] += count;
  this.entity.game.pollinator.dispatch("onCoinsChanged")
}

Player.prototype.onCollectLife = function(){
  this.entity.game.playerSave.getSave()["lives"] ++;
  this.entity.game.pollinator.dispatch("onLivesChanged")
}

Player.prototype.onGainHealth = function(){
  this.acolyte.gainHealth();
}

//=========================================================
//                  ACTIONS
//=========================================================

Player.prototype.idle = function(_direction){
  this.changeState("idle");
  if( _direction != null ) this.direction = _direction;

  this.entity.body.velocity.x = 0;
  this.currentSpeed = 0;
  //flip and play anim
  this.go.entity.scale.x = this.direction * this.gravity;
  this.scaleByGravity();

  this.entity.animations.play('idle');
  this.hair.idle();

  this.preBlink();
}

Player.prototype.fall = function(){
  this.changeState("fall");
  this.entity.play("fall");
  this.onGround = false;
}


Player.prototype.run = function(_direction, _speed ){
  this.changeState("run");
  if( _direction != null ) this.direction = _direction;
  if( _speed == null ) _speed = this.runAcc;

  //flip and play anim
  this.entity.animations.play('run');
  this.scaleByGravity();
  //play hair anim
  this.hair.run();

  this.entity.body.velocity.x = this.direction * _speed ;
}

Player.prototype.jump = function(_force, _jumpPower){
  if( this.onGround || _force == true){
    this.changeState("jump");
    this.onGround = false;
    this.jumpBaseY = this.entity.y;
    //apply jump force
    if( _jumpPower != null)
      this.go.body.velocity.y = -_jumpPower * this.gravity;
    else
      this.go.body.velocity.y = -this.jumpPower * this.gravity;
    this.entity.animations.play('jump');
    this.scaleByGravity();
  }
}

Player.prototype.freeze = function(){
  this.canMove = false;
  this.canJump = false;
  this.isMovePressed = 0;
  this.entity.body.setZeroVelocity();
  this.currentSpeed = 0;
  if(this.onGround)
    this.idleize();
}

Player.prototype.unfreeze = function(){
  this.canMove = true;
  this.canJump = true;
}
//=========================================================
//                  BLINK / DUST
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

Player.prototype.blowDust = function(){ 
  if(this.go.velocityY < 70)
    return;
  this.dusts.forEach(
    function(_element,_index){
      _element.entity.visible = true;
      var dir = _index == 0 ? -1 : 1;
      _element.x = this.entity.x + dir * 5;
      _element.y = this.entity.y + 10 * this.gravity;
      _element.entity.alpha = 1;
      var tween = this.entity.game.add.tween(_element.entity);
      tween.to( { "x" : this.entity.x + dir * 30,alpha:0},700);
      tween.start();
    },
    this
  );
}

//=========================================================
//                  DEATH
//=========================================================

Player.prototype.hit = function(_data){
  if( _data.shape !== this.mainShape || this.isHit == true || this.dead ==true)
    return;
  if( this.acolyte.dead){
    this.die();
  }else{
    this.acolyte.loseHealth();    
    var tween = this.entity.game.add.tween(this.entity);
    tween.to( {alpha : 0},200,null,true,0,11,true);
    tween.onComplete.add(this.onEndHit,this);
    tween = this.entity.game.add.tween(this.hair.entity);
    tween.to( {alpha : 0},200,null,true,0,11,true);
    this.isHit = true;
  }
}

Player.prototype.onEndHit =function(){
  this.isHit = false;
  this.entity.alpha = 1;
}

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

  //DEATH !!!
  if(this.entity.game.playerSave.getSave()["lives"] == 0){
    //set a timer
    this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 3, 
      function(){ this.entity.game.state.start("Level",true,false,{levelName: "menu_select_levels"});},
      this);
    return;
  }

  //Accounts
  this.entity.game.playerSave.getSave()["lives"] --; 
  this.entity.game.pollinator.dispatch("onLivesChanged");
  this.entity.game.playerSave.writeSave();

  //set a timer
    this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 3, 
      function(){ this.respawn();},
      this);
}

Player.prototype.respawn = function(){
  //this.entity.game.pollinator.dispatch("onPlayerRespawn");
  this.hair.deactivatePower();
  this.entity.body.setZeroVelocity();
  this.mainShape.sensor = false;
  this.state = "jump";
  this.entity.game.camera.follow(this.entity);
  this.enableEvents = true;
  this.dead = false;
  //respawn
  this.direction = this.respawnDirection;
  this.go.setPosition( this.respawnPosition.x, this.respawnPosition.y);
  this.scaleByGravity();
}

//Called by a trigger finish (in general)
Player.prototype.finish = function(_data){  
  this.entity.animations.play('win', 10, true);
  this.enabled = false;
  this.freeze();
  //set a timer
  this.entity.game.time.events.add(
    Phaser.Timer.SECOND * 1, 
    function(){ this.entity.game.state.start("Level",true,false,{levelName: "menu_select_levels"});},
    this);
}

//Called by a trigger finish (in general)
Player.prototype.changeLevel = function(_data){  
  this.entity.animations.play('win', 10, true);
  //set a timer
  this.entity.game.time.events.add(
    Phaser.Timer.SECOND * 0.1, 
    function(){ this.entity.game.state.start("Level",true,false,{levelName: _data.levelName});},
    this);
}

Player.prototype.checkpoint = function(_dataSent){
  this.respawnPosition = new Phaser.Point( _dataSent.sender.entity.x, _dataSent.sender.entity.y);
  if( _dataSent.direction )
    this.respawnDirection = _dataSent.direction;
  _dataSent.sender.entity.frame = 1;
}

//=========================================================
//                  GRAVITY
//=========================================================

// Change gravity. An object is passed as a parameter and contains the new gravity
Player.prototype.changeGravity = function(_data){
  if( ! this.isGravityAffected ){
    return;
  }
  //keep and apply gravity
  this.gravity = _data.gravity < 0 ? -1 : 1;
  this.go.gravity = _data.gravity;
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

Player.prototype.isLayerGround = function( _layer ){
  return _layer == "ground" || _layer == "box";
}

Player.prototype.collidesFront = function(_shape){
  var way = this.direction * this.gravity;
  if( way > 0 && _shape.lr_name == "right")
    return true;
  if( way < 0 && _shape.lr_name == "left")
    return true;
  return false;
}

Object.defineProperty( Player.prototype, "isGravityAffected",
  {
    get : function(){
      return this.state != "hanged";
    }
  }
);