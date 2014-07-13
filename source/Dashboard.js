enyo.kind({
	name: "mileage.Dashboard",
	classes: "dashboard flex-rows",

	bindings:[
		{from: "^app.car", to: ".$.mpgSummary.car"},
		{from: "^app.cars", to: ".$.carRepeater.collection"}
	],

	components:[
		{kind: "nomad.Toolbar", classes:"flex-columns", components:[
			{content: "☰", ontap: "toggleMenu"},
			{content:"App Name"}
		]},
		{classes:"fill", components:[
			{kind: "enyo.Scroller", classes:"main-scroller enyo-fit", components:[
				{name: "mpgSummary", tag: "section", kind: "mileage.MPGSummary"},
				{kind: "mileage.MaintenanceSummary"},
				{content: "Add Fill-Up", kind: "enyo.Button", ontap:"addFillUp"},
				{content: "Perform Maintenance", kind: "enyo.Button"}
			]},
			{name: "settingsSlider", kind: "enyo.Slideable", classes:"enyo-fit settings-slider", value: -100, min: -100, max: 0, unit: "%", components:[
				{kind: "enyo.Scroller", classes: "scroller settings-panel", components:[
					{tag:"section", components:[
						{name: "carRepeater", kind: "nomad.DataSelect", components:[
							{bindings: [
								{from: ".model.name", to: ".content"},
								{from: ".model.carId", to: ".value"}
							]}
						]}
					]},
					{tag: "section", components:[
						{tag: "header", content:"Settings"},
						{content: "Maintenance Schedule", kind: "enyo.Button"},
						{content: "Manage Cars", kind: "enyo.Button", ontap: "manageCars"}
					]}
				]}
			]}
		]}
	],

	addFillUp: function(inSender, inEvent) {
		window.location.hash = "add-fill-up";
		inEvent.preventDefault();
	},

	toggleMenu: function() {
		if(this.$.settingsSlider.getValue() == this.$.settingsSlider.getMax())
			this.$.settingsSlider.animateToMin();
		else
			this.$.settingsSlider.animateToMax();
	},

	manageCars: function() {
		window.location.hash = "manage-cars";
	}
});

enyo.kind({
	name: "mileage.MPGSummary",
	classes: "mpg-summary",
	content:"MPG Summary",

	bindings:[
		{from: ".car.averageMPG", to: ".$.wholeNumberPart.content", transform: function(value) {
			var n = Number(value);
			if(isNaN(n))
				return 0;
			return Math.floor(n);
		}},
		{from: ".car.averageMPG", to: ".$.fractionPart.content", transform: function(value) {
			var n = Number(value);
			if(isNaN(n))
				return "0";
			var fraction = (n % 1).round(2).toString().split(".")[1];
			return fraction || "0";
		}}
	],

	components:[
		{classes: "overview", components:[
			{classes:"number", components:[
				{name: "wholeNumberPart", classes:"whole", tag:"span"},
				{tag:"span", content:"."},
				{name: "fractionPart", tag:"span"}
			]},
			{content:"MPG"}
		]},
		{classes: "graph", components:[
			{content:"A nice graph goes here"}
		]}
	]
});

enyo.kind({
	name: "mileage.MaintenanceSummary",
	tag: "section",
	content: "Maintenance Summary goes here"
});
