"use strict";

//>>LREditor.Behaviour.name: DivideLine
//>>LREditor.Behaviour.params : { "leftWorld": "", "rightWorld" : "" }

var DivideLine = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
	this.collidingObjects = new Array();
	this.leftGravity = 1;
	this.rightGravity = -1;
};

DivideLine.prototype = Object.create(LR.Behaviour.prototype);
DivideLine.prototype.constructor = DivideLine;

DivideLine.prototype.create = function(_data){
   this.leftWorld = _data.leftWorld;
   this.rightWorld = _data.rightWorld;
}

DivideLine.prototype.update = function(){
   //for each object colliding with the divide line
   for(var i = 0 ; i < this.collidingObjects.length ; i ++ ){
   		var colObj = this.collidingObjects[i];
   		var diff = colObj.x - this.go.x;

   		//Check the object distance from the line
   		if( Math.abs( diff ) >= this.go.entity.width ){
   			//if it's too far, remove it from array
   			this.collidingObjects.splice(i,1);
   		}else{
   			//else change gravity according to delta to the object's gravity point
   			this.changeGravity(diff,colObj)
   		}
   }
}

DivideLine.prototype.onBeginContact = function(_otherbody,_myshape, _othershape, _equation){
   if( _otherbody.go.layer == "player")
  	   this.collidingObjects.push(_otherbody.go);
}

//Change the gravity of the object according to its position ( represented by _signedNumber)
DivideLine.prototype.changeGravity = function(_signedNumber, _gameobject){
	var g = this.rightGravity;
	if( _signedNumber < 0 ){
		g = this.leftGravity;
	}
	_gameobject.sendMessage("changeGravity", { gravity : g });   
}