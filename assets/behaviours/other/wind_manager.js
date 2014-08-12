"use strict";

//>>LREditor.Behaviour.name: WindManager
//>>LREditor.Behaviour.params : {"randX" : 0, "randY" : 0}
var WindManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.winds = new Array();
	this.activeWinds = new Array();
	this.camera = this.entity.game.camera;

	this.speed = {x:-200, y: 50};

	this.randX =0; this.randY = 0;
	this.animX = 200;
}

WindManager.prototype = Object.create(LR.Behaviour.prototype);
WindManager.prototype.constructor = WindManager;

WindManager.prototype.create = function(_data){
	if( _data.randX != null ) this.randX = _data.randX;
	if( _data.randY != null) this.randY = _data.randY;
	for( var i=0; i< this.entity.children.length; i ++){
		this.winds.push( this.entity.children[i]);
		this.entity.children[i].kill();
	}
	this.launch();
}

WindManager.prototype.update = function(){
	var elapsed = this.entity.game.time.elapsed * 0.001;
	for(var i=0; i < this.activeWinds.length; i++ ){
		var wind = this.activeWinds[i];

		//check when to play anim
		if( wind.x < wind.animX && wind.canDie == false)
			this.beginAnim(wind);
		//don't move if whirling
		if( wind.whirling )
			continue;
		//move
		wind.x += this.speed.x * elapsed;
		wind.y += this.speed.y * elapsed;
		//kill when out of camera
		if( wind.canDie && ! wind.inCamera){
			this.activeWinds.splice(i,1);
			wind.kill();
			console.log("killed");
		}
	}
}

WindManager.prototype.launch = function(){
	var wind = this.getWind();

	if( wind == null)
		return;
	wind.revive();
	this.activeWinds.push(wind);
	wind.canDie = false;

	this.placeWindStart(wind);
	this.setAnimX(wind);

	this.entity.game.time.events.add(
      Phaser.Timer.SECOND * 4, 
      this.launch,
      this);
}
//==============ANIM======================================

WindManager.prototype.beginAnim = function(_wind){
	var anim = _wind.animations.play("whirl");
	anim.onComplete.add(this.onEndAnim,this);
	_wind.whirling = true;
}

WindManager.prototype.onEndAnim = function(_sprite, _anim){
	_sprite.whirling = false;
	_sprite.canDie = true;
}

//=============UTILS======================================

WindManager.prototype.placeWindStart = function(_wind){
	var offsetY = Math.random() * this.randY;
	_wind.x = this.camera.view.x + this.camera.view.width + _wind.width;
	_wind.y = this.camera.view.y + offsetY;
}

WindManager.prototype.setAnimX = function(_wind){
	var rand = Math.random() * 2 * this.animX - this.animX;
	_wind.animX = this.camera.view.centerX + rand;
}

WindManager.prototype.getWind = function(){
	for(var i=0; i< this.winds.length; i++){
		if( ! this.winds[i].alive ){
			return this.winds[i];
		}
	}
	return null;
}