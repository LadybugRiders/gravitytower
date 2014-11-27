"use strict";
//>>LREditor.Behaviour.name: LR.Behaviour.ContactNotifier
LR.Behaviour.ContactNotifier = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.collidingObjects = new Array();
}

LR.Behaviour.ContactNotifier.prototype = Object.create(LR.Behaviour.prototype);
LR.Behaviour.ContactNotifier.prototype.constructor = LR.Behaviour.ContactNotifier;

LR.Behaviour.ContactNotifier.prototype.update = function(){
	//for each object colliding with the divide line
   for(var i = 0 ; i < this.collidingObjects.length ; i ++ ){
   		var colObj = this.collidingObjects[i].go;
   		var colData = this.collidingObjects[i].contactData;

         //compute bounds of the colliding object
         var myshapeBounds = LR.Utils.getRectShapeSides(this.go, colData.myShape);
         var itsShapeBounds = LR.Utils.getRectShapeSides(colData.otherBody.go, colData.otherShape);
   		//Check if the object is still overlapping
   		if( this.collides(myshapeBounds,itsShapeBounds) ){
            this.go.sendMessage("onContactLR",colData);
   		}else{
            this.go.sendMessage("onEndContactLR", colData );
            //when out, remove
            this.collidingObjects.splice(i,1);
   		}
   }
}

LR.Behaviour.ContactNotifier.prototype.onBeginContact = function(_otherBody,_myShape, _otherShape, _equation){
	var contactData = {"otherBody":_otherBody, "myShape" : _myShape, "otherShape" : _otherShape, "equation" : _equation};
	this.collidingObjects.push({ "go" : _otherBody.go, "contactData" : contactData} );
}

LR.Behaviour.ContactNotifier.prototype.collides = function( _boundsA, _boundsB){
	if( _boundsA.left <=  _boundsB.right && _boundsA.right >= _boundsB.left &&
		_boundsA.top <=  _boundsB.bottom && _boundsA.bottom >= _boundsB.top
		){
		return true;
	}
	return false;
}
