/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "usp.Bandejao",
	kind: "enyo.Application",
	view: "usp.BandejaoView"
});

enyo.ready(function () {
	new usp.Bandejao({name: "app"});
});
