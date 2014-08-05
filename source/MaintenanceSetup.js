enyo.kind({
	name: "mileage.MaintenanceSetup",
	classes: "maintenance-setup",

	published: {
		car: null
	},

	bindings:[
		{from: ".car.name", to: ".$.pageHeader.content", transform: function(name) {return "For "+name;}},
		{from: ".car.maintenanceSchedule", to: ".$.maintenanceItemRepeater.collection"}
	],

	components:[
		{kind: "nomad.Toolbar", components:[
			{content: "Maintenance Schedule"}
		]},
		{kind: "enyo.Scroller", classes: "main-scroller", components:[
			{tag: "header", name: "pageHeader"},
			{name: "maintenanceItemRepeater", kind: "enyo.DataRepeater", components:[
				{kind: "mileage.MaintenanceItemView", bindings:[ {from: ".model", to: ".maintenanceItem"}]}
			]},
			{kind: "enyo.Button", content: "Add Maintenance Item", ontap: "createMaintenanceItem"}
		]}
	],

	createMaintenanceItem: function(sender, inEvent) {
		var car = this.getCar();
		car.createMaintenanceItem();

		var itemIndex = car.get('maintenanceSchedule').get('length') - 1;
		var newSection = this.$.maintenanceItemRepeater.getChildForIndex(itemIndex);

		newSection.$.name.focus();
		this.$.scroller.scrollToBottom();
		inEvent.preventDefault();
	}
});

enyo.kind({
	name: "mileage.MaintenanceItemView",
	tag: "section",

	published: {
		maintenanceItem: null
	},

	bindings: [
		{from: ".maintenanceItem.name", to: ".$.name.value", oneWay: false},
		{from: ".maintenanceItem.mileInterval", to: ".$.milesInput.value", oneWay: false},
		{from: ".maintenanceItem.timeInterval", to: ".$.timeInput.value", oneWay: false},

		//can't bind to selects? what is this‽
		{from: ".maintenanceItem.timeUnit", to: ".frequency", oneWay: false},
		{from: ".$.frequencySelect.value", to: ".frequency"}
	],

	frequencyChanged: function(old, frequency) {
		if(frequency) {
			var cmps = this.$.frequencySelect.getComponents();
			var values = cmps.map('value');
			if(this.$.frequencySelect.hasNode())
				this.$.frequencySelect.setSelected(values.indexOf(frequency));
			else
				cmps[values.indexOf(frequency)].setSelected(true);
		}
	},

	components:[
		{tag: "header", components:[
			{name: "name", kind: "enyo.Input", classes: "fill"},
			{kind: "enyo.Button", classes:"danger", content: "Delete", ontap: "deleteItem", attributes:{tabIndex:-1}}
		]},
		{content: "Due every"},
		{tag:"label", classes:"input-decorator flex-columns", components:[
			{name: "milesInput", kind: "nomad.Input", type: "number", required: false, min: 1, step: 1},
			{content: "miles"}
		]},
		{classes:"input-decorator flex-columns", components:[
			{name: "timeInput", kind: "nomad.Input", type: "number", required: false, min: 0, step: "any"},
			{name: "frequencySelect", kind: "enyo.Select"}
		]}
	],

	create: function() {
		this.inherited(arguments);
		var frequencySelect = this.$.frequencySelect;
		Object.keys(mileage.Frequencies, function(k) {
			frequencySelect.createComponent({
				content: mileage.Frequencies[k].name,
				value: k
			});
		});
	},

	deleteItem: function() {
		this.get("maintenanceItem").destroy();
	}
});
