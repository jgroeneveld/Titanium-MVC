ui.registerController('NewsWindowController', function() {
  var self;
  var view;
  var data;

  function init() {
    self = {};
    view = new ui.NewsWindow();

    view.addEventListener('tableClicked', onTableClicked);
    view.addEventListener('open', fetchData);
  }

  function onTableClicked(e) {
    new ui.NewsDetailsWindow({
      entry: e.entry
    }).open();
  }

  function fetchData() {
    net.xhr({
      url: $.urls.news,
      onload: function() {
        data = NewsHelper.xmlToObjects(this.responseXML);

        data.sort(function(a, b) {
          var da = a.createdAt;
          var db = b.createdAt;
          var res = (da === db) ? 0 : (da > db) ? 1 : -1;
          return res * -1;
        });

        view.putData(data);
      },
      onerror: function(e) {
        jg.error('network error');
      }
    });
  }

  function makePublic() {
    self.view = view;
  }

  init();
  makePublic();

  return self;
});
