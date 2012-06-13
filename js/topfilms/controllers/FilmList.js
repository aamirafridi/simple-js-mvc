/*
	FilmList
	- Controllers are an intermediary between models and views which are classically responsible for two tasks
	- they both update the view when the model changes
	- they update the model when the user manipulates the view.
	- This name is exact and specific to the data and the view combined e.g. FilmPanel/TweetList/VideoColumn/ImageItem
*/

function FilmList() {
	var view = new Panel();
	var model = new LocalStore();
	var num = 0;
	
	this.init = function(options) {
		view.init(options.view);
		view.el.onclick = onClick;
		
		model.addEventListener(Event.COMPLETE, onModel);
		model.load(options.model);

		this.dispatchEvent(Event.LOAD);
	}
	
	function onClick(e) {
		if (num < model.getTotal()-1) { num += 1; }
		else { num = 0; }
		view.load(model.read(num).title);
	}

	function onModel(e) {
		view.load(model.read(num).title);
	}
	
	EventDispatcher.call(this);
}
FilmList.prototype = new EventDispatcher();