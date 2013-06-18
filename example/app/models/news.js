jg.db.registerModel('Sport', function(self) {

  self.cleanDescription = function() {
    var htmlTagsRegex = /<([^>]*)>/g;
    var cleaned = self.description.replace(htmlTagsRegex, '');
    return cleaned;
  };

});