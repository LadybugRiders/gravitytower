"use strict";

//>>LREditor.Behaviour.name: GravityZone
//>>LREditor.Behaviour.params : { "gravity": 1 }

var GravityZone = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
	this.collidingObjects = new Array();
	this.gravity = 1;
};

GravityZone.prototype = Object.create(LR.Behaviour.prototype);
GravityZone.prototype.constructor = GravityZone;

GravityZone.prototype.create = function(_data){
   if( _data.gravity )
      this.gravity = _data.gravity;
   var bodyWidth = this.go.getShapeData().width;
   this.left = this.go.x - this.entity.anchor.x * bodyWidth;
   this.right = this.go.x + (1-this.entity.anchor.x) * bodyWidth;
}

GravityZone.prototype.update = function(){
   //for each object colliding with the divide line
   for(var i = 0 ; i < this.collidingObjects.length ; i ++ ){
   		var colObj = this.collidingObjects[i];

         //compute bounds of the colliding object
         var itsBodyWidth = colObj.getShapeData().width;
         var itsLeft = colObj.x - colObj.entity.anchor.x * itsBodyWidth;
         var itsRight = colObj.x + (1-colObj.entity.anchor.x) * itsBodyWidth;
   		
   		//Check if the object is still overlapping
   		if( itsLeft <=  this.right && itsRight >= this.left){
            var centerinZone = ( colObj.x >= this.left ) && ( colObj.x <= this.right );
   			//verify if its center is in the zone
            if( centerinZone ){       
               //remove it from the collidings to check           
               //this.collidingObjects.splice(i,1);
               //change gravity according to delta to the object's gravity point
               this.changeGravity(colObj)
            }
   		}else{
            this.collidingObjects.splice(i,1);
   		}
   }
}

GravityZone.prototype.onBeginContact = function(_otherbody,_myshape, _othershape, _equation){
   var gravityReact = _otherbody.go.getBehaviour(GravityReact);
   if( _otherbody.go.layer == "player" )//|| gravityReact != null )
  	   this.collidingObjects.push(_otherbody.go);
}

//Change the gravity of the object according to its position ( represented by _signedNumber)
GravityZone.prototype.changeGravity = function( _gameobject){
	_gameobject.sendMessage("changeGravity", { gravity : this.gravity });   
}