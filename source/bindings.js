enyo.kind({
	name: "mileage.DateToDateStringBinding",
	kind: "enyo.Binding",
	transform: function(value, direction, binding) {
		if(direction == "target") {
			var date = Date.create(value);
			if(!isNaN(date)) {
				return date;
			}
		}
		else {
			if(value && value instanceof Date)
				return value.format(Date.ISO8601_DATE);
		}
	}
});

enyo.kind({
	name: "mileage.DateToLocaleDateStringBinding",
	kind: "enyo.Binding",
	transform: function(value, direction, binding) {
		if(direction == "target") {
			var date = Date.create(value);
			if(!isNaN(date))
				return date;
		}
		else
		{
			if(value && value instanceof Date)
				return value.toLocaleDateString();
		}
	}
});

enyo.kind({
	name: "mileage.RelativeDateBinding",
	kind: "enyo.Binding",
	transform: function(value, direction, binding) {
		if(direction != "source")
			throw new Error("Relative date two-way-binding is not implemented.");
		return value && value.relative();
	}
});

enyo.kind({
	name: "mileage.NumberBinding",
	kind: "enyo.Binding",
	transform: function(value, direction, binding) {
		return Number(value);
	}
});

enyo.kind({
	name: "mileage.FixedNumberBinding",
	kind: "enyo.Binding",
	transform: function(value, direction, binding) {
		var number = Number(value);
		return number.format(this.digits || 2);
	}
});
