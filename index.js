/* 
 * @Author: Dodik Gaghan
 * @Date:   2016-02-15 09:39:55
 * @Last Modified by:   Dodik Gaghan
 * @Last Modified time: 2016-02-16 09:45:40
 */

'use strict';

var Resource = require('deployd/lib/resource');
var Script = require('deployd/lib/script');
var util = require('util');

function EventResource() {
	Resource.apply(this, arguments);
}
util.inherits(EventResource, Resource);

EventResource.label = "Event";
EventResource.defaultPath = '/event';
EventResource.events = ["get", "post", "put", "delete"];
EventResource.prototype.clientGeneration = true;
EventResource.prototype.handle = function(ctx, next) {
	var result = {};
	var parts = ctx.url.split('/').filter(function(p) {
		return p;
	});
	var domain = {
		url: ctx.url,
		parts: parts,
		query: ctx.query,
		body: ctx.body,
		'this': result
	}

	domain.setResponse = function(val) {
		result = val;
	}

	if (ctx.method === "POST" && this.events.post) {
		this.events.post.run(ctx, domain, function(err) {
			ctx.done(err, result);
		});
	} else if (ctx.method === "GET" && this.events.get) {
		this.events.get.run(ctx, domain, function(err) {
			ctx.done(err, result);
		});
	}  else if (ctx.method === "PUT" && this.events.put) {
		this.events.put.run(ctx, domain, function(err) {
			ctx.done(err, result);
		});
	}  else if (ctx.method === "DELETE" && this.events.delete) {
		this.events.delete.run(ctx, domain, function(err) {
			ctx.done(err, result);
		});
	} else {
		next();
	}
}

module.exports = EventResource;
