"use strict";
//>>LREditor.Behaviour.name: BitmapNumber
//>>LREditor.Behaviour.params : {  }
var BitmapNumber = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
  this.units = null;
  this.deci = null;
  this.centi = null;
  this.numbers = new Array();
}

BitmapNumber.prototype = Object.create(LR.Behaviour.prototype);
BitmapNumber.prototype.constructor = BitmapNumber;

BitmapNumber.prototype.create = function( _data ){
	this.units = LR.Entity.FindByName(this.entity,"units");
  this.deci = LR.Entity.FindByName(this.entity,"deci");
  this.centi = LR.Entity.FindByName(this.entity,"centi");

  if(this.centi) this.numbers.push(this.centi);
  if(this.deci) this.numbers.push(this.deci);
  if(this.units) this.numbers.push(this.units);
}

BitmapNumber.prototype.setNumber = function(_number){
  if( typeof _number == "number")
    _number = _number.toString();
  var indexN = this.numbers.length-1;
  var i = _number.length -1 ; 
  while(i >= 0){
    this.numbers[indexN].frame = parseInt(_number[i]);
    indexN --;
    if( indexN < 0)
      break;
    i--;
  }
}