(function(enyo) {

var animationDuration = 1000;

var addThenRemoveClass = function(who, className) {
	who.addClass(className);
	setTimeout(who.removeClass.bind(who, className), animationDuration);
};

var animatedShowHide = {
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			addThenRemoveClass(this, "animate-showing");
		};
	}),

	show: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			addThenRemoveClass(this, "animate-showing");
		};
	}),

	hide: enyo.inherit(function(sup) {
		return function() {
			addThenRemoveClass("animate-hiding");
			setTimeout(sup.bind(this, arguments), animationDuration);
		};
	}),

	//Note: this might be a really bad idea.
	destroy: enyo.inherit(function(sup) {
		return function() {
			this.addClass("animate-hiding");
			setTimeout(sup.bind(this, arguments), animationDuration);
		};
	})
};

enyo.setPath("mileage.AnimatedShowHideSupport", animatedShowHide);

})(enyo);
