enyo.kind({
	name: "mileage.Dashboard",
	classes: "dashboard flex-rows",

	bindings:[
		{from: "^app.car", to: ".$.mpgSummary.car"},
		{from: "^app.car", to: ".$.lastFillUp.car"},
		{from: "^app.car", to: ".$.hasACar.showing", kind: "enyo.BooleanBinding"},
		{from: "^app.car", to: ".$.doesNotHaveACar.showing", kind: "enyo.InvertBooleanBinding"},
		{from: "^app.car.name", to: ".$.carName.content"},
		{from: "^app.cars", to: ".$.carRepeater.collection"},
		{from: "^app.car.fillUps", to: ".$.lastFillUp.showing", transform: function(fillUps) {
			return fillUps.length > 1;
		}}
	],

	components:[
		{kind: "nomad.Toolbar", classes:"flex-columns", components:[
			{content: "☰", ontap: "toggleMenu"},
			{name: "carName", content:"Car Name"}
		]},
		{classes:"fill", components:[
			{kind: "enyo.Scroller", classes:"main-scroller enyo-fit", components:[
				{name: "hasACar", components:[
					{name: "mpgSummary", kind: "mileage.MPGSummary", tag: "section", ontap: "showFillUpLog"},
					{name: "lastFillUp", kind: "mileage.LastFillUpDisplay", tag: "section"},
					{kind: "mileage.MaintenanceSummary"},
					{name: "addFillUpButton", content: "Add Fill-Up", kind: "enyo.Button", ontap:"addFillUp"},
					{name: "addMaintenanceButton", content: "Perform Maintenance", kind: "enyo.Button"}
				]},
				{name: "doesNotHaveACar", tag: "section", classes:"warning", components:[
					{tag: "header", content:"No car selected"},
					{content: "Go to <a href=\"#manage-cars\">manage cars</a> to add one.", allowHtml: true}
				]}
			]},
			{name: "settingsSlider", kind: "enyo.Slideable", overMoving: false, classes:"enyo-fit settings-slider", value: -100, min: -100, max: 0, unit: "%", components:[
				{kind: "enyo.Scroller", classes: "scroller settings-panel", components:[
					{tag:"section", components:[
						{tag: "header", content: "Active Car"},
						{name: "carRepeater", kind: "nomad.DataSelect", components:[
							{bindings: [
								{from: ".model.name", to: ".content"},
								{from: ".model.carId", to: ".value"}
							]}
						]}
					]},
					{tag: "section", components:[
						{tag: "header", content:"Settings"},
						{content: "Maintenance Schedule", kind: "enyo.Button", ontap: "setUpMaintenance"},
						{content: "Manage Cars", kind: "enyo.Button", ontap: "manageCars"},
						{content: "Import Data", kind: "enyo.Button", ontap: "importData"}
					]}
				]}
			]}
		]}
	],

	addFillUp: function(inSender, inEvent) {
		window.location.hash = "add-fill-up";
		inEvent.preventDefault();
	},

	showFillUpLog: function(inSender, inEvent) {
		window.location.hash = "fill-up-log";
		return true;
	},

	toggleMenu: function() {
		if(this.$.settingsSlider.getValue() == this.$.settingsSlider.getMax())
			this.$.settingsSlider.animateToMin();
		else
			this.$.settingsSlider.animateToMax();
	},

	manageCars: function() {
		window.location.hash = "manage-cars";
	},

	importData: function() {
		window.location.hash = "import";
	},

	setUpMaintenance: function() {
		window.location.hash = "maintenance-setup/"+app.car.get("carId");
	}
});

enyo.kind({
	name: "mileage.LastFillUpDisplay",
	classes: "last-fill-up",

	bindings:[
		{from: ".car.fillUpsModifiedAt", to: ".fillUpsLastModified"},
		{from: ".enoughData", to: ".$.notEnoughData.showing", kind: "enyo.InvertBooleanBinding"},
		{from: ".enoughData", to: ".$.mpg.showing", kind: "enyo.BooleanBinding"},
		{from: ".mpg", to: ".$.mpg.content", transform: function(mpg) {
			return Math.round(mpg * 100)/100 + " MPG";
		}},
		{from: ".date", to: ".$.date.content", kind: "mileage.RelativeDateBinding"}
	],

	components:[
		{classes: "flex-columns", components:[
			{content: "Last fill-up", classes: "fill"},
			{name: "date"}
		]},
		{name: "notEnoughData", content: "Not enough data!"},
		{name: "mpg"}
	],

	fillUpsLastModifiedChanged: function() {
		var fillUps = this.get('car').get('fillUps');

		if(fillUps.length < 2) {
			this.set('enoughData', false);
			return;
		}

		this.set('enoughData', true);

		var ultimate = fillUps.at(fillUps.length - 1),
			penultimate = fillUps.at(fillUps.length - 2);

		this.set('mpg', (ultimate.get('odometer') - penultimate.get('odometer')) / ultimate.get('gallons'));

		this.set('date', ultimate.get('date'));
	}
});


enyo.kind({
	name: "mileage.MPGSummary",
	classes: "mpg-summary",

	bindings:[
		{from: ".car", to: ".$.mileageGraph.car"},
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
			{kind: "mileage.MileageGraph"}
		]}
	]
});

enyo.kind({
	name: "mileage.MaintenanceSummary",
	tag: "section",
	content: "Maintenance Summary goes here"
});
