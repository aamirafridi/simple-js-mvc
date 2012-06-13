/*
	Panel
	- Views are a visual representation of models that present a filtered view of their current state.
	- A view typically observes a model and is notified when the model changes, allowing the view to update itself accordingly.
	- Design pattern literature commonly refers to views as 'dumb' given that their knowledge of models and controllers in an application is limited.
	- This name shouldn't depend on the data you're loading, it should describe the layout e.g. wide/tall/double/single and the template column/panel/row/list/item
*/

function Panel() {
	this.el = document.createElement('div');
	
	this.init = function(options) {
		this.el.className = 'panel';
		this.load('Loading films');
		options.el.appendChild(this.el);
		this.dispatchEvent(Event.INIT);
	}
	
	this.load = function(value) {
		this.el.innerHTML = value;
		this.dispatchEvent(Event.LOAD);
	}
	
	EventDispatcher.call(this);
}
Panel.prototype = new EventDispatcher();