app.c.SystemInfo = {

  view: function(ctrl) {
    return m('.mdl-layout', [
      m('table.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp', [
        m('tbody', [
          m('tr', [
            m('td.mdl-data-table__cell--non-numeric', 'Device Name'),
            m('td', ctrl.vm.konashi().deviceName())
          ]),
          m('tr', [
            m('td.mdl-data-table__cell--non-numeric', 'RSSI'),
            m('td', ctrl.vm.konashi().battery() + 'dB')
          ]),
          m('tr', [
            m('td.mdl-data-table__cell--non-numeric', 'Battery'),
            m('td', ctrl.vm.konashi().rssi())
          ])
        ])
      ])
    ]);
  },

  controller: function(args) {
    var vm = args.vm;
    return {vm: vm};
  }
};
