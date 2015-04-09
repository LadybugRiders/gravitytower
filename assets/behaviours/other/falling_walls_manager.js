"use strict";

//>>LREditor.Behaviour.name: FallingWallsManager
//>>LREditor.Behaviour.params : {"wallsGroup":null,"blocker":null,deltaTime":600, "deltaSpawn":32,"xBegin":0,"ySpawn":0}

/*
This manager makes wall falling from the ceiling.
The wallsGroup is where all the walls are stored
The blocked object is solid and follow the falling walls in order to prevent
the player from going through
*/

var FallingWallsManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.walls = new Array();
	this.state = "idle";
	this.fallenWalls = new Array();
	this.blocker = null;

	this.fallCount = 0;
	this.deltaTime = 600;
	this.deltaSpawn = 32;
	this.xBegin = 0;
	this.ySpawn = 0;
	this.currentPos = 0;
}

FallingWallsManager.prototype = Object.create(LR.Behaviour.prototype);
FallingWallsManager.prototype.constructor = FallingWallsManager;

FallingWallsManager.prototype.create = function(_data){
	this.wallsGroup = _data.wallsGroup.entity;
	for(var i=0 ;  i < this.wallsGroup.children.length; i ++){
		var child = this.wallsGroup.children[i];
		child._FWMlaunched = false;
		child.alpha = 0;
		this.walls.push( child );
	}
	
	if(_data.deltaSpawn != null ) this.deltaSpawn = _data.deltaSpawn;
	if(_data.deltaTime != null) this.deltaTime = _data.deltaTime;
	if(_data.xBegin != null) this.xBegin = _data.xBegin;
	if(_data.ySpawn != null) this.ySpawn = _data.ySpawn;
	this.blocker = _data.blocker;
}

FallingWallsManager.prototype.launch = function(){
	if( this.state != "idle" )
		return;
	this.state = "launched";
	this.currentPos = 0;// this.xBegin;
	this.fallCount = 0;
	this.launchWall();
}

FallingWallsManager.prototype.launchWall = function(){
	if(this.state != "launched")
		return;
	var wall = this.getFreeWall();
	if( wall == null)
		return;
	wall.alpha = 1;
	wall._FWMlaunched = true;
	wall._FWMid = this.fallCount;
	//place wall
	wall.go.x = this.currentPos;
	wall.go.y = this.ySpawn;
	//increment next position
	this.currentPos += this.deltaSpawn;
	this.fallCount ++;
	//play tween
	var tween = wall.go.playTween("fall")[0];
	tween.onComplete.add(this.onWallFallEnded,this);

	var timeNext = this.deltaTime;
	if(this.fallCount < 2){
		timeNext = this.deltaTime * 2;
	}
	//set timer for next spawn
	this.entity.game.time.events.add(
      timeNext, 
      this.launchWall,
      this);
}

FallingWallsManager.prototype.onWallFallEnded = function(_entity){
	this.fallenWalls.push(_entity);
	this.go.playSound("stomp");
	this.blocker.disableSensor();
	var tween = this.entity.game.add.tween(this.blocker);
	tween.to({"x":_entity.x},100,Phaser.Easing.Default);
	tween.start();
	this.blocker.y = _entity.y;
}

FallingWallsManager.prototype.stop = function(){
	if( this.state != "launched" )
		return;
	this.state = "idle";
}

FallingWallsManager.prototype.cleanAll = function(){
	for(var i=0 ; i < this.walls.length; i++){
		var wall = this.walls[i];
		wall._FWMlaunched = false;
		wall.go.y = this.ySpawn;
	}
	this.blocker.enableSensor();
	this.fallenWalls = new Array();
}

FallingWallsManager.prototype.getFreeWall = function(){
	//search in walls first
	for(var i=0 ; i < this.walls.length; i++){
		if( this.walls[i]._FWMlaunched == false){
			return this.walls[i];
		}
	}
	//Search the further wall
	var minID = Number.MAX_VALUE;
	var wallIndex = 0;
	for(var i=0 ; i < this.fallenWalls.length; i++){
		if( this.fallenWalls[i]._FWMid < minID){
			wallIndex = i;
			minID = this.fallenWalls[i]._FWMid;
		}
	}
	//get the wall, remove it from fallen ones
	var wall = this.fallenWalls[wallIndex];
	this.fallenWalls.slice(wallIndex,1);
	return wall;
}