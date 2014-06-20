/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

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
		{name: 'dinner', classes: "usp-card-right", content: "Jantar", allowHtml: true},
		{name: 'lunch', classes: "usp-card-left", content: "Almoço", allowHtml: true},
	],

	bindings: [
		{from: '.restaurant', to: '.$.restaurantDisplay.content'},
		{from: '.menu', to: '.$.dinner.content', transform: function (val) {
			var today = (new Date().getDay() + 6) % 7;
			if (today < 6) {
				today = 2 * today + 1;
			} else {
				today += 5;
			}
			var today_menu = val.at(today).get('cardapio').item;
			if (Array.isArray(today_menu) == false) {
				return today_menu;
			} else {
				return today_menu.join('<br>');
			}
		}},
		{from: '.menu', to: '.$.lunch.content', transform: function (val) {
			var today = (new Date().getDay() + 6) % 7;
			if (today < 6) {
				today = 2 * today;
			} else {
				today += 5;
			}
			var today_menu = val.at(today).get('cardapio').item;
			if (Array.isArray(today_menu) == false) {
				return today_menu;
			} else {
				return today_menu.join('<br>');
			}	
		}},
	],
})

enyo.kind({
	name: "usp.TodayPanel",
	kind: "FittableRows",
	fit: true,
	classes: "",
	
	published: {
		restaurants: null,
	},
	
	components: [
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{name: "day"},
		]},
		
		{kind: "enyo.Scroller", vertical: "scroll", fit: true, components: [
			{name: "cards", kind: "FittableRows", components: [
				
			]},
		]},
	],
	
	bindings: [
		
	],
	
	create: function() {
		this.inherited(arguments);
		var d = new Date();
		var days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
		this.$.day.set('content', days[d.getDay()]);
	},
	
	restaurantsChanged: function (old) {
		var k = Object.keys(this.restaurants);
		console.log(this.restaurants);
		console.log(k);
		var i;
		for (i = 0; i < k.length; i++) {
			this.$.cards.createComponent({
				kind: "usp.MenuCard",
				restaurant: k[i],
				menu: this.restaurants[k[i]],
			});
		}
		this.render();
	},
});

enyo.kind({
	name: "usp.BandejaoView",
	kind: "FittableRows",
	fit: true,
	
	published: {
		menu: null,
	},
	
	restaurants: {},
	
	components:[
		{kind: "enyo.Panels", name: "views", fit: true, draggable: false, components: [
			{kind: "usp.TodayPanel", name: "todayView"},		
			{kind: "usp.WeekPanel", name: "weekView"},
		]},		
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Today", ontap: "viewToday"},
			{kind: "onyx.Button", content: "Week", ontap: "viewWeekPopup"}
		]}
	],
	
	create: function () {
		this.inherited(arguments);
		var t = this;
		this.updateMenus({success: function (m) {
			t.$.weekView.set('restaurants', t.restaurants);
			t.$.todayView.set('restaurants', t.restaurants);
		}});
		
	},
	
	menuChanged: function (old) {
		var i;
		for (i = 0; i < this.menu.length; i++) {
			this.$.mealsPanel.getComponents()[i+1].set('meal', this.menu.at(i));
		}
	},
	
	updateMenus: function (opts) {
		var restaurantes = {"Central": "central",
							"Física": "fisica",
							"Química": "quimica",
							"Prefeitura": "pusp",
							//"Doc?": "doc",
							//"Enfermagem": "enf",
							//"FSP": "fsp",
							//"Direito": "direito"
							};
		var keys = Object.keys(restaurantes);
		var loaded = 0;
		var t = this;
		for (i = 0; i < keys.length; i++) {
			var menu = new usp.Menu();
			menu.set('bandejao', restaurantes[keys[i]]);
			menu.set('displayName', keys[i]);
			
			menu.fetch({success: function (m) {
				t.restaurants[m.get('displayName')] = m;
				loaded++;
				if (loaded == keys.length) {
					var today = new Date();
					var dw = today.getDay();
					var index = (dw - 1 + 7) % 7;
					if (index > 5) {
						index += 10;
					} else {
						index = index * 2;
					}
					index++;
					//t.$.mealsPanel.setIndex(index);
					if (opts.success !== undefined) {
						opts.success(m);
					}
				}
			}});
		}
	},
	
	viewToday: function () {
		this.$.views.setIndex(0);
	},
	
	viewWeekPopup: function () {
		this.$.views.setIndex(1);
	},
});
