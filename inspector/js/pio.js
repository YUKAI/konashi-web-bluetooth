(function(app) {

app.c.Pio = {

  view: function(ctrl) {
    return m('.mdl-layout', [
      m('table.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp', [
        m('thead', [
          m('tr', [
            m('th', 'PIN'),
            m('th', 'Mode'),
            m('th', 'Output'),
            m('th', 'Input'),
            m('th', 'Pullup')
          ])
        ]),
        m('tbody', ctrl.vm.pioPins().map(pin => {
          return m('tr', [
            m('td', pin.number()),
            m('td', [m('button.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect', {onclick: ctrl.onClickInput.bind(ctrl, pin)}, pin.modeLabel())]),
            m('td', [m('button.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect', {onclick: ctrl.onClickState.bind(ctrl, pin)}, pin.stateLabel())]),
            m('td', pin.stateLabel()),
            m('td', [
              m('label.mdl-checkbox.mdl-js-checkbox.mdl-js-ripple-effect', {'for': 'pio' + pin.number()}, [
                m('input.mdl-checkbox__input', {type: 'checkbox', id: 'pio' + pin.number(), checked: pin.pullup() === Konashi.PULLUP})
              ])
            ])
          ]);
        }))
      ])
    ]);
  },

  controller: function(args) {
    var vm = args.vm;

    var chain = null;
    app.vm.pioPins().forEach(pin => {
      if (chain == null) {
        chain = pin.setMode(Konashi.INPUT);
      } else {
        chain = chain.then(() => {
          console.log(pin.number());
          return pin.setMode(Konashi.INPUT);
        });
      }
    });

    return {
      vm: vm,
      onClickInput: function(pin) {
        pin.toggleMode().then(() => {
          m.redraw(true);
        });
      },
      onClickState: function(pin) {
        pin.toggleState().then(() => {
          m.redraw(true);
        });
      }
    };
  }
};

})(app);
