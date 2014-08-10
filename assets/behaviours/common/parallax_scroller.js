"use strict";
//>>LREditor.Behaviour.name: LR.Behaviour.ParallaxScroller
//>>LREditor.Behaviour.params: { "xParal" : 0.1, "yParal" : 0}
LR.Behaviour.ParallaxScroller = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.camera = _gameobject.game.camera;
   this.offset = {x:0,y:0};
   this.basePosition = {x:this.go.x,y:this.go.y};
   this.xParal = 0.1;
   this.yParal = 0.1;
}

LR.Behaviour.ParallaxScroller.prototype = Object.create(LR.Behaviour.prototype);
LR.Behaviour.ParallaxScroller.prototype.constructor = LR.Behaviour.ParallaxScroller;

LR.Behaviour.ParallaxScroller.prototype.create = function(_data){
   if(_data.xParal != null) this.xParal = _data.xParal;
   if(_data.yParal != null) this.yParal = _data.yParal;
   console.log(this.entity.type == Phaser.TILESPRITE);
}

LR.Behaviour.ParallaxScroller.prototype.update = function(){
   if( this.entity.type == Phaser.TILESPRITE){
      this.entity.tilePosition.set(this.camera.x * -this.xParal, this.camera.y * -this.yParal); 
   }else{
      this.offset.x = (this.go.x - this.camera.view.centerX) * this.xParal;
      this.offset.y = (this.go.y - this.camera.view.centerY) * this.yParal;

      this.go.x = this.basePosition.x + this.offset.x ;
      this.go.y = this.basePosition.y + this.offset.y ;      
   }
}