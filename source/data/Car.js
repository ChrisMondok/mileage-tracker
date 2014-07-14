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
		var averageMPG = undefined;

		var raw = this.get("fillUps").raw();
		if(raw.length) {
			var miles = Math.max.apply(Math, raw.map("odometer")) - this.get("initialMileage");
			var gallons = Number(raw.sum("gallons"));
			averageMPG = miles / gallons;
		}

		this.set("averageMPG", averageMPG);
	},

	observers: {
		computeAverageMPG: ["initialMileage"]
	},

	computed: {
		carId:[]
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
			this.computeAverageMPG();
		}
	},

	subscribeToCollection: function(collection) {
		for(var i = 0; i < collectionEventsToTriggerMPGCalculation.length; i++)
			collection.addListener(collectionEventsToTriggerMPGCalculation[i], this.computeAverageMPG, this);
	},

	unsubscribeToCollection: function(collection) {
		for(var i = 0; i < collectionEventsToTriggerMPGCalculation.length; i++)
			collection.removeListener(collectionEventsToTriggerMPGCalculation[i], this.computeAverageMPG, this);
	},

	constructor: function() {
		this.inherited(arguments);
		if(!("fillUps" in this.attributes))
			this.set("fillUps", new enyo.Collection({store: this.store, model: "mileage.data.FillUp"}));
		else {
			this.subscribeToCollection(this.get('fillUps'));
			this.computeAverageMPG();
		}
	},

	parse: function(data) {
		data.fillUps = this.store.createCollection("enyo.Collection", data.fillUps);
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
