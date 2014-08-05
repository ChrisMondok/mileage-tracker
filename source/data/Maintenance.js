enyo.kind({
	name: "mileage.data.MaintenanceItem",
	kind: "enyo.Model",

	defaults: {
		name: "",
		mileInterval: null,
		timeInterval: null,
		timeUnit: "MONTHS"
	},

	includeKeys: ["name", "mileInterval", "timeInterval", "timeUnit"]
});

enyo.kind({
	name: "mileage.data.MaintenanceRecord",
	kind: "enyo.Model",

	defaults: {
		miles: null,
		date: null,
		maintenanceItemId: null,
		notes: null
	},

	includeKeys: ["miles", "date", "maintenanceItemId", "notes"]
});
