//>> LREditor.Behaviour.name : ScrollingBackground
//>> LREditor.Behaviour.params : {"player":""}
ScrollingBackground = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);	
	this.player = null;
}

ScrollingBackground.prototype = Object.create(LR.Behaviour.prototype);
ScrollingBackground.prototype.constructor = ScrollingBackground;

ScrollingBackground.prototype.create = function(_data){
	this.player = _data.player;
}

ScrollingBackground.prototype.update = function(){
    if (this.player) {
        this.entity.tilePosition.x -= this.player.entity.deltaX * 0.4;
    }
}