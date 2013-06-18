Ti.include('lib/jg.js');
Ti.include('lib/jg.ui.js');
Ti.include('lib/jg.db.js');
Ti.include('lib/jg.locale.js');
Ti.include('lib/jg.net.js');

var ui = jg.ui;
var db = jg.db;
var net = jg.net;

jg.init();

jg.locale.init('de');

var win = new ui.NewsWindow();
win.open();
