app.c.Uart = {

  view: (ctrl) => {
    return m('.panel.mdl-shadow--2dp', [
      m('.mdl-grid', [
        m('.mdl-cell.mdl-cell--12-col', [
          m('label.mdl-switch.mdl-js-switch.mdl-js-ripple-effect', [
            m('input[type=checkbox].mdl-switch__input#enable-uart'),
            m('span.mdl-switch__label', {for: 'enable-uart'}, 'Enable')
          ])
        ]),
      ]),
      m('.mdl-grid', [
        m('.mdl-cell.mdl-cell--3-col.mdl-cell--12-col-tablet.mdl-cell--12-col-phone', [
          m('strong', 'Baud Rate')
        ]),
        m('.mdl-cell.mdl-cell--3-col', [
          m('label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect', [
            m('input[type=radio]#baudrate-2400.mdl-radio__button', {value: Konashi.KONASHI_UART_RATE_2K4, name: 'baudrate'}),
            m('span.mdl-radio__label', '2400')
          ]),
        ]),
        m('.mdl-cell.mdl-cell--3-col', [
          m('label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect', [
            m('input[type=radio]#baudrate-9600.mdl-radio__button', {value: Konashi.KONASHI_UART_RATE_9K6, name: 'baudrate', checked: true}),
            m('span.mdl-radio__label', '9600')
          ])
        ])
      ]),
      m('.mdl-grid', [
        m('.mdl-cell.mdl-cell--3-col.mdl-cell--12-col-tablet.mdl-cell--12-col-phone', [
          m('strong', 'TX')
        ]),
        m('.mdl-cell.mdl-cell--9-col', [
          m('.mdl-textfield.mdl-js-textfield', [
            m('textarea#uart-tx.mdl-textfield__input', {rows: 3})
          ])
        ])
      ]),
      m('.mdl-grid', [
        m('.mdl-cell.mdl-cell--3-col.mdl-cell--hide-tablet.mdl-cell--hide-phone'),
        m('.mdl-cell.mdl-cell--3-col', [
          m('label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect', [
            m('input[type=radio].mdl-radio__button', {value: 'text', name: 'tx-type', checked: true}),
            m('span.mdl-radio__label', 'TEXT')
          ]),
        ]),
        m('.mdl-cell.mdl-cell--3-col', [
          m('label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect', [
            m('input[type=radio].mdl-radio__button', {value: 'byte', name: 'tx-type'}),
            m('span.mdl-radio__label', 'BYTE(HEX)')
          ])
        ])
      ]),
      m('.mdl-grid', [
        m('.mdl-cell.mdl-cell--3-col.mdl-cell--hide-tablet.mdl-cell--hide-phone'),
        m('.mdl-cell.mdl-cell--9-col', [
          m('input[type=submit].mdl-button.mdl-js-button.mdl-button--raised', {onclick: ctrl.onClickSubmit}, 'Send')
        ])
      ]),
      m('.mdl-grid', [
        m('.mdl-cell.mdl-cell--3-col.mdl-cell--12-col-tablet.mdl-cell--12-col-phone', [
          m('strong', 'RX')
        ]),
        m('.mdl-cell.mdl-cell--9-col', [
          m('.mdl-textfield.mdl-js-textfield', [
            m('textarea#uart-rx.mdl-textfield__input', {rows: 3})
          ])
        ])
      ]),
      m('.mdl-grid', [
        m('.mdl-cell.mdl-cell--3-col.mdl-cell--hide-tablet.mdl-cell--hide-phone'),
        m('.mdl-cell.mdl-cell--3-col', [
          m('label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect', [
            m('input[type=radio].mdl-radio__button', {value: 'text', name: 'rx-type', checked: true}),
            m('span.mdl-radio__label', 'TEXT')
          ]),
        ]),
        m('.mdl-cell.mdl-cell--3-col', [
          m('label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect', [
            m('input[type=radio].mdl-radio__button', {value: 'byte', name: 'rx-type'}),
            m('span.mdl-radio__label', 'BYTE(HEX)')
          ])
        ])
      ])
    ]);
  },

  controller: function(args) {
    var vm = args.vm;

    return {
      onClickEnable: (ev) => {
        vm.konashi().device().uartMode(ev.target.checked ? Konashi.KONASHI_UART_ENABLE : Konashi.KONASHI_UART_DISABLE)
          .then(() => {
            vm.konashi().device().uartBaudrate(Konashi.KONASHI_UART_9K6);
          });
      },
      onClickSubmit: () => {
        var value = document.querySelector('#uart-tx').value;
        var i;
        var chars = [];
        console.log(value);
        for (i = 0; i < value.length; i++) {
          chars.push(value.charCodeAt(i));
        }
        vm.konashi().device().uartWrite(new Uint8Array(chars))
          .catch(e => {
            console.log(e);
          });
      }
    };
  }
};
