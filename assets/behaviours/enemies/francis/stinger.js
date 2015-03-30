"use strict";
//>>LREditor.Behaviour.name : Francis.Stinger
//>>LREditor.Behaviour.params : {"orb":null,"stinger":null,"mainBody":null}
if(!Francis)
	var Francis = {};

Francis.Stinger = function(_gameobject){
	Hanger.call(this, _gameobject);
	this.state = "idle";
	this.mainOffset = new Phaser.Point(0,0);
	this.orbOffset = new Phaser.Point();

	this.hookX = -45;
	this.hookY = 20; 
	this.hookPosition = new Phaser.Point();

	//reference to the tail script
	this.tailScript;

	//Attack
	this.currentTargetPos = new Phaser.Point();
	this.speedAttack = 500;
	this.attackVector;
	//Retreat
	this.currentRetreatTargetPos = new Phaser.Point(240,9);
	this.speedRetreat = 1000;
	this.retreatVector;
	this.attackData;
}

Francis.Stinger.prototype = Object.create(Hanger.prototype);
Francis.Stinger.prototype.constructor = Francis.Stinger;

Francis.Stinger.prototype.create = function(_data){
	if(_data.orb){
		this.orb = _data.orb;
		this.orbOffset.x = this.orb.x - this.go.x;
		this.orbOffset.y = this.orb.y - this.go.y;
	} 
	if(_data.mainBody){
		this.mainBody = _data.mainBody.getBehaviour(Francis.MainBody);
	}
	//smokes
	this.smokeGroup = _data.smokeGroup.entity;
	for(var i=0; i < this.smokeGroup.children.length; i++){
		this.smokeGroup.children[i].visible = false;
	}
	this.initParentAngle = this.entity.parent.angle;
	this.initParentPosition = new Phaser.Point(this.entity.parent.go.x, this.entity.parent.go.y);
}

Francis.Stinger.prototype.update = function(_data){
	this.placeOrb();
	switch(this.state){
		case "hung" : this.updateHung(); break;
		case "attack" : this.attacking(); break;
		case "retreat" : this.retreating(); break;
	}
}

Francis.Stinger.prototype.hang = function(){
	Hanger.prototype.hang.call(this);
	this.state = "hung";
	this.hookPosition.x = this.entity.world.x + this.hookX;
	this.hookPosition.y = this.entity.world.y + this.hookY ;
	this.deltaVector = Phaser.Point.subtract(this.hookPosition,this.player.entity.world);
	this.distanceToHook = this.deltaVector.getMagnitude();
	this.mainBody.onPlayerHung();
}

//Called by the tail
Francis.Stinger.prototype.onReadyHang = function(_data){
	this.state = "readyHang";
}

Francis.Stinger.prototype.onUnreadyHang = function(_data){
	this.state = "idle";
}

//=============== THROW player =============
//called by mainbody
Francis.Stinger.prototype.throwPlayer1 = function(){
	//compute direction of the release
	var vector = new Phaser.Point(-1.5,1.2);	
	//unhang the player
	this.player.onReleaseHang(this.formerGrav, vector);	
	this.player = null;
	this.playerHair = null;
	this.released = true;
}

//=============== ATTACK =============
//Called by the tail with the trigger message
Francis.Stinger.prototype.attack = function(_data){	

	if( this.isAttacking()){
		this.attackData = _data;
		this.retreat();
		return;
	}
	//change transform
	this.entity.parent.go.stopTweenAll();
	this.entity.parent.x = -79; this.entity.parent.y = 34;
	this.entity.parent.angle = 21;
	//compute target position
	this.currentTargetPos.x = _data.sender.worldX + (_data.deltaX?_data.deltaX:0);
	this.currentTargetPos.y = _data.sender.worldY + (_data.deltaY?_data.deltaY:0);
	//change angle if needed
	
	if( _data.angle)
		this.tailScript.entity.angle = _data.angle;
	//compute attack direction
	var xVector = this.currentTargetPos.x - this.go.worldX;
	var yVector = this.currentTargetPos.y - this.go.worldY;

	this.attackVector = new Phaser.Point(xVector,yVector);
	this.lastMagnitude = Number.MAX_VALUE;
	this.attackVector = this.attackVector.normalize();
	//console.log(this.attackVector);
	this.state = "attack";
}

Francis.Stinger.prototype.attacking = function(){
	var speed =  this.speedAttack * this.entity.game.time.elapsed * 0.001 ;
	//move
	this.tailScript.go.x += this.attackVector.x * speed;
	this.tailScript.go.y += this.attackVector.y * speed;
	//distance to the target from the next point
	var newMag = Phaser.Point.subtract(this.currentTargetPos, this.go.world).getMagnitude();
	
	//if the next move makes the stinger going futher from the target
	if( newMag > this.lastMagnitude){
		//stop
		this.stuck();
	}else{
		this.lastMagnitude = Phaser.Point.subtract(this.currentTargetPos,this.go.world).getMagnitude();
	}
}

Francis.Stinger.prototype.stuck = function(){
	this.state = "stuck";
	this.playSmoke();
}

Francis.Stinger.prototype.retreat = function(){
	var xVector = this.currentRetreatTargetPos.x - this.tailScript.go.x;
	var yVector = this.currentRetreatTargetPos.y - this.tailScript.go.y;

	this.retreatVector = new Phaser.Point(xVector,yVector);
	this.retreatVector = this.retreatVector.normalize();

	this.state = "retreat";
}

Francis.Stinger.prototype.retreating = function(){
	this.tailScript.go.x += this.retreatVector.x * this.speedRetreat * this.entity.game.time.elapsed * 0.001;
	this.tailScript.go.y += this.retreatVector.y * this.speedRetreat * this.entity.game.time.elapsed * 0.001;

	//compute attack direction
	var xVector = this.currentRetreatTargetPos.x - this.go.worldX;
	var yVector = this.currentRetreatTargetPos.y - this.go.worldY;

	var vector = new Phaser.Point(xVector,yVector);

	if( vector.getMagnitude() < 100){
		this.tailScript.entity.angle = 0;
		this.attack(this.attackData);
	}
}

Francis.Stinger.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	//STATE READY HANG
	if(this.state == "readyHang" && _myShape.lr_name == "hangShape"){
		//Hanger function will take care of further checks
		Hanger.prototype.onBeginContact.call(this,_otherBody,_myShape,_otherShape,_equation);
	}
	//State ATTACK
	if( this.isAttacking() && this.isShapeAttack(_myShape) ){
		//check that we hit the right body&shape
		if( _otherBody.go.layer == "player" && _otherShape.lr_name == "mainShape"){
			console.log("HIT");
			var playerScript = _otherBody.go.getBehaviour(Player);
			if( playerScript ){
				playerScript.hit( {sender : this.go, shape:_otherShape});
			}
		}
	}
}

Francis.Stinger.prototype.placeOrb = function(_data){
	this.orb.x = this.entity.x + this.orbOffset.x;
	this.orb.y = this.entity.y + this.orbOffset.y;
}


Francis.Stinger.prototype.updateHung = function(){
	if(this.player && this.released == false){
		this.hookPosition.x = this.go.worldX + this.hookX;
		this.hookPosition.y = this.go.worldY + this.hookY;
		var vec = this.deltaVector.normalize();
		this.player.go.worldX = this.hookPosition.x - vec.x * this.distanceToHook;
	  	this.player.go.worldY = this.hookPosition.y - vec.y * this.distanceToHook;
	  	this.player.hair.followPlayer();
	  	this.distanceToHook -= 20 * this.entity.game.time.elapsed * 0.01;
	  	if( this.distanceToHook <= 0)
	  		this.distanceToHook = 0;
	}
}


//================ UTILS ==========================

Francis.Stinger.prototype.isAttacking = function(){
	return (this.state == "stuck" || this.state == "attack") ;
}

Francis.Stinger.prototype.isShapeAttack = function(_shape){
	return (_shape.lr_name == "attackShape1" || _shape.lr_name == "attackShape2");
}

Francis.Stinger.prototype.playSmoke = function(){
	this.smokeGroup.go.x = this.go.worldX -20;
	this.smokeGroup.go.y = this.go.worldY;
	for(var i=0; i < this.smokeGroup.children.length; i++){
		var child = this.smokeGroup.children[i];
		child.visible = true;
		child.alpha=  1;
		child.x = 0; child.y = 0;
		child.go.playTween("blow",true);
	}
}