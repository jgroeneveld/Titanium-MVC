// --------------------------------------------------
// -- locale
// --------------------------------------------------
( function() {
    var registeredLocales = {};

    jg.locale = {};

    jg.locale.activeLocale = null;
    jg.locale.defaultLocale = 'en';

    jg.locale.register = function(locale, pairs) {
        registeredLocales[locale] = pairs;
    };

    jg.locale.init = function(defaultLocale) {
        if (defaultLocale) {
            jg.locale.defaultLocale = defaultLocale;
        }

        if (registeredLocales[Ti.Platform.locale]) {
            jg.locale.activeLocale = Ti.Platform.locale;
        } else {
            jg.locale.activeLocale = jg.locale.defaultLocale;
        }
    };

    jg.locale.translate = function(key) {
        var locale = registeredLocales[jg.locale.activeLocale];

        if (locale) {
            var r = locale[key];
            if (r) {
                return r;
            }
        }

        var ret = jg.locale.activeLocale + ', ' + key;
        jg.warn('could not find locale', "'" + ret + "'");
        return ret;

    };

}());

function t(key) {
    return jg.locale.translate(key);
}
