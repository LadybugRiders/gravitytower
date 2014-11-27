"use strict";

//>>LREditor.Behaviour.name: TutoManager
//>>LREditor.Behaviour.params : {"player":null, "background":null, "button":null}
var TutoManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.currentTuto = null;
	this.open = false;
	this.entity.visible = false;
	if( this.entity.game.device.desktop)
		this.entity.game.inputManager.bindKeyPress("jump",this.onCloseTuto, this);
}

TutoManager.prototype = Object.create(LR.Behaviour.prototype);
TutoManager.prototype.constructor = TutoManager;

TutoManager.prototype.create = function(_data){
	if(_data.player) this.player = _data.player.getBehaviour(Player);
	if( _data.background ){
		this.background = _data.background;
		this.background.entity.kill();
	}
	if( _data.button){
		this.button = _data.button;
		this.button.entity.kill();
	}
	if( _data.text){
		this.text = _data.text;
		this.text.entity.visible = false;
		this.textInitPos = new Phaser.Point( this.text.entity.cameraOffset.x,
											this.text.entity.cameraOffset.y);
	}
	if(_data.button_text){
		this.button_text = _data.button_text;
		this.button_text.entity.visible = false;
	}
}

TutoManager.prototype.launchTuto = function(_data){
	this.entity.visible = true;
	this.open = true;
	
	this.button.entity.revive(),
	this.background.entity.revive();
	this.button_text.entity.visible = true;

	this.currentTuto = LR.Entity.FindByName(this.entity, _data.name );
	if( this.currentTuto){
		this.currentTuto.visible = true;
		var mobile = LR.Entity.FindByName(this.currentTuto, "mobile");
		var desktop = LR.Entity.FindByName(this.currentTuto, "desktop");
		if( this.entity.game.device.desktop){
			desktop.visible = true;
			mobile.destroy();
		}else{			
			mobile.visible = true;
			desktop.destroy();
		}
	}
	this.player.freeze();

	this.text.entity.visible = true;

	//load tuto_text
	var loader = this.entity.game.load;
	loader.onFileComplete.add(this.onJsonLoaded, this);
	loader.onFileError.add(this.onJsonFailed, this);
	loader.json('tuto_text', "assets/data/tutos/"+_data.name+".json");
	loader.start();
}

TutoManager.prototype.closeTuto = function(){
	this.open = false;
	this.button.entity.kill();
	this.background.entity.kill();
	this.text.entity.visible = false;
	this.button_text.entity.visible = false;
	this.text.entity.text = "";
	if( this.currentTuto ){
		this.currentTuto.destroy();
		this.currentTuto = null;
	}
	this.player.unfreeze();
}

TutoManager.prototype.onJsonLoaded = function(){
	var json = this.entity.game.cache.getJSON("tuto_text");
	if( !this.entity.game.device.desktop && json.mobile != null)
		this.text.entity.text = json.mobile;
	else
		this.text.entity.text = json.text;
	this.text.entity.y = this.textInitPos.y - (this.text.entity.lines * this.text.entity.fontSize * 0.5);

	//remove signals event binds
	var loader = this.entity.game.load;
	loader.onFileComplete.remove(this.onJsonLoaded, this);
	loader.onFileError.remove(this.onJsonFailed, this);
}

TutoManager.prototype.onJsonFailed = function(){
	this.text.entity.text = "";
	//remove signals event binds
	var loader = this.entity.game.load;
	loader.onFileComplete.remove(this.onJsonLoaded, this);
	loader.onFileError.remove(this.onJsonFailed, this);
}

TutoManager.prototype.onCloseTuto = function() {
	if(this.open)
		this.closeTuto();
}
