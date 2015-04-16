"use strict";

//>>LREditor.Behaviour.name: SplashScreen
//>>LREditor.Behaviour.params : {}
var SplashScreen = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);
	this.mobile = ! this.entity.game.device.desktop;
	
	this.count = 0;

	this.alphaTime = 1000;
	this.stillTime = 2000;
	
	this.entity.game.getCurrentState().loadText.visible = false;
};

SplashScreen.prototype = Object.create(LR.Behaviour.prototype);
SplashScreen.prototype.constructor = SplashScreen;

SplashScreen.prototype.create = function(_data){
	for(var i=0; i < this.entity.children.length; i++){
		this.entity.children[i].alpha = 0;
	}	
	this.next();
}

SplashScreen.prototype.next = function(){
	if( this.count >= this.entity.children.length){
		this.onChangeScene();
		return;
	}
	var child = this.entity.children[this.count];
	var tween = this.entity.game.add.tween(child);
	tween.to( { alpha: 1 }, this.alphaTime, "Linear", true);
	tween.onComplete.add(this.onFadeInEnded,this);
}

SplashScreen.prototype.onFadeInEnded = function(){
	this.entity.game.time.events.add(
      this.stillTime, 
      this.fadeOut,
      this);
}

SplashScreen.prototype.fadeOut = function(){
	var child = this.entity.children[this.count];
	var tween = this.entity.game.add.tween(child);
	tween.to( { alpha: 0 }, this.alphaTime, "Linear", true);
	tween.onComplete.add(this.next,this);
	this.count ++;
}

SplashScreen.prototype.onChangeScene = function(){
	this.entity.game.state.start("Level",true,false,{levelName: "landing"});
}