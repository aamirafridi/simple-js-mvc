/*
	Loader
*/

function Loader() {
	var me = this;
	var data;
	this.options = {
		'type': 'json',
		'requesttype': 'GET',
		'url': ''
	};
	this.load = function(values) {
		this.options = Utils.merge(this.options, values);
		//console.log('Loader.load', this.options.url, values);
		this.options.completed = false;
		if (this.options.type == 'jsonp') { loadScript(); }
		else {
			try { var ajax = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');} catch(e) { me.dispatchEvent(Event.ERROR, e); }
			if (window.XDomainRequest && !sameOrigin(this.options.url)) { ajax = new XDomainRequest(); ajax.onload = function(e) { complete(this.responseText); }; }
			ajax.onerror = function(e) { me.dispatchEvent(Event.ERROR, e); };
			ajax.onprogress = function(e) { me.dispatchEvent(Event.PROGRESS, e); };
			ajax.onreadystatechange = function(e) { onchange(this); };
			this.addEventListener(Event.LOAD, function(e) { complete(ajax); }, ajax);
			if (this.options.type == 'image' && ajax.overrideMimeType) { ajax.overrideMimeType('text/plain; charset=x-user-defined'); }
			ajax.open(this.options.requesttype, this.options.url);
			if (this.options.requesttype == 'POST') { ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'); }
			ajax.send(joinParams(this.options.params));
		}
	}
	function joinParams(list) {
		var params = '';
		for (var item in list) {
			var value = list[item];
			if (typeof value == 'object') { value = JSON.stringify(value); }
			params += '&'+encodeURI(item)+'='+encodeURI(value);
		}
		if (params.length > 0) { params = params.substring(1); }
		return params;
	}
	function loadScript() {
		var random = Math.round(Math.random()*1000);
		window['callback'+random] = function(e) { complete({'responseText': e}); };
		var script = document.createElement('script');
		script.src = me.options.url+'&callback=window.callback'+random;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	function sameOrigin(url){ var split = url.split('/'); if (split[0]+'//' == window.location.protocol+'//') { if (split[2] != window.location.host) { return false; } else { return true; } } else { return true; } }
	function onchange(e) { if (e) {
			if (e.readyState == 4 && e.status == 200) { complete(e); }
			else if (e.readyState == 4 && e.status == 404){ me.dispatchEvent(Event.ERROR, e) };
		} }
	function parse(e) { try { return eval('('+e+')') || e; } catch(error) { return e; } }
	function complete(e) {
		if (me.options.completed == false) {
			me.options.completed = true;
			if (me.options.type == 'image' && window.XDomainRequest) { me.data = e.responseBody; }
			else {
				if (me.options.type == 'image') {
					var binary = '';
					for (var i=0; i<e.responseText.length; i++) { binary += String.fromCharCode(e.responseText.charCodeAt(i)&0xff); }
					me.data = binary;
				}
				else if (me.options.type == 'jsonp') { me.data = parse(e.responseText); }
				else if (typeof parse(e.responseText) == 'object') { me.data = parse(e.responseText); }
				else { me.data = e.responseText; }
			}
			me.dispatchEvent(Event.COMPLETE, me.data);	
		}
	}
	EventDispatcher.call(this);
}
Loader.prototype = new EventDispatcher();