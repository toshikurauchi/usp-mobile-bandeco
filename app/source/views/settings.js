
enyo.kind({
    name: "usp.SettingsRestaurant",
    tag: 'div',
    
    events: {
        onMoveUp: "",
        onMoveDown: "",
        onToggleShow: "",
    },
    
    published: {
        displayName: '',
        showR: true
    },
    
    components: [
        {name: "restaurantName"},
        {kind: "onyx.ToggleButton", name: "showRestaurant"}
    ],
    
    bindings: [
        {from: ".displayName", to: ".$.restaurantName.content"},
        {from: ".showR", to: ".$.showRestaurant.value", oneWay: false}
    ],
    
    showRChanged: function (old) {
        this.doToggleShow({displayName: this.get('displayName'), showR: this.get('showR')});
    },
})

enyo.kind({
    name: "usp.SettingsPanel",
    kind: "FittableRows",
    
    handlers: {
        onToggleShow: "toggleShow"
    },
    
    components: [
        {kind: "onyx.Toolbar", components: [
            {content: "Configurações", fit: true}
        ]},
        {content: "Mostrar restaurantes:", tag: "div"},
        {name: "restaurantCards", components: [
        ]},
        {kind: "Signals", onSettingsLoaded: "reloadSettings"}
    ],
    
    create: function () {
        this.inherited(arguments);
        this.reloadSettings();
    },
    
    reloadSettings: function (sender, evt) {
        var order = this.get('app').$.controller.get('settings').get('order');
        for (r in order) {
            this.$.restaurantCards.createComponent({
                kind: "usp.SettingsRestaurant",
                displayName: order[r].displayName,
                showR: order[r].show,
            });
        }
        this.render();
    },
    
    toggleShow: function(isender, ievt) {
        var i = 0;
        var settings = this.get('app').$.controller.get('settings');
        var order = settings.get('order');
        for (i = 0; i < order.length; i++) {
            if (order[i].displayName == ievt.displayName) {
                order[i].show = ievt.showR;
            }
        }
        settings.commit();
        enyo.Signals.send('onSettingsChanged');
    },
});