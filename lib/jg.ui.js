// --------------------------------------------------
// -- jg.ui
// Helpers for registering and styling Titanium and app-specific components
// taken from Helium and extended / modified
// --------------------------------------------------
jg.ui = {};

(function() {
    var psets= {};

    var deepMergeWithPsets = function(propertySets) {
        jg.each(propertySets, function(k,v) {
            if (psets[k]) {
                jg.merge(psets[k], v);
            } else {
                psets[k] = v;
            }
        });
    };
    /*
     * jg.ui.registerPsets(psets)
     * jg.ui.registerPsets('iphone', psets)
     */
    jg.ui.registerPsets = function(platform_or_psets, psets_if_platform) {
        if (typeof(platform_or_psets) === 'string') {
            if (platform_or_psets === Ti.Platform.osname) {
                deepMergeWithPsets(psets_if_platform);
            }
        } else {
            deepMergeWithPsets(platform_or_psets);
        }
    };
    jg.ui.getPset = function(/*String*/ key) {
        return jg.merge({}, psets[key]); //return clone
    };
    jg.ui.applyPset = function(/*Object*/ target /*String... pset names*/) {
        for (var j = 1; j < arguments.length; j++) {
            jg.merge(target, psets[arguments[j]]);
        }
        return target;
    };
    jg.ui.applyPsetOrMerge = function(target, nameOrPsetObject) {
        if (typeof(nameOrPsetObject) === 'string') {
            jg.ui.applyPset(target, nameOrPsetObject);
        } else {
            jg.merge(target, nameOrPsetObject);
        }
    };
    jg.ui.registerView = function(/*String*/ viewName, /*Function*/ builder) {
        if (jg.ui[viewName]) {
            jg.warn('Overwriting jg.ui.' + viewName);
        }

        jg.ui[viewName] = function(/* String or Object... psets or plain objects */) {
            var args = {};

            //First, grab widget defaults if we have them
            jg.ui.applyPset(args,viewName);

            for (var j = 0; j < arguments.length; j++) {
                jg.ui.applyPsetOrMerge(args, arguments[j]);
            }

            var generatedObject = builder(args);
            return generatedObject;
        };
    };

    var tiuiObjects = ['ActivityIndicator', 'AlertDialog', 'Animation', 'Button', 'ButtonBar', 'CoverFlowView', 'EmailDialog', 'ImageView', 'Label', 'OptionDialog', 'Picker', 'PickerRow', 'PickerColumn', 'ScrollView', 'ScrollableView', 'Slider', 'Switch', 'Tab', 'TabGroup', 'TabbedBar', 'TableView', 'TableViewRow', 'TableViewSection', 'TextArea', 'TextField', 'Toolbar', 'View', 'WebView', 'Window'];
    jg.each(tiuiObjects, function(viewName) {
        jg.ui.registerView(viewName, function(args) {
            var view = Ti.UI['create' + viewName](args);

            return view;
        });
    });

    jg.ui.registerController = function(/*String*/ controllerName, /*Function*/ builder) {
        jg.ui[controllerName] = builder;
    };

    (function() {
        var statusBarHeight = jg.os({
            iphone: 20,
            android: function() {
                switch ( Ti.Platform.displayCaps.dpi ) {
                    case 120:
                        return 19;
                        break;
                    case 160:
                        return 25;
                        break;
                    case 240:
                        return 38;
                        break;
                    case 320:
                        return 50;
                        break;
                    default:
                        return 25;
                        break;
                }
            }
        });

        jg.ui.statusBarHeight = function() {
            return statusBarHeight;
        };
    })();

    jg.ui.platformWidth = function() {
        return Ti.Platform.displayCaps.platformWidth;
    };

    jg.ui.platformHeight = function() {
        return Ti.Platform.displayCaps.platformHeight;
    };
})();
