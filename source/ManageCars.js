enyo.kind({
	name: "mileage.ManageCars",
	classes: "flex-rows manage-cars",

	bindings:[
		{from: "^app.cars", to: ".$.carRepeater.collection"}
	],

	components:[
		{kind: "nomad.Toolbar", classes:"flex-columns", components:[
			{content:"Manage Cars"}
		]},
		{kind: "enyo.Scroller", classes: "main-scroller fill", components:[
			{name: "carRepeater", kind: "enyo.DataRepeater", components:[
				{kind: "mileage.CarDisplay", bindings:[ {from: ".model", to: ".car"}]}
			]},
			{kind: "enyo.Button", content: "Add Car", ontap: "addCar"}
		]}
	],

	addCar: function(inSender, inEvent) {
		app.cars.add(new mileage.Car());
		var newCarIndex = app.cars.get('length') - 1;
		var newCarSection = this.$.carRepeater.getChildForIndex(newCarIndex);

		newCarSection.$.carName.focus();
		this.$.scroller.scrollToBottom();
		inEvent.preventDefault();
	}
});

enyo.kind({
	name: "mileage.CarDisplay",
	tag: "section",

	published:{
		car: null
	},

	components:[
		{tag: "header", classes: "flex-columns", components:[
			{name: "carName", placeholder: "Unnamed Car", kind: "enyo.Input", classes: "fill"},
			{name: "deleteCarButton", content: "Delete", kind: "enyo.Button", classes: "danger", ontap: "deleteCar"}
		]},
		{name: "mpgSummary", kind: "mileage.MPGSummary"},
		{kind: "nomad.Label", components:[
			{content: "Initial Mileage"},
			{name: "initialMileageInput", kind: "nomad.Input", type: "number", min: "0", step: "any"}
		]}
	],

	bindings:[
		{from: ".car.name", to: ".$.carName.value", oneWay: false, kind: "enyo.InputBinding"},
		{from: ".car", to: ".$.activeCarRadio.car"},
		{from: ".car", to: ".$.mpgSummary.car"},
		{from: ".car.initialMileage", to: ".$.initialMileageInput.value", kind: "mileage.NumberBinding", oneWay: false},
		{from: ".car", to: ".$.deleteCarButton.car"}
	],

	deleteCar: function() {
		if(confirm("This action cannot be undone."))
			app.removeCar(this.getCar());
	}
});
