//* @public
enyo.kind({
	name: "nomad.Form",
	tag: "form",
	
	handlers:{
		onsubmit: "submit"
	},

	//* @protected
	events: {
		onSubmit: ""
	},

	rendered: function() {
		this.inherited(arguments);
		if(this.hasNode())
			enyo.dispatcher.listen(this.node, "submit", this._doSubmit.bind(this));
	},

	_doSubmit: function(inEvent) {
		inEvent.preventDefault();
		this.doSubmit();
	}
});

//* @public
enyo.kind({
	name: "nomad.SubmitButton",
	kind: "enyo.Button",
	attributes: {
		type: "submit"
	}
});

enyo.kind({
	name: "nomad.Label",
	tag: "label",
	classes: "nomad-label",
	defaultKind: "nomad.LabelText"
});

enyo.kind({
	name: "nomad.LabelText",
	tag: null
});

(function() {
	var attrs = ["required", "min", "max", "step"];

	var inputBindings = attrs.map(function(a) {
		return {from: "."+a, to: ".attributes."+a};
	});

	enyo.kind({
		name: "nomad.Input",
		kind: "enyo.Input",
		bindings:inputBindings,

		observers:{
			updateAttributes: attrs
		},

		published: {
			required: false,
			min: undefined,
			max: undefined
		},

		create: function() {
			this.inherited(arguments);

			//TODO: remove this when updating to enyo 2.5.0
			attrs.forEach(function(a) {
				this.updateAttributes(undefined, this.get(a), a);
			}, this);
		},

		updateAttributes: function(was, is, attribute) {
			if(was !== is)
				this.setAttribute(attribute, is);
		}
	});

	enyo.dispatcher.listen(document, "submit");
})();
