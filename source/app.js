/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "mileage.Application",
	kind: "enyo.Application",

	components:[
		{kind: "Router", useHistory: true, triggerOnStart: false, routes:[
			{path: "dashboard", handler: "showDashboard", context: "owner"},
			{path: "add-fill-up", handler: "showAddFillUp", context: "owner"},
			{path: "add-maintenance", handler: "showAddFillUp", context: "owner"},
			{path: "manage-cars", handler: "showManageCars", context: "owner"},
			{path: "maintenance-setup", handler: "showMaintenanceSetup", context: "owner"},
			{path: "maintenance-setup/:carId", handler: "showMaintenanceSetup", context: "owner"},
			{path: "import", handler: "showImport", context: "owner"},
		], defaultRoute: {path: "dashboard", handler: "showDashboard", context: "owner" }},
		{kind: "enyo.Signals", onCarValuesChanged: "saveEventually"}
	],

	saveEventually: function() {
		this.startJob("saveCarsEventually", "saveCars", 1000);
	},

	observers: {
		saveActiveCar: ['car']
	},

	saveActiveCar: function(was, car, property) {
		if(car)
			localStorage.setItem("active-car", car.get('carId'));
	},

	start: function() {
		this.inherited(arguments);

		enyo.store.addSources({local: new mileage.data.LocalStorageSource});

		this.loadCars();
		console.log("Cars loaded");

		this.$.router.trigger();
	},

	setActiveCar: function(car) {
		this.set('car', car);
	},

	createCar: function(data) {
		var newCar = this.get('cars').createRecord(data);
		if(!this.get('car'))
			this.set('car', newCar);
		return newCar;
	},

	removeCar: function(car) {
		this.cars.remove(car);
		if(this.get('car') == car)
			this.set('car', this.cars.at(0));
	},

	saveCars: function() {
		localStorage.setItem('cars', this.get('cars').toJSON());
	},

	loadCars: function() {
		var loaded = localStorage.getItem('cars');
		if(loaded)
			this.set('cars', enyo.store.createCollection("mileage.data.CarCollection", JSON.parse(loaded)));
		else
			this.set('cars', enyo.store.createCollection("mileage.data.CarCollection"));
	},

	carsChanged: function(was, cars) {
		console.log("Setting app car");
		this.set('car', cars.at(0));
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

	showMaintenanceSetup: function(carId) {
		var car = enyo.store.findLocal("mileage.data.Car", {carId: carId});
		this.setView(this.createComponent({kind: "mileage.MaintenanceSetup", car: car}));
	},

	showImport: function() {
		this.setView(this.createComponent({kind: "mileage.Import"}));
	}
});

enyo.ready(function () {

	if (['androidChrome', 'androidFirefox', 'android'].some(function(p) { return p in enyo.platform; })) {
		enyo.Scroller.prototype.strategyKind = 'ScrollStrategy';
	}

	new mileage.Application({name: "app"});
});
