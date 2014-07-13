/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "mileage.Application",
	kind: "enyo.Application",

	components:[
		{kind: "Router", useHistory: true, triggerOnStart: true, routes:[
			{path: "dashboard", handler: "showDashboard", context: "owner"},
			{path: "add-fill-up", handler: "showAddFillUp", context: "owner"},
			{path: "add-maintenance", handler: "showAddFillUp", context: "owner"}
		], defaultRoute: {path: "dashboard", handler: "showDashboard", context: "owner" }}
	],

	start: function() {
		console.log("Start");
		this.inherited(arguments);
	},

	create: function() {
		this.inherited(arguments);
		var carCollection = new enyo.Collection({
			model: "mileage.Car",
		});

		this.set('cars', carCollection);

		var car = new mileage.Car({
			name: "Honda S2000"
		});

		carCollection.add(car);

		this.set('car', this.createComponent({kind: "mileage.CarController", model: car}));

		carCollection.add(new mileage.Car({
			name: "BMW 325i"
		}));
	},

	setView: function(ctor) {
		this.set("view", ctor);
		this.render();
	},

	showDashboard: function() {
		this.setView(this.createComponent({kind:"mileage.Dashboard"}));
	},

	showAddFillUp: function() {
		this.setView(this.createComponent({kind:"mileage.AddFillUp"}));
	},

	showAddMaintenance: function() {
		this.setView(this.createComponent({kind:"mileage.AddMaintenance"}));
	}
});

enyo.ready(function () {

	if (['androidChrome', 'androidFirefox', 'android'].some(function(p) { return p in enyo.platform; })) {
		enyo.Scroller.prototype.strategyKind = 'ScrollStrategy';
	}

	new mileage.Application({name: "app"});
});
