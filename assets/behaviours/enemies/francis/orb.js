//>>LREditor.Behaviour.name : Francis.Orb
if(!Francis)
	var Francis = {};

Francis.Orb = function(_gameobject){
	LR.Behaviour.call(this, _gameobject);	
	this.player = null;
	this.hookPosition = new Phaser.Point();
	this.hookX = 45;
}
Francis.Orb.prototype = Object.create(Hanger.prototype);
Francis.Orb.prototype.constructor = Francis.Orb;

Francis.Orb.prototype.create = function(_data){
	this.mainBody = _data.mainBody.getBehaviour(Francis.MainBody);
}

Francis.Orb.prototype.hang = function(_player){
	this.player = _player;
	this.player.freeze();
	this.player.go.gravity = 0;

	this.hookPosition.x = this.entity.world.x + this.hookX;
	this.hookPosition.y = this.entity.world.y + 0 ;

	this.deltaVector = Phaser.Point.subtract(this.hookPosition,this.player.entity.world);
	this.distanceToHook = this.deltaVector.getMagnitude();

	this.mainBody.onOrbHit();
}

Francis.Orb.prototype.update = function(){
	if(this.player){
		var vec = this.deltaVector.normalize();

		this.hookPosition.x = this.entity.world.x + this.hookX;
		this.hookPosition.y = this.entity.world.y + 0 ;

		this.player.go.worldX = this.hookPosition.x - vec.x * this.distanceToHook;
	  	this.player.go.worldY = this.hookPosition.y - vec.y * this.distanceToHook;
	  	
	  	this.distanceToHook -= 20 * this.entity.game.time.elapsed * 0.01;
	  	if( this.distanceToHook <= 0)
	  		this.distanceToHook = 0;
	}
}

Francis.Orb.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
	if( this.player == null && _otherBody.go.layer == "player"){
		var playerHair = _otherBody.go.getBehaviour(PlayerHair);
		if( playerHair && playerHair.isShapeAndStatusBlade(_otherShape)){
			this.hang(playerHair.player);
		}
	}
}