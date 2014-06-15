/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "usp.Menu",
	kind: "enyo.Collection",
	source: "jsonp",
	url: "https://query.yahooapis.com/v1/public/yql?q=use%20'https%3A%2F%2Fraw.githubusercontent.com%2Ftoshikurauchi%2Fusp-mobile-bandeco%2Fmaster%2Fusp.bandejao.xml'%3B%0Aselect%20*%20from%20usp.bandejao%20where%20bandejao%3D%22central%22%3B&format=json",
	
	published: {
		bandejao: "central",
		displayName: "Central"
	},
	
	bindings: [
		{from: ".bandejao", to: ".url", transform: function(val) {
			return "https://query.yahooapis.com/v1/public/yql?q=use%20'https%3A%2F%2Fraw.githubusercontent.com%2Ftoshikurauchi%2Fusp-mobile-bandeco%2Fmaster%2Fusp.bandejao.xml'%3B%0Aselect%20*%20from%20usp.bandejao%20where%20bandejao%3D%22" + val + "%22%3B&format=json";
		}},
	],	
	
	parse: function (data) {
		return data.query.results.cardapio.refeicao;
	},
});

enyo.kind({
	name: "usp.MenuDisplayDay",
	
	published: {
		meal: null
	},
	
	correctCase: function (s) {
		return s[0].toUpperCase() + s.substr(1).toLowerCase();
	},
	
	mealChanged: function (old) {
		// correct case
		var dia = this.meal.get('dia');
		this.meal.set('dia', this.correctCase(dia));
		var per = this.meal.get('periodo');
		per = per.replace('c', 'ç');
		this.meal.set('periodo', this.correctCase(per));
		
	},
	
	components: [
		{name: "day"},
		{name: "period"},
		{name: "food", allowHtml: true},
	],
	
	bindings: [
		{from: '.meal.dia', to: '.$.day.content'},
		{from: '.meal.periodo', to: '.$.period.content'},
		{from: '.meal.cardapio', to: '.$.food.content', transform: function (val) {
			if (Array.isArray(val.item) === false) {
				return this.correctCase(val.item); 
			} else {
				return val.item.join('<br>');
			}
		}},
	]
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
		{kind: "onyx.Toolbar",
		 layoutKind: "FittableColumnsLayout",
		 components: [
			{content: "USP-Mobile - Cardápios", fit: true},
			{kind: "onyx.Button", content: "Atualizar", ontap: "updateMenus"}, // trocar por icon button depois
		]},
		{kind: "onyx.PickerDecorator", components: [
			{style: "min-width: 150px"},
			{kind: "onyx.Picker", onSelect: "selectRestaurant", components: [
				{content: "Central", active: true},
				{content: "Física"},
				{content: "Química"},
				{content: "Prefeitura"},
				{content: "Doc?"},
				{content: "Enfermagem"},
				{content: "FSP"},
				{content: "Direito"},
			]},
		]},
		{kind: "enyo.FittableColumns", fit: true, components: [
			{kind: "onyx.Button", content: "<", ontap: "prevDay"},
			{kind: "enyo.Panels", name: "mealsPanel", fit: true, components: [
				{name: "emptyMenu", content: "Nenhum cardápio encontrado!."},
			]},
			{kind: "onyx.Button", content: ">", ontap: "nextDay"},
		]},
	],
	
	create: function () {
		this.inherited(arguments);
		//this.updateMenu();
		var i;
		for (i = 0; i < 12; i++) {
			this.$.mealsPanel.createComponent({kind: 'usp.MenuDisplayDay'});
		}
		var t = this;
		this.updateMenus({success: function (m) {
			t.set('menu', t.restaurants["Central"]);
		}});
		
	},
	
	nextDay: function (is, ievt) {
		if (this.$.mealsPanel.get('index') > 0) {
			this.$.mealsPanel.next();
		}
	},
	
	prevDay: function (is, evt) {
		if (this.$.mealsPanel.get('index') > 1) {
			this.$.mealsPanel.previous();
		}
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
							"Doc?": "doc",
							"Enfermagem": "enf",
							"FSP": "fsp",
							"Direito": "direito"};
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
					t.$.mealsPanel.setIndex(index);
					if (opts.success !== undefined) {
						opts.success(m);
					}
				}
			}});
		}
	},
	
	selectRestaurant: function (is, ievt) {
		this.set('menu', this.restaurants[is.get('selected').content]);
	},
});
