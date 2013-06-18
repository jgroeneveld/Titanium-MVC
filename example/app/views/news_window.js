ui.registerView('NewsWindow', function(args) {
  var self;
  var table;

  function init() {
    self = new ui.Window(jg.merge(args, {
      title: t('news')
    }));

    initTable();
  }

  function initTable() {
    table = new ui.TableView();
    self.add(table);
  }

  function buildRow(entry) {
    return {
      title: entry.title,
      entry: entry
    };
  }

  function putData(data) {
    table.data = data.map(buildRow);
  }

  function makePublic() {
    self.putData = putData;
  }

  init();
  makePublic();

  return self;
});
