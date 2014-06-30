
enyo.kind({
	name: "usp.BandejaoView",
	kind: "FittableRows",
	fit: true,
	
	components:[
		{kind: "enyo.Panels", name: "views", fit: true, draggable: false, components: [
			{kind: "usp.TodayPanel", name: "todayView"},		
			{kind: "usp.WeekPanel", name: "weekView"},
			{kind: "usp.SettingsPanel", name: "settingsView", onSettingsChanged: "settingsChanged"},
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Hoje", ontap: "viewToday"},
			{kind: "onyx.Button", content: "Esta Semana", ontap: "viewWeekPopup"},
			{kind: "onyx.Button", content: "Configurações", ontap: "viewSettings"},
		]},
	],
	
	create: function () {
		this.inherited(arguments);
	},
	
		
	viewToday: function () {
		this.$.views.setIndex(0);
	},
	
	viewWeekPopup: function () {
		this.$.views.setIndex(1);
	},
	
	viewSettings: function () {
		this.$.views.setIndex(2);
	},
});
