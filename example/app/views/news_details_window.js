/*
 * events:
 */
ui.registerView('NewsDetailsWindow', function(args) {
  var self;
  var entry;

  function init() {
    entry = jg.deleteProperty(args, 'entry');

    self = new ui.Window(jg.merge(args, {
      title: entry.title
    }));

    self.add(new ui.Label('.newsTitleLabel', {
      text: entry.title
    }));

    self.add(new ui.Label('.newsDescriptionLabel', {
      text: entry.description
    }));
  }

  function makePublic() {

  }

  init();
  makePublic();

  return self;
});
