"use strict";

//>>LREditor.Behaviour.name: LR.Behaviour.TutoManager
//>>LREditor.Behaviour.params : {"player":null, "texts":null, "images":null}
LR.Behaviour.TutoManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
}

LR.Behaviour.TutoManager.prototype = Object.create(LR.Behaviour.prototype);
LR.Behaviour.TutoManager.prototype.constructor = LR.Behaviour.TutoManager;

LR.Behaviour.TutoManager.prototype.create = function(_data){
	if(_data.player) this.player = _data.player;
	if(_data.texts) this.texts = _data.player;
	if(_data.images) this.images = _data.images;
}

LR.Behaviour.TutoManager.prototype.update = function(){

}