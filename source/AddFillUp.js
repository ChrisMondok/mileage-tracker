enyo.kind({
	name: "mileage.AddFillUp",
	classes: "add-fill-up",

	bindings:[
		{kind: "mileage.DateToDateStringBinding", from: ".fillUp.date", to: ".$.dateInput.value", oneWay: false},
		{kind: "mileage.NumberBinding", from: ".$.odometerInput.value", to: ".fillUp.odometer", oneWay: false},
		{kind: "mileage.NumberBinding", from: ".$.fuelInput.value", to: ".fillUp.gallons", oneWay: false}
	],

	published: {
		fillUp: null
	},

	components:[
		{kind: "nomad.Toolbar", components:[
			{content: "Add Fill-Up"}
		]},
		{kind: "enyo.Scroller", classes: "scroller", components:[
			{kind: "nomad.Form", onSubmit:"submitForm", components:[
				{tag:"label", classes:"input-decorator flex-columns", components:[
					{name: "odometerInput", kind: "nomad.Input", placeholder: "Odometer reading", type: "number", required: true, min: 0, step: "any"},
					{content: "miles"}
				]},
				{tag:"label", classes:"input-decorator flex-columns", components:[
					{name: "fuelInput", kind: "nomad.Input", classes:"flex", placeholder: "Amount of fuel", type: "number", required: true, min: 0, step: "any"},
					{content: "gallons"}
				]},
				{tag: "label", classes:"input-decorator flex-columns", components: [
					{name: "dateInput", kind: "nomad.Input", type: "date", required: true},
					{content:"date"}
				]},
				{name: "submitButton", content: "Add", kind: "nomad.SubmitButton"}
			]}
		]}
	],

	create: function() {
		this.inherited(arguments);
		if(!this.getFillUp())
			this.setFillUp(enyo.store.createRecord("mileage.FillUp", {
				date: new Date()
			}));
	},

	submitForm: function() {
		app.car.addFillUp(this.fillUp);
		window.location.hash = "";
	}
});
