"use strict";
//>>LREditor.Behaviour.name: Springboard
//>>LREditor.Behaviour.params : { "force" : 500 }
/**
* Class Springboard.
* Springboard item
*
* @class Springboard
* @constructor
* @param {GameObject} gameobject
*/
var Springboard = function(_gameobject){
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.force = 500;
}

Springboard.prototype = Object.create(LR.Behaviour.Trigger.prototype);
Springboard.prototype.constructor = Springboard;

/**
* Creation data properties 
*
* @method create
* @param {data} data Object containing properties to be assigned at the creation of the game
*/
Springboard.prototype.create = function(_data){
	if( _data == null )
		return;
	LR.Behaviour.Trigger.prototype.create.call(this,_data);
	if( _data.force != null ) this.force = _data.force;
}

/**
* Called when the item is collided by a valid interactive
*
* @method onTriggered
* @param {_gameobject} gameobject Colliding object
*/
Springboard.prototype.onTriggered = function(_gameobject){
	if( _gameobject.layer == "player"){
		if( _gameobject.entity.body.velocity.y > 0)
			return;
		var playerScript = _gameobject.getBehaviour(Player);
		playerScript.jump(true,this.force);
	}
}