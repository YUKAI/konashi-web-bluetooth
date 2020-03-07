class konashi {
  /*
   * start konashi constants
   */
  // value 
  static get HIGH() {
    return 1;
  }
  static get LOW() {
    return 0;
  }
  static get OUTPUT() {
    return 1;
  }
  static get INPUT() {
    return 0;
  }
  static get PULLUP() {
    return 1;
  }
  static get NO_PULLS() {
    return 0;
  }

  // pins
  static get PIO0() {
    return 0;
  }
  static get PIO1() {
    return 1;
  }
  static get PIO2() {
    return 2;
  }
  static get PIO3() {
    return 3;
  }
  static get PIO4() {
    return 4;
  }
  static get PIO5() {
    return 5;
  }
  static get PIO6() {
    return 6;
  }
  static get PIO7() {
    return 7;
  }
  static get AIO0() {
    return 0;
  }
  static get AIO1() {
    return 1;
  }
  static get AIO2() {
    return 2;
  }
  static get I2C_SDA() {
    return 6;
  }
  static get I2C_SCL() {
    return 7;
  }

  // PWM
  static get PWM_DISABLE() {
    return 0;
  }
  static get PWM_ENABLE() {
    return 1;
  }
  static get PWM_ENABLE_LED_MODE() {
    return 2;
  }
  static get PWM_LED_PERIOD() {
    return 10000; // 10ms
  }

  // analog I/O
  static get ANALOG_REFERENCE() {
    return 1300; // 1300mV
  }

  // I2C
  static get I2C_DATA_MAX_LENGTH() {
    return 16; // since konashi2
  }
  static get I2C_DISABLE() {
    return 0;
  }
  static get I2C_ENABLE() {
    return 1;
  }
  static get I2C_ENABLE_100K() {
    return 1;
  }
  static get I2C_ENABLE_400K() {
    return 2;
  }
  static get I2C_STOP_CONDITION() {
    return 0;
  }
  static get I2C_START_CONDITION() {
    return 1;
  }
  static get I2C_RESTART_CONDITION() {
    return 2;
  }

  // UART
  static get UART_RATE_2K4() {
    return 0x000a;
  }
  static get UART_RATE_9K6() {
    return 0x0028;
  }
  static get UART_DATA_MAX_LENGTH() {
    return 19;
  }
  static get UART_DISABLE() {
    return 0;
  }
  static get UART_ENABLE() {
    return 1;
  }

  // SPI
  static get SPI_SPEED_200K() {
    return 20;
  }
  static get SPI_SPEED_500K() {
    return 50;
  }
  static get SPI_SPEED_1M() {
    return 100;
  }
  static get SPI_SPEED_2M() {
    return 200;
  }
  static get SPI_SPEED_3M() {
    return 300;
  }
  static get SPI_SPEED_6M() {
    return 600;
  }
  static get SPI_MODE_CPOL0_CPHA0() {
    return 0;
  }
  static get SPI_MODE_CPOL0_CPHA1() {
    return 1;
  }
  static get SPI_MODE_CPOL1_CPHA0() {
    return 2;
  }
  static get SPI_MODE_CPOL1_CPHA1() {
    return 3;
  }
  static get SPI_MODE_DISABLE() {
    return -1;
  }
  static get SPI_BIT_ORDER_LSB_FIRST() {
    return 0;
  }
  static get SPI_BIT_ORDER_MSB_FIRST() {
    return 1
  }
  /*
   * close konashi constants
   */

  /**
   * Create konashi UUID
   * 
   * @param {String} part 4 characters hex
   * @returns {String}
   */
  static _createUUID(part) {
    return '229b' + part + '-03fb-40da-98a7-b0def65c2d4b';
  }

  /**
   * Returns konashi's service UUID
   * 
   * @returns {String}
   */
  static get _serviceUUID() {
    return _createUUID('ff00');
  }

  /**
   * Returns default filter object
   * 
   * @returns {Object}
   */
  static get defaultFilter() {
    return {
      filters: [{
        namePrefix: 'konashi'
      }],
      optionalServices: [konashi._serviceUUID]
    }
  }

  /**
   * Find konashi device
   * 
   * @param {Boolean} willAutoConnect default: true
   * @param {Object} options default: konashi.defaultFilter
   * @returns {konashi}
   */
  static async find(willAutoConnect = true, options = konashi.defaultFilter) {
    const device = await navigator.bluetooth.requestDevice(options);
    const k = new konashi(device);

    if (willAutoConnect) await k.connect();

    return k;
  }

  /**
   * @param {BluetoothDevice} device 
   */
  constructor(device) {
    this._device = device;
    this._gatt = null;
    this._service = null;
    this._c12c = {};
    this._pioOutputs = 0;
  }

  get _c12cUUIDs() {
    return {
      pioSetting: konashi._createUUID('3000'),
      pioPullUp: konashi._createUUID('3001'),
      pioOutput: konashi._createUUID('3002'),
      pioInputNotification: konashi._createUUID('3003'),
      pwmConfig: konashi._createUUID('3004'),
      pwmParameter: konashi._createUUID('3005'),
      pwmDuty: konashi._createUUID('3006'),
      analogDrive: konashi._createUUID('3007'),
      analogInput: konashi._createUUID('3008'),
      analogRead0: konashi._createUUID('3008'),
      analogRead1: konashi._createUUID('3009'),
      analogRead2: konashi._createUUID('300a'),
      i2cConfig: konashi._createUUID('300b'),
      i2cStartStop: konashi._createUUID('300c'),
      i2cWrite: konashi._createUUID('300d'),
      i2cReadParameter: konashi._createUUID('300e'),
      i2cRead: konashi._createUUID('300f'),
      uartConfig: konashi._createUUID('3010'),
      uartBaudRate: konashi._createUUID('3011'),
      uartTx: konashi._createUUID('3012'),
      uartRxNotification: konashi._createUUID('3013'),
      hardwareReset: konashi._createUUID('3014'),
      hardwareLowBatteryNotification: konashi._createUUID('3015'),
    };
  }

  /**
   * Connect to konashi
   * Assign `_gatt` and `_service` properties to this when the connection has been made.
   */
  async connect() {
    this._gatt = await this._device.gatt.connect()
      .catch(e => console.error(e));
    this._service = await this._gatt.getPrimaryService(konashi._serviceUUID)
      .catch(e => console.error(e));

    for (const uuid in this._c12cUUIDs) {
      const c = await this._service.getCharacteristic(this._c12cUUIDs[uuid])
        .catch(e => console.error(e));
      this._c12c[uuid] = c;
    }
  }

  /**
   * Return connection condition
   * 
   * @returns {Boolean}
   */
  get isConnected() {
    let connected = false;
    if (this._gatt) {
      connected = this._gatt.connected;
    }
    return connected;
  }

  /**
   * Returns device name
   * 
   * @returns {String}
   */
  get deviceName() {
    return this._device.name;
  }

  // start Digital I/O

  /**
   * Set konashi Digital I/O pin mode
   * 
   * @param {Number} pin konashi.PIO(0-7)
   * @param {Number} io konashi.(INPUT|OUTPUT)
   */
  pinMode(pin, io) {
    const value = await this._c12c.pioSetting.readValue();
    let modes = value.getUnit8(0);

    if (io === konashi.OUTPUT) {
      modes |= 0x01 << pin;
    } else {
      modes &= ~(0x01 << pin) & 0xff;
    }

    await this._c12c.pioSetting.writeValue(new Uint8Array([modes]));
  }

  /**
   * Set konashi Digital I/O pin mode at all
   * 
   * @param {Number} modes 0x00-0xFF 0:INPUT, 1:OUTPUTk
   */
  pinModeAll(modes) {
    if (modes >= 0x00 && modes <= 0xFF) {
      await this._c12c.pioSetting.writeValue(new Uint8Array([modes]));
    }
  }

  /**
   * Set konashi Digital I/O pin pullup mode
   * 
   * @param {Number} pin konashi.PIO(0-7)
   * @param {Number} mode konashi.(PULLUP|NO_PULLS)
   */
  pinPullUp(pin, mode) {
    const value = await this._c12c.pioPullUp.readValue();
    let modes = value.getUnit8(0);

    if (io === konashi.PULLUP) {
      modes |= 0x01 << pin;
    } else {
      modes &= ~(0x01 << pin) & 0xff;
    }

    await this._c12c.pioPullUp.writeValue(new Uint8Array([modes]));
  }

  /**
   * Set HIGH or LOW to a digital pin
   * 
   * @param {Number} pin konashi.PIO(0-7)
   * @param {Number} value konashi.(HIGH|LOW)
   */
  digitalWrite(pin, value) {
    if (value === konashi.HIGH) {
      this._pioOutputs |= 0x01 << pin;
    }
    else {
      this._pioOutputs &= ~(0x01 << pin) & 0xff;
    }
    // TODO: この write のエラーをハンドリングすることで、
    // 送信したかどうかの true, false が取れるのでは？
    await this._c12c.pioOutput.writeValue(new Uint8Array([this._pioOutputs]));
  }

}