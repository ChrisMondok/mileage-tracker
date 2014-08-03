(function() {

var collectionEventsToTriggerMPGCalculation = ["add", "remove", "change"];

enyo.kind({
	name: "mileage.data.Car",
	kind: "enyo.Model",

	defaultSource: "local",

	urlRoot: "local",
	url: "cars",
	primaryKey: "carId",

	events:{
		onCarChanged:""
	},

	createMaintenanceItem: function() {
		return this.get('maintenanceSchedule').createRecord();
	},

	includeKeys: ["fillUps", "name", "initialMileage", "maintenanceSchedule", "carId"],

	addFillUp: function(f) {
		this.get("fillUps").add(f);
	},

	defaults: {
		initialMileage: 0
	},

	mixins: [
		enyo.ComputedSupport
	],

	computeAverageMPG: function() {
	},

	averageMPG: function() {
		console.log("Computing Average MPG");
		var averageMPG = undefined;

		var raw = this.get("fillUps").raw();
		if(raw.length) {
			var miles = Math.max.apply(Math, raw.map("odometer")) - this.get("initialMileage");
			var gallons = Number(raw.sum("gallons"));
			averageMPG = miles / gallons;
		}

		return averageMPG;
	},

	valuesChanged: function() {
		this.set("fillUpsModifiedAt", new Date().getTime());
		enyo.Signals.send("onCarValuesChanged");
	},

	computed: {
		averageMPG:["fillUpsModifiedAt", "initialMileage", {cached: true}]
	},

	fillUpsChanged: function(old, fillUps, path, options) {
		if(old) {
			unsubscribeToCollection(old);
		}

		if(fillUps) {
			this.subscribeToCollection(fillUps);
		}
	},

	subscribeToCollection: function(collection) {
		for(var i = 0; i < collectionEventsToTriggerMPGCalculation.length; i++)
			collection.addListener(collectionEventsToTriggerMPGCalculation[i], this.valuesChanged, this);
	},

	unsubscribeToCollection: function(collection) {
		for(var i = 0; i < collectionEventsToTriggerMPGCalculation.length; i++)
			collection.removeListener(collectionEventsToTriggerMPGCalculation[i], this.valuesChanged, this);
	},

	constructor: function() {

		//ALWAYS run through parse.
		if(!arguments[0])
			arguments[0] = {};

		this.inherited(arguments);

		if(!this.get('carId'))
			this.set('carId', this.euid);

		this.subscribeToCollection(this.get('fillUps'));
	},

	parse: function(data) {
		var now = new Date().getTime();
		data.fillUps = this.store.createCollection("enyo.Collection", data.fillUps, {model: mileage.data.FillUp});
		data.fillUpsModifiedAt = now;
		
		data.maintenanceSchedule = this.store.createCollection("enyo.Collection", data.maintenanceSchedule, {model: mileage.data.MaintenanceItem});
		data.maintenanceModifiedAt = now;
		return data;
	}
});

enyo.kind({
	name: "mileage.data.CarCollection",
	kind: "enyo.Collection", 
	model: "mileage.data.Car",
	defaultSource: "local"
});

})();
