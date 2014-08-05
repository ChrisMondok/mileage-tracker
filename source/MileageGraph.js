(function() {
	var calculateMileage = function(from, to) {
		return (to.odometer - from.odometer) / to.gallons;
	};

	enyo.kind({
		name: "mileage.MileageGraph",
		//TODO: figure what (if not all) of this crap can go in less
		classes: "mileage-graph",

		published:{
			car: null
		},

		bindings:[
			{from: ".min", to: ".$.min.content"},
			{from: ".max", to: ".$.max.content"}
		],

		components:[ 
			{name: "min", classes: "min"},
			{name: "max", classes: "max"},
			{name: "canvas-container", classes: "canvas-container", components:[
				{name: "canvas", tag: "canvas", attributes:{height: 1, width: 1}}
			]}
		],

		rendered: function() {
			this.inherited(arguments);
			this.updateCanvasBounds();
			this.ctx = this.$.canvas.hasNode() && this.$.canvas.node.getContext('2d');
			this.drawCanvas();
		},

		carChanged: function() {
			this.computeMileages();
		},

		resizeHandler: function() {
			this.inherited(arguments);
			this.updateCanvasBounds();
			this.drawCanvas();
		},

		updateCanvasBounds: function() {
			var bounds = this.$.canvas.getBounds();
			var ratio = window.devicePixelRatio || 1;
			this.$.canvas.setAttributes({width: bounds.width * ratio, height: bounds.height * ratio});
		},

		mileagesChanged: function() {
			console.log("Mileages changed");
			this.drawCanvas();
		},

		drawCanvas: function() {
			console.log("Draw canvas");
			var car = this.get('car'), mileages = this.get('mileages'), ctx = this.ctx;
			if(!car || !mileages || !mileages.length || !ctx)
				return;

			var fillUps = car.get('fillUps');
			if(!fillUps || fillUps.length < 2)
				return;

			var width = this.getBounds().width * (window.devicePixelRatio || 1);
			var height = this.getBounds().height * (window.devicePixelRatio || 1);

			ctx.clearRect(0, 0, width, height);

			ctx.beginPath();
			mileages.forEach(function(m, i) {
				ctx.lineTo(width * m.x, height - m.y*height);
			});
			ctx.stroke();
		},

		computeMileages: function() {
			var car = this.get('car'), fillUps = null;
			var mileages = [];

			if(car)
				fillUps = car.get('fillUps');

			if(fillUps && fillUps.length > 1) {
				var raw = fillUps.raw().sortBy('date');
				var earliest = raw[0].date.getTime();
				var timeSpan = raw[raw.length - 1].date.getTime() - earliest;

				for(var i = 1; i < raw.length; i++) {
					var mpg = calculateMileage(raw[i-1], raw[i]);
					mileages[i-1] = {mpg: mpg, x: (raw[i].date.getTime() - earliest) / timeSpan};
				}
			}

			var mpgs = mileages.map('mpg');
			var min = Math.floor(mpgs.min());
			var max = Math.ceil(mpgs.max());

			this.set('min', min);
			this.set('max', max);

			mileages.map(function(m) {
				m.y = (m.mpg - min) / (max - min);
			});

			this.set('mileages', mileages);
		}
	});
})();
