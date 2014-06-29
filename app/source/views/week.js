

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
	name: "usp.WeekPanel",
	kind: "FittableRows",
	fit: true,
	
	published: {
		restaurants: null,
		active: null
	},
	
	components: [
		{kind: "onyx.Toolbar",
		 layoutKind: "FittableColumnsLayout",
		 components: [
			{kind: "onyx.PickerDecorator", components: [
			{style: "min-width: 150px"},
			{kind: "onyx.Picker", name: "display", onSelect: "selectRestaurant", components: [
				{content: "Central", active: true},
				{content: "Física"},
				{content: "Química"},
				{content: "Prefeitura"},
				/*{content: "Doc?"},
				{content: "Enfermagem"},
				{content: "FSP"},
				{content: "Direito"},*/
			]},
		]},
		]},
		
		{name: "emptyMenu", content: "Nenhum cardápio encontrado!."},
		{name: "mealsDisplay", kind: "FittableColumns", fit: true, components: [
			{kind: "onyx.Button", content: "<", ontap: "prevDay"},
			{kind: "enyo.Panels", name: "mealsPanel", fit: true, components: [
			]},
			{kind: "onyx.Button", content: ">", ontap: "nextDay"},
		]},
		
		{kind: "Signals", onMenuLoaded: "reloadAll"}
	],
	
	create: function () {
		this.inherited(arguments);
		var i;
		for (i = 0; i < 12; i++) {
			this.$.mealsPanel.createComponent({kind: 'usp.MenuDisplayDay'});
		}
	},
	
	reloadAll: function (sender, evt) {
		this.set('restaurants', evt.restaurants);
	},
	
	restaurantsChanged: function (old) {
        this.$.emptyMenu.hide();
		this.set('active', 'Central');
		this.showToday();
	},
	
	activeChanged: function (old) {
		var i;
		var h = {
			"Central": "central",
			"Física": "fisica",
			"Química": "quimica",
			"Prefeitura": "pusp"		
		};
		var menu = this.restaurants[h[this.active]];
		for (i = 0; i < menu.length; i++) {
			this.$.mealsPanel.getPanels()[i].set('meal', menu.at(i));
		}
	},
	
	
	showToday: function () {
		var today = (new Date().getDay() + 6) % 7;
		if (today < 6) {
			today = 2 * today;
		} else {
			today += 5;
		}
		this.$.mealsPanel.setIndex(today);
	},
	
	selectRestaurant: function (isender, ievt) {
		this.set('active', isender.get('selected').content);
	},
});