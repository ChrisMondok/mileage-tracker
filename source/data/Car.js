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

	includeKeys: ["fillUps", "name", "initialMileage"],

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
		carId:[],
		averageMPG:["fillUpsModifiedAt", "initialMileage", {cached: true}]
	},

	carId: function() {
		return this.euid;
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
		this.subscribeToCollection(this.get('fillUps'));
	},

	parse: function(data) {
		data.fillUps = this.store.createCollection("enyo.Collection", data.fillUps);
		data.fillUpsModifiedAt = new Date().getTime();
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
