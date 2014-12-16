"use strict";

//>>LREditor.Behaviour.name: HangerPulley
//>>LREditor.Behaviour.params : {"hookX" : 0, "hookY" : 0, "up":true, "target":null, "range" : 50 ,"speed" : 1, "retractSpeed" : 0.5}
var HangerPulley = function(_gameobject){
	Hanger.call(this,_gameobject);
	this.up = true;
	this.range = 50;
	this.target = null;
	this.state = "retracted";
}

HangerPulley.prototype = Object.create(Hanger.prototype);
HangerPulley.prototype.constructor = HangerPulley;

HangerPulley.prototype.create = function(_data){
	Hanger.prototype.create.call(this,_data);
	if( _data.up != null ) this.up = _data.up;
	if( _data.range != null ) this.range = _data.range;
	if( _data.target != null ) this.target = _data.target;
	if( _data.speed != null ) this.speed = _data.speed;
	if( _data.retractSpeed != null ) this.retractSpeed = _data.retractSpeed;

	this.initY = this.entity.parent.y;
	this.targetY = this.initY + (this.up?1:-1) * this.range;
}

HangerPulley.prototype.update = function(){
	if(this.player && this.released == false){
		this.player.go.x = this.entity.world.x + this.hookX ;
	  	this.player.go.y = this.entity.world.y + this.hookY ;

	  	if( this.state == "pulled"){
	  		//make the whole hanger group go up/down
		  	this.entity.parent.go.y += this.speed * (this.up?1:-1) * this.game.time.elapsed * 0.001;
		  	//make the target go the other direction
		  	this.target.y += this.speed * (this.up?-1:1) * this.game.time.elapsed * 0.001;

		  	if( ( this.up && this.entity.parent.go.y >= this.targetY) || 
		  		( !this.up && this.entity.parent.go.y <= this.targetY) ){
		  		this.entity.parent.go.y = this.targetY;
		  		this.state = "extended";		  		
		  	}
	  	}	  	
	}
	if( this.state == "retract"){
		//make the whole hanger group go up/down
	  	this.entity.parent.go.y += this.retractSpeed * (this.up?-1:1) * this.game.time.elapsed * 0.001;
	  	//make the target go the other direction
	  	this.target.y += this.retractSpeed * (this.up?1:-1) * this.game.time.elapsed * 0.001;
	  	if( ( this.up && this.entity.parent.go.y <= this.initY) || 
	  		( !this.up && this.entity.parent.go.y >= this.initY) ){
	  		this.entity.parent.go.y = this.initY;
	  		this.state = "retracted";		  		
	  	}
	}
}

HangerPulley.prototype.hang = function(){
	Hanger.prototype.hang.call(this);
	this.state = "pulled";
}

HangerPulley.prototype.release = function(){
	if( this.player ){
		//unhang the player
		this.player.onReleaseHang(this.formerGrav, null);	
		this.player = null;
		this.playerHair = null;
		this.released = true;
		this.state = "retract";
	}
}