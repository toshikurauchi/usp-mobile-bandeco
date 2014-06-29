enyo.kind({
    name: "usp.Controller",
    
    published: {
        settings: new usp.Settings(),
        restaurants: {}
    },
    
    create: function () {
        this.inherited(arguments);
        this.settings.fetch();
        enyo.Signals.send('onSettingsLoaded', {});
        var t = this;
        this.updateMenus({
            success: function (e) {
                enyo.Signals.send('onMenuLoaded',
                    {settings: t.get('settings'), restaurants: t.get('restaurants') });
            }
        });
    },
    
    updateMenus: function (opts) {
		var order = this.settings.get('order');
		
		var loaded = 0;
		var t = this;
		for (i = 0; i < order.length; i++) {
			var menu = new usp.Menu();
            var r = order[i];
			menu.set('bandejao', r.key);
			menu.set('displayName', r.displayName);
			
			menu.fetch({success: function (m) {
				loaded++;
				if (loaded == order.length) {
					if (opts.success !== undefined) {
						opts.success(m);
					}
				}
			}});
            this.restaurants[r.key] = menu;
		}
	},
});