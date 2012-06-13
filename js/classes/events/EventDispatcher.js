/*
	EventDispatcher
*/

function EventDispatcher() {
	var events = {};
	this.addEventListener = function(event, callback) {
		if (event == undefined || callback == undefined) { return false; }
		var listeners = events[event] = events[event] || [];
		listeners[listeners.length] = callback;
	}
	this.removeEventListener = function(event, callback){
		if (event == undefined) { return false; }
		var listeners = events[event];
		if (listeners) {
			if (callback) { for (var i = listeners.length-1; i>=0; --i){ if (listeners[i] === callback) { listeners.splice( i, 1 ); return true; } } }
			else { delete events[event]; }
		}
		return false;
	}
	this.dispatchEvent = function(event, data) {
		if (event == undefined) { return false; }
		if (events[event]) { var listeners = events[event], len = listeners.length; while (len--) { listeners[len]({ data: data, target: this, type: event}); } }
	}
	this.getEvents = function() {
		return events;
	}
}