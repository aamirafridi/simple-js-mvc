/*
	TopFilms
	- this is a wrapper class
	- technically a controller, it binds other controllers with window events instead of binding models and views together
*/

function TopFilms() {
	var filmlist = new FilmList();

	this.init = function(options) {
		filmlist.init(options.filmlist);
		this.dispatchEvent(Event.INIT);
	}

	EventDispatcher.call(this);
}
TopFilms.prototype = new EventDispatcher();