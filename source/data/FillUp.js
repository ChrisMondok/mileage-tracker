enyo.kind({
	name: "mileage.data.FillUp",
	kind: "enyo.Model",

	defaults:{
		date: undefined,
		odometer: undefined,
		gallons: undefined
	},

	parse: function(data) {
		if(data.date)
			data.date = new Date(data.date);
		return data;
	}
});
