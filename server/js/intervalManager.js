var Interval = require("./interval");

var intervalManager = function() {
	var timers = {};
	
	this.addTimer = function(uid, fn, time) {
        timers[uid] = new Interval(fn, time);
        timers[uid].start();
        console.log("addTimer "+this.length());
	};

    this.removeTimer = function(uid) {
        timers[uid].stop();
        delete timers[uid];
    }

    this.isRunning = function(uid) {
        return timers[uid].isRunning();
    }

    this.length = function() {
        return timers.length;
    }
}

module.exports = new intervalManager();