"use strict";

//>>LREditor.Behaviour.name: Stomper
//>>LREditor.Behaviour.params : {"delay": 0.5,"delayBottom":1, "speed":50,"retractSpeed":30,"rope":null,"dust1":null,"dust2":null}

var Stomper = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	this.speed = 150;
	this.retractSpeed = 30;
	this.rope = null;
	this.delay = 1;
	this.delayBottom = 1;
	this.dusts = new Array();

	this.ropeOffset = new Phaser.Point();
	this.up = true;
	this.state = "retracted";
	this.launch();
}

Stomper.prototype = Object.create(LR.Behaviour);
Stomper.prototype.constructor = Stomper;

Stomper.prototype.create = function(_data){
	if(_data.speed != null) this.speed = _data.speed;
	if(_data.retractSpeed != null) this.retractSpeed = _data.retractSpeed;
	if(_data.rope != null) this.rope = _data.rope;
	if(_data.delay != null) this.delay = _data.delay;
	if(_data.delayBottom != null) this.delayBottom = _data.delayBottom;
	if(_data.dust1 != null) this.dusts.push(_data.dust1);
	if(_data.dust2 != null) this.dusts.push(_data.dust2);

	this.dusts.forEach(
    function(_element,_index){ _element.entity.visible = false; } );


	this.ropeOffset.x = this.rope.x - this.go.x;
	this.ropeOffset.y = this.rope.y - this.go.y;

	this.initPosY = this.entity.position.y;
}

Stomper.prototype.update = function(){
	if(this.entity.hidden){
		return;
	}
	if(this.rope){
		this.rope.x = this.go.x + this.ropeOffset.x;
		this.rope.y = this.go.y + this.ropeOffset.y;
	}

	if( this.state == "wait_bottom" || this.state == "retracted"){
	  	this.entity.body.velocity.y = 0;
	}

	if( this.state == "falling"){
	  	this.entity.body.velocity.y = this.speed;
	}	

	if( this.state == "retracting"){
	  	this.entity.body.velocity.y = -this.retractSpeed;
	  	
	  	if(this.entity.y <= this.initPosY){
	  		this.state = "retracted";
	  		this.launch();
	  	}
	}	
}

Stomper.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	
	if(_otherBody.go.layer == "player" && _otherShape.lr_name == "mainShape" && this.state == "falling"){
		var side = LR.Utils.getRectCollisionSide(this.go,_myShape,_otherBody.go,_otherShape);
		
		if( side == LR.Utils.BOTTOM ){
			_otherBody.go.sendMessage("hit",{shape:_otherShape,sender:this.go});
		}
	}
	if(_otherBody.go.layer == "ground" && this.state == "falling"){
		var myShapeData = LR.Utils.getRectShapeSides(this.go,_myShape);
		this.go.playSound("stomp");
		this.blowDust(myShapeData.bottom);
		this.entity.body.velocity.y = 0;
		this.state = "wait_bottom";
		this.entity.game.time.events.add(
	      Phaser.Timer.SECOND * this.delayBottom, 
	      function(){ this.state = "retracting";},
	      this);
	}
}

Stomper.prototype.launch = function(){
	this.entity.game.time.events.add(
	      Phaser.Timer.SECOND * this.delay, 
	      function(){ this.state = "falling";},
	      this);
}

Stomper.prototype.blowDust = function(_y){ 
	if(this.entity.hidden)
		return;
	this.dusts[0].entity.parent.y = this.go.y;
	this.dusts.forEach(
	    function(_element,_index){
		    _element.entity.visible = true;
		    var dir = _index == 0 ? -1 : 1;
		    _element.x = this.entity.x;
		    _element.entity.alpha = 1;
		    var tween = this.entity.game.add.tween(_element.entity);
		    tween.to( { "x" : this.entity.x + dir * 60,alpha:0},700);
		    tween.start();
	    },
	    this
	);
}

Stomper.prototype.onHide = function(){
	this.entity.body.velocity.y = 0;
	this.dusts.forEach(
    function(_element,_index){ _element.entity.visible = false; } );
}