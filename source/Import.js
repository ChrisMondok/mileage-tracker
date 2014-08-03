enyo.kind({
	name: "mileage.Import",
	classes: "flex-rows import",

//	bindings:[
//		{from: "^app.cars", to: ".$.carRepeater.collection"}
//	],

	components:[
		{kind: "nomad.Toolbar", classes:"flex-columns", components:[
			{content:"Import Data"}
		]},
		{kind: "enyo.Scroller", classes: "fill", components:[
			{kind: "nomad.Form", onSubmit:"submit", components:[
				{kind: "nomad.Label", classes: "flex-columns", components:[
					{content: "Import from"},
					{name: "importSource", kind: "enyo.Select", classes: "fill", components:[
						{content: "Mileage Tracker", value: "importFromMileageTracker"},
						{content: "Mileage Monitor (webOS)", value: "importFromMileageMonitor"}
					]}
				]},
				{name: "importField", classes:"fill", kind: "enyo.TextArea", placeholder: "Paste data here..."},
				{name: "submitButton", content: "Import", kind: "nomad.SubmitButton"}
			]}
		]}
	],

	submit: function() {
		this[this.$.importSource.getValue()](this.$.importField.getValue());
	},

	importFromMileageMonitor: function(data) {
		var parsed = {};
		try {
			parsed = JSON.parse(data);
		}
		catch(e) {
			alert("Invalid data");
			return;
		}

		var cars = {}, car = undefined;

		parsed.vehicles.forEach(function(vehicle) {
			cars[vehicle.vehId] = {
				name: vehicle.name,
				initialMileage: vehicle.startingMileage,
				fillUps: []
			};
		});

		parsed.tanks.forEach(function(tank) {
			var fillUp = {
				date: new Date(tank.date),
				odometer: tank.mileage,
				gallons: tank.volume
			};
			cars[tank.vehId].fillUps.push(fillUp);
		});

		for(var i in cars) {
			cars[i].fillUps = cars[i].fillUps.sortBy("odometer");
			app.createCar(cars[i]);
		}

		app.saveCars();
	},

	importFromMileageTracker: function(data) {
		alert("Not implemented");
	}
});
