/**
	For simple applications, you might define all of your models, collections,
	and sources in this file.  For more complex applications, you might choose to separate
	these kind definitions into multiple files under this folder.
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
    name: "usp.Settings",
    kind: "enyo.Model",
    
    defaults: {
        order: [
            {displayName: "Central", key: "central", show: true, order: 1},
            {displayName: "Química", key: "quimica", show: true, order: 2},
            {displayName: "Física", key: "fisica", show: true, order: 3},
            {displayName: "Prefeitura", key: "pusp", show: true, order: 4},
        ]
    },
    
    commit: function (opt) {
        localStorage['order'] = JSON.stringify(this.get('order'));
    },
    
    fetch: function (opt) {
        var ord = localStorage['order'];
        if (ord !== undefined && ord !== 'undefined') {
            this.set('order', JSON.parse(ord));
        }
    },
})