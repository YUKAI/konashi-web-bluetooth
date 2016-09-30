(function(app) {

app.c.AnalogIn = {

  view: function(ctrl) {
    return m('.mdl-layout', [
      m('table.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp', [
        m('thead', [
          m('tr', [
            m('th', 'PIN'),
            m('th', 'Indicator'),
            m('th', 'Voltage(mV)')
          ])
        ]),
        m('tbody', ctrl.vm.analogPins().map(pin => {
          return m('tr', [
            m('td', pin.number()),
            m('td', [m('div.mdl-progress.mdl-js-progress.analog-pin-indicator.analog-pin-indicator-' + pin.number())]),
            m('td', pin.input())
          ]);
        }))
      ])
    ]);
  },

  controller: function(args) {
    var vm = args.vm;
    var chain = null;

    setInterval(() => {
      var chain = null;
      vm.analogPins().forEach(pin => {
        var done = (value) => {
          var elem = document.querySelector('.analog-pin-indicator-' + pin.number());
          if (!elem) {
            return;
          }
          pin.input(value);
          var progress = value / 1300 * 100;
          elem.MaterialProgress.setProgress(progress);
        };
        if (chain == null) {
          chain = pin.read().then(done);
        } else {
          chain = chain.then(() => pin.read().then(done));
        }
      });
      m.redraw();
    }, 100);
    return {vm: vm};
  }
};

})(app);
