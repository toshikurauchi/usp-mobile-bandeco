

enyo.kind({
	name: "usp.MenuDisplayDay",
	
	published: {
		meal: null
	},
	
	events: {
		next: "",
		prev: ""
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
			{content: "asddsa", fit: true, name: "displayName"},
			{kind: "onyx.PickerDecorator", components: [
			{style: "min-width: 150px"},
			{kind: "onyx.Picker", onSelect: "selectRestaurant", components: [
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
		]}
	],
	
	
	bindings: [
		{from: ".active", to: ".$.displayName.content"}
	],
	
	create: function () {
		this.inherited(arguments);
		var i;
		for (i = 0; i < 12; i++) {
			this.$.mealsPanel.createComponent({kind: 'usp.MenuDisplayDay'});
		}
	},
	
	restaurantsChanged: function (old) {
        this.$.emptyMenu.hide();
		this.set('active', 'Central');
		this.showToday();
	},
	
	activeChanged: function (old) {
		var i;
		var menu = this.restaurants[this.active];
		for (i = 0; i < menu.length; i++) {
			this.$.mealsPanel.getPanels()[i].set('meal', menu.at(i));
		}
	},
	
	
	showToday: function () {
		var today = new Date();
		var dw = today.getDay();
		var index = (dw - 1 + 7) % 7;
		if (index > 5) {
			index += 10;
		} else {
			index = index * 2;
		}
		index++;
		this.$.mealsPanel.setIndex(index);
	},
	
	selectRestaurant: function (isender, ievt) {
		this.set('active', isender.get('selected').content);
	},
});