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
	
	content: "menu aqui!!!"
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
		 ]
		},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "mealList", kind: "enyo.DataRepeater",
			 components: [
				{components: [
					{name: "day", tag: 'div'},
					{name: "period", tag: 'div'},
					{name: "food", tag: 'div', allowHtml: true}
				],
				bindings: [
					{from: '.model.dia', to: '.$.day.content'},
					{from: '.model.periodo', to: '.$.period.content'},
					{from: '.model.cardapio', to: '.$.food.content', transform: function (val) {
						return val.item.join('<br>');
					}}
				]}
			 ]},
			{name: "emptyMenu", content: "Nenhum cardápio encontrado!."},
		]}
	],
	
	bindings: [
		{from: '.menu', to: '.$.mealList.collection'}
	],
	
	create: function () {
		this.inherited(arguments);
		this.updateMenu();
	},
	
	updateMenu: function(inSender, inEvent) {
		/* chama YQL para atualizar o cardápio */
		// show spinner
		var t = this;
		var menus = new usp.Menu();
		menus.fetch({
			success: function (d) {
				t.set('menu', d);
				t.$.emptyMenu.hide();
			}
		});
	},
});
