document.addEventListener('DOMContentLoaded', () => {
  app.pages.push(new app.Page('System Info', app.c.SystemInfo));
  app.pages.push(new app.Page('Digital I/O', app.c.Pio));
  app.pages.push(new app.Page('PWM',         app.c.Pwm));
  app.pages.push(new app.Page('Anlog IN',    app.c.AnalogIn));
  //app.pages.push(new app.Page('UART',        app.c.Uart));
  m.mount(document.body, app);
});
