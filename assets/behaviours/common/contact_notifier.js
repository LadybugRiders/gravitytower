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
         var myshapeBounds = this.getShapeBounds(this.go, colData.myShape);
         var itsShapeBounds = this.getShapeBounds(colData.otherBody.go, colData.otherShape);
   		//Check if the object is still overlapping
   		if( this.collides(myshapeBounds,itsShapeBounds) ){
            this.go.sendMessage("onContact",colData);
   		}else{
            this.go.sendMessage("onEndContact",colData);
            //when out, remove
            this.collidingObjects.splice(i,1);
   		}
   }
}

LR.Behaviour.ContactNotifier.prototype.onBeginContact = function(_otherBody,_myShape, _otherShape, _equation){
	var contactData = {"otherBody":_otherBody, "myShape" : _myShape, "otherShape" : _otherShape, "equation" : _equation};
	this.collidingObjects.push({ "go" : _otherBody.go, "contactData" : contactData} );
}

LR.Behaviour.ContactNotifier.prototype.getShapeBounds = function(_go,_shape){
	var data = _go.getShapeData(_shape.lr_name);

	//Rotate shape offset with the body, as offset isnt changed with rotations
	var realOffset = new Phaser.Point(data.x,data.y); 
	realOffset = LR.Utils.rotatePoint(realOffset, _go.entity.body.angle);
	data.x = realOffset.x;
	data.y = realOffset.y;

	//Compute bounds of the shape
	var bounds = new Object();
	bounds.left = _go.x + data.x - _go.entity.anchor.x * data.width;
	bounds.right = _go.x + data.x + (1-_go.entity.anchor.x) * data.width;
	bounds.top = _go.y + data.y - _go.entity.anchor.y * data.height;
	bounds.bottom = _go.y + data.y + (1-_go.entity.anchor.y) * data.height;

	return bounds;
}

LR.Behaviour.ContactNotifier.prototype.collides = function( _boundsA, _boundsB){
	if( _boundsA.left <=  _boundsB.right && _boundsA.right >= _boundsB.left &&
		_boundsA.top <=  _boundsB.bottom && _boundsA.bottom >= _boundsB.top
		){
		return true;
	}
	return false;
}
