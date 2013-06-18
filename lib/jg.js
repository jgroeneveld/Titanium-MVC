var jg = {};

// --------------------------------------------------
// -- Javascript extension
// --------------------------------------------------

// array: expects a callback in the form callback( value[, index] )
// object: expects a callback in the form callback( key, value )
jg.each = function(object, callback) {
    if (object.length != null) {
        for (var i = 0; i < object.length; i++) {
            callback(object[i], i);
        }
    } else {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                callback(key, object[key]);
            }
        }
    }
};


// merges other into self
jg.merge = function(self, other) {
    if (other) {
        jg.each(other, function(k, v) {
            self[k] = v;
        });
    };

    return self;
};

jg.deleteProperty = function(object, property) {
    var val = object[property];
    if (val !== undefined) {
        delete object[property];
    }
    return val;
};

// expects a callback in the form callback( value[, index] )
jg.map = function(object, callback) {
    var arr = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            arr.push(callback(object[key], key));
        }
    }

    return arr;
};

// expects a callback in the form callback( value[, index] )
Array.prototype.each = function(callback) {
    jg.each(this, callback);
};

// expects a callback in the form callback( value[, index] )
Array.prototype.map = function(callback) {
    return jg.map(this, callback);
};

Array.prototype.sample = function() {
    var i = parseInt(Math.random()*(this.length));
    return this[i];
};

Array.prototype.first = function() {
    return this[0];
};

Array.prototype.last = function() {
    return this[this.length-1];
};

Array.prototype.uniq = function uniq() {
    var unique = [];
    var i = 0;

    this.each(function(value) {
        if (unique.indexOf(value) == -1) {
            unique[i++] = value;
        }
    });
    return unique;
};

Array.prototype.deleteIf = function(callback) {
    for (var i = this.length - 1; i >= 0; i--) {
        if(callback(this[i])) {
            this.splice(i, 1);
        }
    }
};


/*
 * creates a enumeration object like
 * ['ONE', 'TWO'].enumerate() => {ONE: '0', TWO: '1'}
 * ['ONE', 'TWO'].enumerate(true) => {ONE: 'ONE', TWO: 'TWO'}
 */
Array.prototype.enumerate = function(useSelf/*=false*/) {
    var obj = {};
    for (var i = 0; i < this.length; i++) {
        var name = i;
        if (useSelf) {
            name = this[i];
        }
        obj[this[i]] = name;
    };
    return obj;
};

String.prototype.trim = function() {
    return this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '');
};

String.prototype.startsWith = function(str) {
    return this.match('^'+str) == str;
};

String.prototype.endsWith = function(str) {
    return this.match(str+'$') == str;
};

String.prototype.underscore = function(){
    var s = this.replace(/^([A-Z])/, function(m) {
        return m.toLowerCase();
    });
    return s.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};


// --------------------------------------------------
// -- Relative Path Functions
// --------------------------------------------------


(function() {
    var included = {};

    function require(path, args) {
        var j = 0;

        if (typeof(args[args.length-1]) == 'object') {
            options = args[args.length-1];
            j = 1;
            if (options.path) {
                path = options.path;
            }
        }

        for (var i = 0; i < args.length-j; i++) {
            var filename = path + args[i].underscore() + '.js';
            if (!included[filename]) {
                Ti.include(filename);
                included[filename] = true;
            } else {
                jg.debug('skipped include of', filename);
            }
        }
    }
}());


// jg.pathPrefix = '../';
// jg.configPath = 'config/';
// jg.localesPath = 'config/locales/';
// jg.imagesPath = 'images/';
// jg.controllersPath = 'app/controllers/';
// jg.viewsPath = 'app/views/';
// jg.modelsPath = 'app/models/';


function img(file) {
    return jg.os({android: '../images/' + file, iphone: 'images/' + file});
}

jg.init = function() {
    // jg.includeDirectory(jg.configPath);
    // jg.includeDirectory(jg.localesPath);
    // jg.includeDirectory(jg.viewsPath);
    // jg.includeDirectory(jg.controllersPath);
    // jg.includeDirectory(jg.modelsPath);

    jg.os({
        android: function() {
            Ti.include('../zincludes.js');
        },
        iphone: function() {
            Ti.include('zincludes.js');
        }
    });
};

// --------------------------------------------------
// -- Log Functions
// --------------------------------------------------
( function() {

    var logs = ['debug', 'info', 'warn', 'error'];

    logs.each( function(log) {
        jg[log] = function() {
            var msg = '';

            for (var i = 0; i < arguments.length; i++) {
                var el = arguments[i];
                if (typeof(el) === 'object') {
                    el = JSON.stringify(el);
                }

                msg += el + ' ';
            }

            Ti.API[log](msg);
        };
    });
}());


// --------------------------------------------------
// -- Util
// --------------------------------------------------

/*
 * jg.random(['a','b','c']) // random element
 * jg.random(0,10) // on of [0..10]
 */
jg.random = function(/*args*/) {
    var min = arguments[0];
    var max = arguments[1];
    var res = parseInt(Math.random()*(max-min+1)+min);
    return res;
};

jg.os = function(/*Object*/ map) {
    var def = map.def||null; //default function or value
    if (map[Ti.Platform.osname] != undefined) {
        if (typeof(map[Ti.Platform.osname]) == 'function') {
            return map[Ti.Platform.osname]();
        } else {
            return map[Ti.Platform.osname];
        }
    } else {
        if (typeof(def) == 'function') {
            return def();
        } else {
            return def;
        }
    }
};

jg.MemoryPool = function() {
    this.init = function() {
        this._memWin = Ti.UI.createWindow();
        this._memWin.hide();
        this._memWin.open();
    };

    this.add = function(obj) {
        if(obj instanceof Array) {
            var arLen=obj.length;
            for ( var i=0, len=arLen; i<len; ++i ) {
                this._memWin.add(obj[i]);
            }
        } else {
            this._memWin.add(obj);
        }
    };

    this.clean = function() {
        jg.debug('Cleaning MemoryPool.');

        // We empty the pool by closing it.
        this._memWin.close();
        this.init();
    };

    this.init();
};

// dient als comparator für array sort
jg.stringComparator = function (a, b)  {
    a = a.toLowerCase();
    a = a.replace(/ä/g,"a");
    a = a.replace(/ö/g,"o");
    a = a.replace(/ü/g,"u");
    a = a.replace(/ß/g,"s");

    b = b.toLowerCase();
    b = b.replace(/ä/g,"a");
    b = b.replace(/ö/g,"o");
    b = b.replace(/ü/g,"u");
    b = b.replace(/ß/g,"s");

    return(a==b)?0:(a>b)?1:-1;
};


jg.dp = function () {
    var sum = parseFloat(arguments[0]);
    for(var i = 1; i < arguments.length; i++) {
        sum += parseFloat(arguments[i]);
    }

    return sum + 'dp';
};

jg.dpSub = function () {
    var sum = parseFloat(arguments[0]);
    for(var i = 1; i < arguments.length; i++) {
        sum -= parseFloat(arguments[i]);
    }

    return jg.dp(sum);
};


