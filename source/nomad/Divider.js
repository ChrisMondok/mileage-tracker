enyo.kind({
	name: "nomad.Divider",
	kind: "FittableColumns",

	classes: "divider",

	published:{
		title: ""
	},

	//* @protected
	bindings: [
		{from: ".title", to: ".$.title.content"}
	],

	tools:[
		{tag: "hr", classes:"stub"},
		{name: "title", content:""},
		{tag: "hr", classes:"divider", fit: true},
		{name: "client", content:"RIGHT"}
	],

	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	}

});
