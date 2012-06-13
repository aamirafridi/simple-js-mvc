/*
	LocalStore
	- Models manage the data for an application
	- They are concerned with neither the user-interface nor presentation layers but instead represent unique forms of data that an application may require
	- When a model changes (e.g when it is updated), it will typically notify its observers that a change has occurred so that they may react accordingly.
	- This name shouldn't be based on the data values, it should describe the data type e.g. json/xml/txt/csv  and the source e.g. live/local/websql/indexeddb/store
*/

function LocalStore() {
	var me = this;
	var loader = new Loader();
	var options = {};
	var data = [];
	
	this.load = function(values) {
		for (var item in values) { options[item] = values[item]; }
		loader.addEventListener(Event.COMPLETE, onLoaderComplete);
		loader.load(options);
	}
	
	this.create = function(items) {
		for (var i=0; i<items.length; ++i) {
			if (!items[i].slug) { items[i].slug = Utils.slugify(items[i].name || items[i].title || items[i].video.title); }
			data.push(items[i]);
		}
		this.dispatchEvent(Event.UPDATE, data);
	}
	
	this.read = function(value) {
		if (typeof value == 'number') { return data[value]; }
		else if (typeof value == 'string') { return find(value); }
		else { return data; }
	}
	
	this.readRange = function(start, end) {
		var items = [];
		for (var i=0; i<data.length; ++i) {
			if (i >= start && i <= end) { items.push(data[i]); }
		}
		return items;
	}

	this.update = function(items) {
		this.dispatchEvent(Event.UPDATE, data);
	}
	
	this.remove = function() {
		data = [];
		this.dispatchEvent(Event.REMOVE, data);
	}
	
	this.getTotal = function() {
		return data.length;
	}

	function find(slug) {
		for (var i=0; i<data.length; ++i) {
			if (data[i].slug == slug) { return data[i]; }
		}
		return false;
	}
	
	function onLoaderComplete(e) {
		me.create(e.data);
		me.dispatchEvent(Event.COMPLETE, data);
	}
	
	EventDispatcher.call(this);
}
LocalStore.prototype = new EventDispatcher();