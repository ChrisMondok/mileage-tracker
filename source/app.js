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
			{path: "add-maintenance", handler: "showAddFillUp", context: "owner"},
			{path: "manage-cars", handler: "showManageCars", context: "owner"},
		], defaultRoute: {path: "dashboard", handler: "showDashboard", context: "owner" }}
	],

	observers: {
		saveActiveCar: ['car']
	},

	saveActiveCar: function(was, car, property) {
		if(car)
			localStorage.setItem("active-car", car.get('carId'));
	},

	start: function() {
		this.inherited(arguments);

		var carCollection = new enyo.Collection({
			model: "mileage.Car"
		});

		this.set('cars', carCollection);

		var car = new mileage.Car({
			name: "Honda S2000"
		});

		carCollection.add(car);

		this.set('car', car);

		carCollection.add(new mileage.Car({
			name: "BMW 325i"
		}));
	},

	setActiveCar: function(car) {
		this.set('car', car);
	},

	removeCar: function(car) {
		this.cars.remove(car);
		if(this.get('car') == car)
			this.set('car', this.cars.at(0));
	},

	setView: function(ctor) {
		this.set("view", ctor);
		this.render();
	},

	showDashboard: function() {
		this.setView(this.createComponent({kind: "mileage.Dashboard"}));
	},

	showAddFillUp: function() {
		this.setView(this.createComponent({kind: "mileage.AddFillUp"}));
	},

	showAddMaintenance: function() {
		this.setView(this.createComponent({kind: "mileage.AddMaintenance"}));
	},

	showManageCars: function() {
		this.setView(this.createComponent({kind: "mileage.ManageCars"}));	
	},
});

enyo.ready(function () {

	if (['androidChrome', 'androidFirefox', 'android'].some(function(p) { return p in enyo.platform; })) {
		enyo.Scroller.prototype.strategyKind = 'ScrollStrategy';
	}

	new mileage.Application({name: "app"});
});
