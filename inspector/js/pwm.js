((app) => {

app.c.Pwm = {

  view: (ctrl) => {
    return m('.mdl-layout', [
      m('table.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp', [
        m('thead', [
          m('tr', [
            m('th', 'PIN'),
            m('th', 'PWM'),
            m('th', 'Duty')
          ])
        ]),
        m('tbody', ctrl.vm.pwmPins().map(pin => {
          return m('tr', [
            m('td', pin.number()),
            m('td', [
              m('label.mdl-switch.mdl-js-switch.mdl-js-ripple-effect', [
                m('input[type=checkbox].mdl-switch__input#pwm-pin-' + pin.number(), {onchange: (ev) => { ctrl.onCheckSwitch(pin, ev.target.checked); }}),
                m('span.mdl-switch__label')
              ])
            ]),
            m('td', [m('input.mdl-slider.mdl-js-slider',
                       {onchange: (ev) => { ctrl.onChangeDuty(pin, ev.target.value); },
                        type: 'range',
                        min: 0,
                        max: 100,
                        value: pin.pwmDuty()})])
          ]);
        }))
      ])
    ]);
  },

  controller: (args) => {
    var vm = args.vm;
    return {
      vm: vm,
      onChangeDuty: (pin, value) => {
        pin.pwmLedDrive(value).then(() => m.redraw());
      },
      onCheckSwitch: (pin, checked) => {
        pin.setPwmMode(checked ? Konashi.KONASHI_PWM_ENABLE_LED_MODE : Konashi.KONASHI_PWM_DISABLE);
      }
    };
  }
};

})(app);
