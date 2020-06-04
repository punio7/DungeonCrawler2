"use strict";
class RandomClass {
    nextInt(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }
}

var Random = new RandomClass();