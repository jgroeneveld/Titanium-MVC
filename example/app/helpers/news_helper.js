var NewsHelper = {};

(function() {
  var textRegex = /^(<strong>)(.+?)(<\/strong>)(.+)/;

  NewsHelper.xmlToObjects = function(responseXML) {
    var news = [];

    var doc = responseXML.documentElement;
    var items = doc.getElementsByTagName('item');

    for(var i = 0; i < items.length; i++) {
      var item = items.item(i);

      var title = item.getElementsByTagName('title').item(0).text;
      var link = item.getElementsByTagName('link').item(0).text;
      var description = item.getElementsByTagName('description').item(0).text;
      var pubDate = item.getElementsByTagName('pubDate').item(0).text;
      var createdAt = new Date(pubDate);

      news.push(db.createModel('News', {
        title: title,
        description: description,
        createdAt: createdAt,
        link: link,
      }));
    }

    return news;
  };

}());

