var app = {c: {}};

(function() {

// { Models

var _Konashi = function(device) {
  this.device = m.prop(device);
  this.firmware = m.prop(null);
  this.deviceName = m.prop(null);
  this.rssi = m.prop(0);
  this.battery = m.prop(0);
  this.connected = m.prop(false);
  var that = this;
  this.disconnect = () => {
    if (!that.connected()) {
      return;
    }
    app.vm.pushMessage('disconnected');
    that.device().disconnect();
    that.connected(false);
  }
  this.connect = () => {
    Konashi.find(true).then((k) => {
      app.vm.pushMessage('connected');
      that.device(k);
      that.deviceName(k.name());
      that.connected(true);
      m.redraw();
    });
  };
};

var PioPin = function(pin) {
  this.number = m.prop(pin);
  this.mode = m.prop(Konashi.INPUT);
  this.pullup = m.prop(Konashi.NO_PULLS);
  this.input = m.prop(Konashi.LOW);
  this.inputLabel = () => {
    switch (this.input()) {
      case Konashi.HIGH:
        return 'HIGH';
      case Konashi.LOW:
        return 'LOW';
      default:
        return 'UNKNOWN';
    }
  };
  this.output = m.prop(Konashi.LOW);
  this.outputLabel = () => {
    switch (this.output()) {
      case Konashi.HIGH:
        return 'HIGH';
      case Konashi.LOW:
        return 'LOW';
      default:
        return 'UNKNOWN';
    }
  };
  this.toggleOutput = () => {
    if (!app.vm.konashi().connected()) {
        return;
    }
    var output = this.output() === Konashi.HIGH ? Konashi.LOW : Konashi.HIGH;
    return app.vm.konashi().device().digitalWrite(this.number(), output).then(() => {
      this.output(output);
      return output;
    });
  }
  this.read = () => {
    if (!app.vm.konashi().connected()) {
        return;
    }
    return app.vm.konashi().device().digitalRead(this.number());
  };
  this.modeLabel = () => {
    return this.mode() == Konashi.INPUT ? 'INPUT' : 'OUTPUT';
  };
  this.setMode = (mode) => {
    if (!app.vm.konashi().connected()) {
        return;
    }
    return app.vm.konashi().device().pinMode(this.number(), mode).then(() => {
      this.mode(mode);
      return mode;
    });
  }
  this.toggleMode = () => {
    var mode = this.mode() == Konashi.INPUT ? Konashi.OUTPUT : Konashi.INPUT;
    return this.setMode(mode);
  };
};

app.Page = function(title, component) {
  this.title = m.prop(title);
  this.component = m.prop(component);
};

// Models }

app.pages = [];

app.vm = {
  init: function() {
    app.vm.konashi = m.prop(new _Konashi());
    app.vm.currentPage = m.prop(app.pages[0]);
    app.vm.pioPins = m.prop([new PioPin(0),
                             new PioPin(1),
                             new PioPin(2),
                             new PioPin(3),
                             new PioPin(4)]);

    app.vm.messages = m.prop([]);
    app.vm.pushMessage = function(message) {
      app.vm.messages().push(message);
    };
    setInterval(function() {
      if (app.vm.messages().length < 1) {
        return;
      }
      var message = app.vm.messages().shift();
      var container = document.querySelector('.mdl-snackbar');
      var data = {message: message, timeout: 3000};
      container.MaterialSnackbar.showSnackbar(data);
    }, 100);
  }
};

app.controller = function() {
  app.vm.init();
  return {
    onClickConnect: function() {
      if (app.vm.konashi().connected()) {
        app.vm.konashi().disconnect();
      } else {
        app.vm.konashi().connect();
      }
    },
    onClickDrawerItem: function(page) {
      app.vm.currentPage(page);
      var layout = document.querySelector('.mdl-layout').MaterialLayout;
      if (layout.drawer_.classList.contains(layout.CssClasses_.IS_DRAWER_OPEN)) {
          layout.toggleDrawer();
      }
      return true;
    }
  };
};

app.view = function(ctrl) {
  var content = function(){};
  app.pages.forEach(page => {
    if (page.title() && page.title() === app.vm.currentPage().title()) {
      content = m.component(page.component(), {vm: app.vm});
    }
  });

  return m('.mdl-layout.mdl-js-layout.mdl-layout--fixed-header.mdl-layout--fixed-drawer', {config: () => componentHandler.upgradeDom()}, [
    header(ctrl),
    drawer(ctrl),
    m('main.mdl-layout__content', [
      m('.konashi-content', [
        content
      ]),
    ]),
    m('.mdl-snackbar.mdl-js-snackbar', [
      m('.mdl-snackbar__text'),
      m('.mdl-snackbar__action')
    ])
  ]);
};

var header = function(ctrl) {
  return m('header.mdl-layout__header.mdl-color--grey-100.mdl-color-text--grey-900', [
    m('.mdl-layout__header-row', [
      m('span.mdl-layout-title', app.vm.currentPage().title()),
      m('.mdl-layout-spacer'),
      m('nav.mdl-navigation', [
        m('.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect',
          {onclick: ctrl.onClickConnect.bind(ctrl)},
           app.vm.konashi().connected() ? 'DISCONNECT' : 'CONNECT')
      ])
    ])
  ]);
};

var drawer = function(ctrl) {
  return m('.mdl-layout__drawer', [
    m('span.mdl-layout-title', 'konashi inspector'),
    m('nav.mdl-navigation', 
      app.pages.map(function(page) {
        return m('a.mdl-navigation__link',
                 {href: '#', onclick: ctrl.onClickDrawerItem.bind(ctrl, page)},
                 page.title());
      })
    ),
    m('ul', [
      m('li', [m('a', {href: 'https://github.com/YUKAI/konashi-web-bluetooth', target: '_blank'}, 'Github')]),
      m('li', [m('a', {href: 'https://github.com/YUKAI/konashi-ios-sdk', target: '_blank'}, 'iOS SDK')]),
      m('li', [m('a', {href: 'https://github.com/YUKAI/konashi-android-sdk', target: '_blank'}, 'Android SDK')]),
      m('li', [m('a', {href: 'http://konashi.ux-xu.com', target: '_blank'}, 'Official Site')])
    ])
  ]);
};

var footer = function(ctrl) {
  return m('.mdl-grid.mdl-color--grey-100.mdl-color-text--grey-900', [
    m('.mdl-cell.mdl-cell--2-col', [m('a', {href: '', value: 'hoge'}, 'YUKAI/konashi-web-bluetooth')]),
    m('.mdl-cell.mdl-cell--2-col', [m('a', {href: 'dummy'}, 'iOS SDK')]),
    m('.mdl-cell.mdl-cell--2-col', [m('a', {href: 'dummy'}, 'Android SDK')]),
    m('.mdl-cell.mdl-cell--2-col', [m('a', {href: 'dummy'}, 'Official Site')]),
    m('.mdl-cell.mdl-cell--2-col', [m('a', {href: 'http://mithril.js.org', target: '_blank'}, 'Mithril')]),
    m('.mdl-cell.mdl-cell--2-col', [m('a', {href: 'https://getmdl.io', target: '_blank'}, 'Material Design Lite')])
  ]);
};

})();  // root
