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
