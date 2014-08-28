"use strict";

//>>LREditor.Behaviour.name: TutoManager
//>>LREditor.Behaviour.params : {"player":null, "background":null, "button":null}
var TutoManager = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.currentTuto = null;
	this.maxCharPerLine = 28;
	this.lines = 0;
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
	
	this.button.entity.revive(),
	this.background.entity.revive();
	this.button_text.entity.visible = true;

	this.currentTuto = LR.Entity.FindByName(this.entity, _data.name );
	if( this.currentTuto){
		this.currentTuto.visible = true;
		if( this.entity.game.device.desktop){
			LR.Entity.FindByName(this.currentTuto, "mobile").destroy();
		}else{
			LR.Entity.FindByName(this.currentTuto, "desktop").destroy();			
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
	this.button.entity.kill();
	this.background.entity.kill();
	this.text.entity.visible = false;
	this.button_text.entity.visible = false;
	if( this.currentTuto ){
		this.currentTuto.destroy();
		this.currentTuto = null;
	}
	this.player.unfreeze();
}

TutoManager.prototype.onJsonLoaded = function(){
	var json = this.entity.game.cache.getJSON("tuto_text");
	if( !this.entity.game.device.desktop && json.mobile != null)
		this.text.entity.text = this.wrapText(json.mobile);
	else
		this.text.entity.text = this.wrapText(json.text);
	this.text.entity.y = this.textInitPos.y - (this.lines * this.text.entity.fontSize * 0.5);
}

TutoManager.prototype.onJsonFailed = function(){
	this.text.entity.text = "";
}

TutoManager.prototype.wrapText = function(_string){
	var s = "";
	var array = _string.split(" ");
	var i=0;
	var count = 0;
	this.lines = 0;
	while( i< array.length ){
		var word = array[i] + " ";
		count += word.length;
		if( count >= this.maxCharPerLine ){
			count = 0;
			s += "\n";
			this.lines ++;
		}
		s+=word;
		i++;
	}
	return s;
}