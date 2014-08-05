(function() {

	var collectionEventsWeCareAbout = ["add", "remove", "change"];

	enyo.kind({
		name: "mileage.data.Car",
		kind: "enyo.Model",

		defaultSource: "local",

		urlRoot: "local",
		url: "cars",
		primaryKey: "carId",

		createMaintenanceItem: function() {
			return this.get("maintenanceSchedule").createRecord();
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

		fillUpValuesChanged: function() {
			this.set("fillUpsModifiedAt", new Date());
			enyo.Signals.send("onCarValuesChanged");
		},

		maintenanceValuesChanged: function() {
			this.set("maintenanceModifiedAt", new Date());
			enyo.Signals.send("onCarValuesChanged");
		},

		computed: {
			averageMPG:["fillUpsModifiedAt", "initialMileage", {cached: true}]
		},

		fillUpsChanged: function(old, fillUps, path, options) {
			if(old)
				this.unsubscribeToCollection(old, fillUpValuesChanged);

			if(fillUps)
				this.subscribeToCollection(fillUps, fillUpValuesChanged);
		},

		maintenanceScheduleChanged: function(old, schedule, path, options) {
			if(old)
				this.unsubscribeToCollection(old, this.maintenanceValuesChanged);

			if(schedule)
				this.subscribeToCollection(schedule, this.maintenanceValuesChanged);
		},

		subscribeToCollection: function(collection, handler) {
			for(var i = 0; i < collectionEventsWeCareAbout.length; i++)
				collection.addListener(collectionEventsWeCareAbout[i], handler, this);
		},

		unsubscribeToCollection: function(collection, handler, context) {
			for(var i = 0; i < collectionEventsWeCareAbout.length; i++)
				collection.removeListener(collectionEventsWeCareAbout[i], handler, this);
		},

		constructor: function() {

			//ALWAYS run through parse.
			if(!arguments[0])
				arguments[0] = {};

			this.inherited(arguments);

			if(!this.get("carId"))
				this.set("carId", this.euid);

			this.subscribeToCollection(this.get("fillUps"), this.fillUpValuesChanged);
			this.subscribeToCollection(this.get("maintenanceSchedule"), this.maintenanceValuesChanged);
			this.subscribeToCollection(this.get("maintenanceRecords"), this.maintenanceValuesChanged);
		},

		parse: function(data) {
			var now = new Date();
			data.fillUps = this.store.createCollection("enyo.Collection", data.fillUps, {model: mileage.data.FillUp});
			data.fillUpsModifiedAt = now;
			
			data.maintenanceSchedule = this.store.createCollection("enyo.Collection", data.maintenanceSchedule, {model: mileage.data.MaintenanceItem});
			data.maintenanceRecords = this.store.createCollection("enyo.Collection", data.maintenanceRecords, {model: mileage.data.MaintenanceRecord}); 
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
