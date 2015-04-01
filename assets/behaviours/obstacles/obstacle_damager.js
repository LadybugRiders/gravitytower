"use strict";
//>>LREditor.Behaviour.name: ObstacleDamager
//>>LREditor.Behaviour.params : { "right": false,"top":false,"bottom":true,"left":false,"forceVectorX":-150,"forceVectorY":-200,"enableForce":true,"forcePush":false}
var ObstacleDamager = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
	this.canDamage = true;
	this.rightDamage = false;
	this.leftDamage = false;
	this.topDamage = false;
	this.bottomDamage = false;
	this.forceVectorX = -100;
	this.forceVectorY = -200;
	//enable pushing when hit
	this.enableForce = true;
	//force pushing even if the player can't be hit (lose health)
	this.forcePush = true;
}

ObstacleDamager.prototype = Object.create(LR.Behaviour.prototype);
ObstacleDamager.prototype.constructor = ObstacleDamager;

ObstacleDamager.prototype.create = function(_data){
	if(_data.right == true) this.rightDamage = true;
	if(_data.left == true) this.leftDamage = true;
	if(_data.top == true) this.topDamage = true;
	if(_data.bottom == true) this.bottomDamage = true;
	if(_data.forceVectorX != null) this.forceVectorX = _data.forceVectorX;
	if(_data.forceVectorY != null) this.forceVectorY = _data.forceVectorY;
	if(_data.enableForce != null) this.enableForce = _data.enableForce;
}

ObstacleDamager.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	
	if(this.canDamage == true && _otherBody.go.layer == "player" && _otherShape.lr_name == "mainShape"){
		var side = LR.Utils.getCollisionSide(this.go,_myShape,_otherBody.go,_otherShape);
		if( side == null)
			return;
		var damage = false;

		switch(side){
			case(LR.Utils.BOTTOM) : if( this.bottomDamage ) damage = true;
				break;
			case(LR.Utils.RIGHT) : if( this.rightDamage ) damage = true;
				break;
			case(LR.Utils.LEFT) : if( this.leftDamage ) damage = true;
				break;
			case(LR.Utils.TOP) : if( this.topDamage ) damage = true;
				break;
		}
		var forceVector = null;
		if(this.enableForce)
			forceVector = new Phaser.Point(this.forceVectorX,this.forceVectorY)
		if( damage ){
			_otherBody.go.sendMessage("hit",{shape:_otherShape,
											sender:this.go,
											forceVector : forceVector,
											forcePush : this.forcePush
									});
		}
	}
}

ObstacleDamager.prototype.activateDamager = function(){
	this.canDamage = true;
}

ObstacleDamager.prototype.deactivateDamager = function(){	
	this.canDamage = false;
}