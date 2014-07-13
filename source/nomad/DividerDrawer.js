enyo.kind({
	name: "nomad.DividerDrawer",

	published:{
		title: "",
		open: false
	},

	toggle: function() {
		this.setOpen(!this.getOpen());
	},

	//* @protected
	bindings:[
		{from: ".open", to: ".$.client.open", oneWay: false},
		{from: ".title", to: ".$.divider.title"}
	],
	
	tools:[
		{kind: "nomad.Divider", ontap: "toggle", components:[
			{kind:"enyo.Button", content:"V"}
		]},
		{name: "client", kind: "enyo.Drawer", classes: "drawer"}
	],

	openChanged: function() {
		this.$.button.addRemoveClass("active", this.open);
	},

	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	}
});
