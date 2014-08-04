"use strict";

//>>LREditor.Behaviour.name: GravityReact
//>>LREditor.Behaviour.params : { "rotate": false }

var GravityReact = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
	this.rotate = false;
	this.gravity = 1;
};

GravityReact.prototype = Object.create(LR.Behaviour.prototype);
GravityReact.prototype.constructor = GravityReact;

GravityReact.prototype.create = function(_data){
   if( _data.rotater )
      this.rotate = _data.rotate;
}

// Change gravity. An object is passed as a parameter and contains the new gravity
GravityReact.prototype.changeGravity = function(_data){
    if( this.entity.body == null )
    	return;
 	//keep and apply gravity
	this.gravity = _data.gravity < 0 ? -1 : 1;
	this.entity.body.data.gravityScale = _data.gravity;
	//rotate
	if( this.rotate == true ){
	  var angle = _data.gravity < 0 ? 180 : 0;
	  this.entity.body.angle = angle;
	  this.entity.angle = angle;
	}

	this.go.sendMessage( "onGravityChanged", { gravity : this.gravity});
}