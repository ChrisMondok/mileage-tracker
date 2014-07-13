enyo.kind({
	name: "mileage.Car",
	kind: "enyo.Model",

	addFillUp: function(f) {
		if(!(f instanceof mileage.FillUp))
			throw new TypeError("addFillUp requires a mileage.FillUp, but got a "+typeof(f));
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
		setUpListeners: ["fillUps"],
		computeAverageMPG: ["initialMileage"]
	},

	computed: {
		carId:[]
	},

	carId: function() {
		return this.euid;
	},

	setUpListeners: function(old, fillUps, path, options) {
		var events = ["add","remove","change"], i;
		if(old) {
			for(i = 0; i < events.length; i++)
				old.removeListener(events[i], this.computeAverageMPG, this);
		}

		if(fillUps) {
			for(i = 0; i < events.length; i++)
				fillUps.addListener(events[i], this.computeAverageMPG, this);
			this.computeAverageMPG();
		}
	},

	constructor: function() {
		this.inherited(arguments);
		if(!("fillUps" in this.attributes)) {
			this.set("fillUps", new enyo.Collection({store: this.store, model: "mileage.FillUp"}));
		}
	}
});

enyo.kind({
	name: "mileage.FillUp",
	kind: "enyo.Model",

	defaults:{
		date: undefined,
		odometer: undefined,
		gallons: undefined
	}
});

//TODO: what does this buy us?
enyo.kind({
	name: "mileage.CarController",
	kind: "enyo.ModelController"
});
