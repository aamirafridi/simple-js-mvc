/*
	Loader
*/

function Loader() {
	var instance = this;
	var data;
	this.options = {
		'type': 'json',
		'requesttype': 'GET',
		'url': ''
	};
	this.load = function(data) {
		for (var item in data) {this.options[item] = data[item];}
		if (this.options.type == 'jsonp') { loadScript(); }
		else {
			try { var ajax = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');} catch(e) { instance.dispatchEvent(Event.ERROR, e); }
			if (window.XDomainRequest && !sameOrigin(this.options.url)) { ajax = new XDomainRequest(); ajax.onload = function(e) { complete(this.responseText); }; }
			ajax.onerror = function(e) { instance.dispatchEvent(Event.ERROR, e); };
			ajax.onprogress = function(e) { instance.dispatchEvent(Event.PROGRESS, e); };
			ajax.onreadystatechange = function(e) { onchange(this); };
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
		window.callback = function(e) { complete({'responseText': e}); };
		var script = document.createElement('script');
		script.src = instance.options.url+'&callback=window.callback';
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	function sameOrigin(url){ var split = url.split('/'); if (split[0]+'//' == window.location.protocol+'//') { if (split[2] != window.location.host) { return false; } else { return true; } } else { return true; } }
	function onchange(e) { if (e) {
			if (e.readyState == 4 && e.status == 200) { complete(e); }
			else if (e.readyState == 4 && e.status == 404){ instance.dispatchEvent(Event.ERROR, e) };
		} }
	function parse(e) { try { return eval('('+e+')') || e; } catch(error) { return e; } }
	function complete(e) {
		if (instance.options.type == 'image' && window.XDomainRequest) { instance.data = e.responseBody; }
		else {
			if (instance.options.type == 'image') {
				var binary = '';
				for (var i=0; i<e.responseText.length; i++) { binary += String.fromCharCode(e.responseText.charCodeAt(i)&0xff); }
				instance.data = binary;
			}
			else if (instance.options.type == 'jsonp') { instance.data = parse(e.responseText); }
			else if (typeof parse(e.responseText) == 'object') { instance.data = parse(e.responseText); }
			else { instance.data = e.responseText; }
		}
		instance.dispatchEvent(Event.COMPLETE, instance.data);
	}
	EventDispatcher.call(this);
}
Loader.prototype = new EventDispatcher();