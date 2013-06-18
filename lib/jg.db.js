// --------------------------------------------------
// -- database
// --------------------------------------------------
( function() {
    var openDB = null;
    var dbName = null;

    jg.db = {};

    jg.db.getOpenDB = function() {
        return openDB;
    };

    jg.db.isOpen = function() {
        return openDB != null;
    };

    jg.db.init = function(/*optional*/ name) {
        if (!name) {
            name = 'database';
        }

        dbName = name;

        var schemaFile = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'db','schema.sql');
        if (schemaFile.exists) {
            var schema = schemaFile.read().text;

            jg.db.open();
            jg.db.execute(schema);
            jg.db.close();
        } else {
            jg.error('Database schema not found!', schemaFile.nativePath);
        }
    };

    jg.db.open = function() {
        openDB = Ti.Database.open(dbName);

        return openDB;
    };

    jg.db.close = function() {
        openDB.close();
        openDB = null;
    };

    jg.db.execute = function(query) {
        if (!jg.db.isOpen()) {
            jg.db.open();
        }

        //jg.debug('--- executing sql ---\n' + "'" + query + "'");

        return openDB.execute(query);
    };

    jg.db.escape = function(v) {
        if (typeof(v) == 'string') {
            v = "'" + v + "'";
        }

        return v;
    };

    jg.db.removeDatabase = function() {
        if (!jg.db.isOpen()) {
            jg.db.open();
        }

        openDB.remove();
        jg.db.close();
    };
}());
// --------------------------------------------------
// -- model - will be used for the db as well
// --------------------------------------------------
( function() {
    var modelRegistry = {};

    jg.db.registerModel = function(table, builder) {
        modelRegistry[table] = builder;
    };

    jg.db.createModel = function(table, object, ignoreErrors/*=false*/) {
        if (ignoreErrors) {
            if (modelRegistry[table]) {
                modelRegistry[table](object);
            }
        } else {
            modelRegistry[table](object);
        }

        return object;
    };
}());
// --------------------------------------------------
// -- database.query
// --------------------------------------------------
( function() {
    /*
     * Finds one entry in the database.
     *
     * options is a hash and can take a combination of
     * conditions: hash {id: 1, name: 'asd'} or string "id = 1 AND name = 'asd'"
     * order: string with the ordering like 'name ASC'
     */
    jg.db.find = function(table, options_or_id) {
        var cond;
        if (typeof(options_or_id) == 'number') {
            cond = {
                id: options_or_id
            };
        } else {
            cond = options_or_id;
        }

        var objects = jg.db.findAll(table, jg.merge(cond, {
            limit: 1
        }));

        if (objects.length > 0) {
            return objects[0];
        } else {
            return null;
        }
    };

    /*
     * Finds all entries in the database
     *
     * options is a hash and can take a combination of
     * conditions: hash {id: 1, name: 'asd'} or string "id = 1 AND name = 'asd'"
     * limit: limits how many results are given
     * order: string with the ordering like 'name ASC'
     */
    jg.db.findAll = function(table, options) {
        var cond = "";

        if (options) {
            if (options.conditions) {
                cond += ' WHERE';

                if (typeof(options.conditions) == 'object') {
                    options.conditions.each( function(k, v) {
                        cond += ' ' + k + '=' + jg.db.escape(v);
                    });
                } else {
                    cond += ' ' + options.conditions;
                }
            }

            if (options.order) {
                cond += ' ORDER BY ' + options.order;
            }

            if (options.limit) {
                cond += ' LIMIT ' + options.limit;
            }
        }

        var query = 'SELECT * FROM ' + table + cond;
        var resultSet = jg.db.execute(query);
        var rowCount = resultSet.rowCount;
        var fieldCount = jg.os({
            iphone: function() {return resultSet.fieldCount()},
            android: function() {return resultSet.fieldCount}
        });

        var objects = [];
        if (rowCount > 0) {

            // tabellen struktur holen
            var fields = [];
            for (var i=0; i < fieldCount; i++) {
                fields.push(resultSet.fieldName(i));
            }

            // ergebnisse holen
            while(resultSet.isValidRow()) {
                var obj = {};
                for (var i=0; i < fields.length; i++) {
                    obj[fields[i]] = resultSet.fieldByName(fields[i]);
                }

                objects.push(obj);
                resultSet.next();
            }
        }

        objects.each( function(object) {
            jg.db.createModel(table, object, true);
        });
        return objects;
    };

    jg.db.insert = function(table, object) {
        var keys = '';
        var values = '';
        var first = true;

        object.each( function(k,v) {
            if (typeof(v) == 'function') {
                return;
            }

            if (!first) {
                keys += ', ';
                values += ', ';
            }
            first = false;

            keys += k;
            values += jg.db.escape(v);
        });
        var query = 'INSERT INTO ' + table + ' (' + keys + ') VALUES (' + values + ')';
        jg.db.execute(query);
    };

    jg.db.update = function(table, object) {
        var pairs = '';
        var first = true;

        object.each( function(k,v) {
            if (typeof(v) == 'function' || k == 'id') {
                return;
            }

            if (!first) {
                pairs += ', ';
            }
            first = false;

            pairs += k + ' = ' + jg.db.escape(v);
        });
        var query = 'UPDATE ' + table + ' SET ' + pairs + ' WHERE id = ' + object.id;
        jg.db.execute(query);
    };
}());