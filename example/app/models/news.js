jg.db.registerModel('News', function(self) {

  self.cleanDescription = function() {
    var htmlTagsRegex = /<([^>]*)>/g;
    var cleaned = self.description.replace(htmlTagsRegex, '');
    return cleaned;
  };

});