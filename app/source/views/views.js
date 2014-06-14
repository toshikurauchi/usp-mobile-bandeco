/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "usp.Menu",
	kind: "enyo.Collection",
	source: "jsonp",
	url: "https://query.yahooapis.com/v1/public/yql?q=use%20'https%3A%2F%2Fraw.githubusercontent.com%2Ftoshikurauchi%2Fusp-mobile-bandeco%2Fmaster%2Fusp.bandejao.xml'%3B%0Aselect%20*%20from%20usp.bandejao%20where%20bandejao%3D%22central%22%3B&format=json&diagnostics=true",
	parse: function (data) {
		return data.query.results.cardapio.refeicao;
	}
});

enyo.kind({
	name: "usp.MenuDisplayDay",
	
	published: {
		meal: null
	},
	
	mealChanged: function (old) {
		// correct case
		var dia = this.meal.get('dia');
		this.meal.set('dia', dia[0].toUpperCase() + dia.substr(1).toLowerCase());
		var per = this.meal.get('periodo');
		per = per.replace('c', 'ç');
		this.meal.set('periodo', per[0].toUpperCase() + per.substr(1).toLowerCase());
		
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
			return val.item.join('<br>');
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
	
	components:[
		{kind: "onyx.Toolbar",
		 layoutKind: "FittableColumnsLayout",
		 components: [
			{content: "USP-Mobile - Cardápios", fit: true},
			{kind: "onyx.Button", content: "Atualizar", ontap: "updateMenu"}, // trocar por icon button depois
		]},
			/*{kind: "FittableColumns", components: [
				{kind: "onyx.PickerDecorator", components: [
					{},
					{kind: "onyx.Picker", onSelect: "selectMenu", components: [
								{content: "Central", active: true},
								{content: "Física"},
								{content: "Química"},
								{content: "PCO"},
							]},
						]
					},
					{kind: "onyx.PickerDecorator", components: [
						{},
						{kind: "onyx.Picker", onSelect: "selectMenu", components: [
								{content: "Segunda", active: true},
								{content: "Terça"},
								{content: "Quarta"},
								{content: "Quinta"},
								{content: "Sexta"},
								{content: "Sábado"},
								{content: "Domingo"},
							]},
						]
					},
					{kind: "onyx.PickerDecorator", onSelect: "selectMenu", components: [
						{},
						{kind: "onyx.Picker", components: [
								{content: "Almoço", active: true},
								{content: "Jantar"},
							]},
						]
					},
			]},*/
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
		this.updateMenu();
		var i;
		for (i = 0; i < 12; i++) {
			this.$.mealsPanel.createComponent({kind: 'usp.MenuDisplayDay'});
		}
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
	
	updateMenu: function(inSender, inEvent) {
		// show spinner
		var t = this;
		var menus = new usp.Menu();
		menus.fetch({
			success: function (d) {
				t.set('menu', d);
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
			}
		});
	},
});
