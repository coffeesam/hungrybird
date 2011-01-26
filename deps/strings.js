String.prototype.stripSubdomain = function() { 
	return this.substr(this.indexOf(config.domainHost),this.length); 
};

String.prototype.subdomain = function() {
	return this.substr(0, this.indexOf("." + config.domainHost));
};
