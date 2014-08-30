enyo.kind({
	name: "mileage.FillUpLog",
	classes: "fill-up-log flex-rows",

	bindings:[
		{from: "^app.car.fillUps", to: ".$.fillUpList.collection"}
	],

	components:[
		{kind: "nomad.Toolbar", classes:"flex-columns", style: "flex-shrink: 0", components:[
			{content:"Fill Ups"}
		]},
		{kind: "enyo.Scroller", classes: "fill", components:[
			{name: "fillUpList", classes:"fill-up-list", kind: "enyo.DataTable", components:[
				{kind: "mileage.FillUpDisplay"}
			]}
		]}
	]
});

enyo.kind({
	name: "mileage.FillUpDisplay",
	kind: "enyo.TableRow",
	classes: "fill-up-display",

	bindings:[
		{from: ".model.odometer", to: ".$.odometer.content", kind: "mileage.NumberBinding"},
		{from: ".model.gallons", to: ".$.gallons.content", kind: "mileage.NumberBinding"},
		{from: ".model.date", to: ".$.date.content", kind: "mileage.DateToLocaleDateStringBinding"}
	],

	components:[
		{components:[
			{name: "odometer", tag: "span"},
			{content: " miles", tag: "span"}
		]},
		{components:[
			{name: "gallons", tag: "span"},
			{content: " gallons", tag: "span"}
		]},
		{name: "date"}
	]
});
