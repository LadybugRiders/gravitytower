"use strict";
/*
Stops the sound attached to the entity when out of camera view, plays it when
in view
*/

//>>LREditor.Behaviour.name: InViewSound
//>>LREditor.Behaviour.params : {"soundName":"sound", "volume":1,"loop":true}
var InViewSound = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.volume = 1;
	this.loop = true;
}

InViewSound.prototype = Object.create(LR.Behaviour);
InViewSound.prototype.constructor = InViewSound;

InViewSound.prototype.create = function(_data){
	if(_data.soundName) this.soundName = _data.soundName;
	if(_data.volume) this.volume = _data.volume;
	if(_data.loop) this.loop = _data.loop;
}

InViewSound.prototype.update = function(){

}

InViewSound.prototype.onShow = function(){
	if(this.soundName)
		this.go.playSound(this.soundName,this.volume,this.loop);
}

InViewSound.prototype.onHide = function(){
	if(this.soundName)
		this.go.stopSound(this.soundName);
}