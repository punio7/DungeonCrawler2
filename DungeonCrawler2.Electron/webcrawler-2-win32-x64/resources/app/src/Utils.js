"use strict";

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] !== 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

if (!String.prototype.startWithUpper) {
    String.prototype.startWithUpper = function () {
        return this[0].toUpperCase() + this.slice(1);
    };
}

if (!String.prototype.isNumber) {
    String.prototype.isNumber = function () {
        return /^\d+$/.test(this);
    };
}