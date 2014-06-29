

enyo.kind({
	name: "usp.MenuCard",
	classes: "usp-card",
	
	published: {
		restaurant: "",
		menu: null,
	},
	
	components: [
		{name: 'restaurantDisplay', content: ""},
		{tag: 'hr'},
		{tag: 'div', name: 'dinner', classes: "usp-card-right", content: "Jantar", allowHtml: true},
		{tag: 'div', name: 'lunch', classes: "usp-card-left", content: "Almoço", allowHtml: true},
	],

	bindings: [
		{from: '.restaurant', to: '.$.restaurantDisplay.content'},
		{from: '.menu', to: '.$.dinner.content', transform: function (val) {
			var today = (new Date().getDay() + 6) % 7;
			if (today < 6) {
				today = 2 * today + 1;
			} else {
				return 'Fechado'
			}
			
			if (val.length > today) {
				var today_menu = val.at(today).get('cardapio').item;
				if (Array.isArray(today_menu) == false) {
					return today_menu;
				} else {
					return today_menu.join('<br>');
				}	
			} else {
				return 'Fechado';
			}
		}},
		{from: '.menu', to: '.$.lunch.content', transform: function (val) {
			var today = (new Date().getDay() + 6) % 7;
			if (today < 6) {
				today = 2 * today;
			} else {
				today += 5;
			}
			if (val.length > today) {
				var today_menu = val.at(today).get('cardapio').item;
				if (Array.isArray(today_menu) == false) {
					return today_menu;
				} else {
					return today_menu.join('<br>');
				}	
			} else {
				return 'Fechado';
			}
			
		}},
	],
})

enyo.kind({
	name: "usp.TodayPanel",
	kind: "FittableRows",
	fit: true,
	classes: "",
	
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{name: "day"},
		]},
		
		{kind: "enyo.Scroller", vertical: "scroll", fit: true, components: [
			{name: "cards", kind: "FittableRows", components: [
				
			]},
		]},
		{kind: "Signals", onMenuLoaded: "reloadCards"},
		{kind: "Signals", onSettingsChanged: "reloadCards"},
	],
	
	create: function() {
		this.inherited(arguments);
		var d = new Date();
		var days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
		this.$.day.set('content', days[d.getDay()]);
	},
	
	reloadCards: function (sender, config) {
		this.$.cards.destroyComponents();
		var i;
		var order = this.get('app').$.controller.get('settings').get('order');
		var rest = this.get('app').$.controller.get('restaurants');
		for (i = 0; i < order.length; i++) {
			if (order[i].show) {
				this.$.cards.createComponent({
					kind: "usp.MenuCard",
					name: order[i].displayName,
					restaurant: order[i].displayName,
					menu: rest[order[i].key]
				});
			}
		}
		this.render();
	},
});