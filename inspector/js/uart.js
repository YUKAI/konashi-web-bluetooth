app.c.Uart = {

  view: function(ctrl) {
    return m('.mdl-grid', [
      m('.mdl-cell.mdl-cell--4-col', 'Uart'),
      m('.mdl-cell.mdl-cell--4-col', 'BBB'),
      m('.mdl-cell.mdl-cell--4-col', 'CCC')
    ]);

  },

  controller: function(args) {
    if (!args.konashi) {
      return;
    }
    /* Debug code
    var k = app.konashi;
    k.uartMode(k.KONASHI_UART_ENABLE)
      .then(() => k.uartBaudRate(k.KONASHI_UART_RATE_9K6))
      .then(
        () => {
          k.uartWrite(new Uint8Array(
                  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                   'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                   'l', 'm', 'n'].map(v => v.charCodeAt(0))));
        },
        (e) => {
          console.log('Error', e);
        });
    */
  }
};
