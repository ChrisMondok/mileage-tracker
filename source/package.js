enyo.setPath("mileage.Frequencies", {
	MONTHS:{name: "months"},
	DAYS:{name: "days"},
	WEEKS:{name: "weeks"},
	YEARS:{name: "years"}
});

enyo.depends(
	// Libraries
	"$lib/layout",
	"$lib/sugar.min.js",
	"style",

	"nomad",
	"data",

	"bindings.js",
	"mixins.js",

	"Dashboard.js",
	"AddFillUp.js",
	"AddMaintenance.js",
	"ManageCars.js",
	"MaintenanceSetup.js",

	"app.js"
);
