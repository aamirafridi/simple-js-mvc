/*
	Utils
*/

var Utils = {
	getPos: function(obj) {
		// get the current position of an html element
		var x = y = 0;
		if (obj.offsetParent) {
			do {x += obj.offsetLeft;y += obj.offsetTop;}
			while (obj = obj.offsetParent);
			return {x: x, y: y};
		}
	},
	slugify: function(text) {
		return text.toLowerCase().replace(/[^-a-zA-Z0-9,&\s]+/ig, '').replace(/-/gi, '_').replace(/\s/gi, '-');
	},
	getHash: function() {
		return window.location.hash.split('/').splice(1);
	},
	setHash: function(values) {
		window.location.hash = '/'+values.join('/');
	},
	hasClass: function(ele,cls) {
		return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	},
	addClass: function(ele,cls) {
		if (!Utils.hasClass(ele,cls)) ele.className += " "+cls;
	},
	removeClass: function(ele,cls) {
		if (Utils.hasClass(ele,cls)) {
			var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
			ele.className=ele.className.replace(reg,' ');
		}
	},
	getStyle : function (el,styleProp) {
		if (el.currentStyle)
			var y = el.currentStyle[styleProp];
		else if (window.getComputedStyle)
			var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
		return y;
	},
	hitTest: function(o, l) {
		var a = arguments, j = a.length;
		j > 2 && (o = {offsetLeft: o, offsetTop: l, offsetWidth: j == 5 ? a[2] : 0,
		offsetHeight: j == 5 ? a[3] : 0, offsetParent: null}, l = a[j - 1]);
		for(var b, s, r = [], a = this.getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
		b = this.getOffset(l[--i]), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
		&& (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
		return j ? !!r.length : r;
	},
	getOffset: function(o) {
		for(var r = {l: o.offsetLeft, t: o.offsetTop, r: o.offsetWidth, b: o.offsetHeight};
			o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
		return r.r += r.l, r.b += r.t, r;
	},
	preventEvent: function(e) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) { e.stopPropagation(); }
		if (e.preventDefault) { e.preventDefault(); }
	}
}