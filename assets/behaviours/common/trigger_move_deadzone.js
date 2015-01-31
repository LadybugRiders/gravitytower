"use strict";

//>>LREditor.Behaviour.name: TriggerMoveDeadzone
//>>LREditor.Behaviour.params : {"messageObject" : {}, "otherNotified":null, "activeCountLimit": 0, "xDeadZone":0,"yDeadZone":0,"duration":1,"relative":false}

var TriggerMoveDeadzone = function(_gameobject){
	LR.Behaviour.Trigger.call(this,_gameobject);
	this.target = new Phaser.Point();
} 

TriggerMoveDeadzone.prototype = Object.create(LR.Behaviour.Trigger.prototype);
TriggerMoveDeadzone.prototype.constructor = TriggerMoveDeadzone;

TriggerMoveDeadzone.prototype.create = function(_data){
	if(_data.xDeadZone) this.xDeadZone = _data.xDeadZone;
	if(_data.yDeadZone) this.yDeadZone = _data.yDeadZone;
}

TriggerMoveDeadzone.prototype.onTriggered = function(_gameobject){
	if(this.xDeadZone != null){	
		var tween = this.entity.game.add.tween(this.entity.game.camera.deadzone);
		tween.to( {"x": this.xDeadZone}, this.duration , Phaser.Easing.Linear.None,true);
	}
	if(this.yDeadZone != null){	
		var tween = this.entity.game.add.tween(this.entity.game.camera.deadzone);
		tween.to( {"y": this.yDeadZone}, this.duration , Phaser.Easing.Linear.None,true);
	}
}