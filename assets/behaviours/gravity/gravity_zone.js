"use strict";

//>>LREditor.Behaviour.name: GravityZone
//>>LREditor.Behaviour.params : { "gravity": 1 }

var GravityZone = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
};

GravityZone.prototype = Object.create(LR.Behaviour.prototype);
GravityZone.prototype.constructor = GravityZone;

GravityZone.prototype.create = function(_data){
}

GravityZone.prototype.onBeginContact = function(_otherbody,_myshape, _othershape, _equation){
   
   var gravityReact = null; 
   try{ 
      gravityReact = _otherbody.go.getBehaviour(GravityReact);
   }catch(e){}

   var isKomoBody = (_otherbody.go.name == "komo_body" && _othershape.lr_name == "mainShape");

   if( isKomoBody || gravityReact != null ){
      this.changeGravity(_otherbody.go,-1);
   }
}

GravityZone.prototype.onEndContact = function(_otherbody,_myshape, _othershape, _equation){
   var gravityReact = null; 
   try{ 
      gravityReact = _otherbody.go.getBehaviour(GravityReact);
   }catch(e){}

   var isKomoBody = (_otherbody.go.name == "komo_body" && _othershape.lr_name == "mainShape");

   if( isKomoBody || gravityReact != null ){
      this.changeGravity(_otherbody.go,1);
   }
}

//Change the gravity of the object according to its position ( represented by _signedNumber)
GravityZone.prototype.changeGravity = function( _gameobject, _gravity){
	_gameobject.sendMessage("changeGravity", { gravity : _gravity });   
}