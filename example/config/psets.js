(function() {
  ui.registerPsets({
    Window: {
      barColor: Colors.barColor,
      navBarHidden: false,
      orientationModes: [Ti.UI.PORTRAIT],
      barImage: img('navBar.png'),
      backgroundImage: 'images/bg1.png'
    },

    EmailDialog: {
      barColor: Colors.barColor
    },

    Label: {
      color: 'white'
    },

    TableView: {
      backgroundColor: 'white'
    },

    ImageView: {
      defaultImage: img('empty.png')
    },

    NewsWindow: {
      layout: 'vertical'
    },

    NewsDetailsWindow {
      layout: 'vertical'
    },

    '.newsTitleLabel': {
      left: jg.dp(5),
      font: {
        fontSize: '13dp',
        fontWeight: 'bold'
      },
      height: '18dp',
      width: Ti.UI.FILL,
      color: 'black'
    },

    '.newsTitleLabel': {
      left: jg.dp(5),
      top: jg.dp(20),
      font: {
        fontSize: '13dp',
        fontWeight: 'normal'
      },
      height: Ti.UI.FILL,
      width: Ti.UI.FILL,
      color: 'black'
    }
  });


  // --------------------------------------------------
  // -- android only
  // --------------------------------------------------
  ui.registerPsets('android', {
    Window: {
      backgroundImage: 'images/bg2.png'
    },

    TableViewRow: {
      backgroundSelectedColor: Colors.highlight,
      selectedColor: 'black'
    }
  });


  // --------------------------------------------------
  // -- iphone only
  // --------------------------------------------------
  ui.registerPsets('iphone', {
    TableViewRow: {
      selectedBackgroundColor: Colors.highlight,
      selectedColor: 'black'
    }
  });

}());
