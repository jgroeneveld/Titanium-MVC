jg.net = {};

// --------------------------------------------------
// -- XHR wrapper inspired by
// https://github.com/itspriddle/ti-fighter/blob/master/ti-fighter.js
// --------------------------------------------------


jg.net.xhr = function(opts) {
    var url = opts.url;
    var timeout = opts.timeout || 120000;
    var method = opts.method || 'GET';
    var data = opts.data || null;

    var async = true;
    if (opts.async !== undefined) {
        async = opts.async;
    }

    var xhr = Ti.Network.createHTTPClient();
    xhr.setTimeout(timeout);
    xhr.open(method, url, async);

    if (method === 'PUT' || method === 'DELETE') {
        xhr.setRequestHeader('X-HTTP-Method-Override', method);
    }

    xhr.setRequestHeader('User-Agent', 'TITANIUM');


    var callbacks = ['onload', 'onerror', 'onreadystatechange', 'onsendstream'];
    callbacks.each( function(cbName) {
        if (opts[cbName] && typeof opts[cbName] == 'function') {
            xhr[cbName] = opts[cbName];
        }
    });

    if (opts.headers) {
        opts.headers.each( function(k, v) {
            xhr.setRequestHeader(k, v);
        });
    }

    if (data !== null) {
        xhr.send(data);
    } else {
        xhr.send();
    }

    jg.debug(method, url);

    return xhr;
};
