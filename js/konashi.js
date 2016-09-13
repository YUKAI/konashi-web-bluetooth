'use strict';
(() => {

const consts = {
  HIGH: 1,
  LOW: 0,
  OUTPUT: 1,
  INPUT: 0,
  PULLUP: 1,
  NO_PULLS: 0,
  ENABLE: 1,
  DISABLE: 0,
  TRUE: 1,
  FALSE: 0,
  KONASHI_SUCCESS: 0,
  KONASHI_FAILURE: -1,

  // Konashi I/0 pin
  PIO0: 0,
  PIO1: 1,
  PIO2: 2,
  PIO3: 3,
  PIO4: 4,
  PIO5: 5,
  PIO6: 6,
  PIO7: 7,
  S1: 0,
  LED2: 1,
  LED3: 2,
  LED4: 3,
  LED5: 4,
  AIO0: 0,
  AIO1: 1,
  AIO2: 2,
  I2C_SDA: 6,
  I2C_SCL: 7,

  // Konashi PWM
  KONASHI_PWM_DISABLE: 0,
  KONASHI_PWM_ENABLE: 1,
  KONASHI_PWM_ENABLE_LED_MODE: 2,
  KONASHI_PWM_LED_PERIOD: 10000,  // 10ms

  // Konashi analog I/O
  KONASHI_ANALOG_REFERENCE: 1300, // 1300mV

  // Konashi UART baudrate
  KONASHI_UART_RATE_2K4: 0x000a,
  KONASHI_UART_RATE_9K6: 0x0028,

  // Konashi I2C
  KONASHI_I2C_DATA_MAX_LENGTH: 18,
  KONASHI_I2C_DISABLE: 0,
  KONASHI_I2C_ENABLE: 1,
  KONASHI_I2C_ENABLE_100K: 1,
  KONASHI_I2C_ENABLE_400K: 2,
  KONASHI_I2C_STOP_CONDITION: 0,
  KONASHI_I2C_START_CONDITION: 1,
  KONASHI_I2C_RESTART_CONDITION: 2,

  // Konashi UART
  KONASHI_UART_DATA_MAX_LENGTH: 19,
  KONASHI_UART_DISABLE: 0,
  KONASHI_UART_ENABLE: 1,

  // Konashi SPI
  KOSHIAN_SPI_SPEED_200K: 20,
  KOSHIAN_SPI_SPEED_500K: 50,
  KOSHIAN_SPI_SPEED_1M: 100,
  KOSHIAN_SPI_SPEED_2M: 200,
  KOSHIAN_SPI_SPEED_3M: 300,
  KOSHIAN_SPI_SPEED_6M: 600,
  
  KOSHIAN_SPI_MODE_CPOL0_CPHA0: 0,
  KOSHIAN_SPI_MODE_CPOL0_CPHA1: 1,
  KOSHIAN_SPI_MODE_CPOL1_CPHA0: 2,
  KOSHIAN_SPI_MODE_CPOL1_CPHA1: 3,
  KOSHIAN_SPI_MODE_DISABLE: -1,
  
  KOSHIAN_SPI_BIT_ORDER_LSB_FIRST: 0,
  KOSHIAN_SPI_BIT_ORDER_MSB_FIRST: 1
};

class Konashi {
  /**
   * Returns konashi's service UUID
   *
   * @returns {String}
   */
  static get _serviceUUID() {
    return '229bff00-03fb-40da-98a7-b0def65c2d4b';
  }

  /**
   * Returns konashi's UUID with label
   *
   * @returns {Object<String, String>} key: label, value: UUID
   */
  static get _characteristicUUIDs() {
    return {
      analogInput:   '229b3008-03fb-40da-98a7-b0def65c2d4b',
      pioSetting:    '229b3000-03fb-40da-98a7-b0def65c2d4b',
      pioOutput:     '229b3002-03fb-40da-98a7-b0def65c2d4b',
      pioPullUp:     '229b3001-03fb-40da-98a7-b0def65c2d4b',
      pioInputNotification:
                     '229b3003-03fb-40da-98a7-b0def65c2d4b',
      pwmConfig:     '229b3004-03fb-40da-98a7-b0def65c2d4b',
      pwmParameter:  '229b3005-03fb-40da-98a7-b0def65c2d4b',
      pwmDuty:       '229b3006-03fb-40da-98a7-b0def65c2d4b',
      analogDrive:   '229b3007-03fb-40da-98a7-b0def65c2d4b',
      analogRead0:   '229b3008-03fb-40da-98a7-b0def65c2d4b',
      analogRead1:   '229b3009-03fb-40da-98a7-b0def65c2d4b',
      analogRead2:   '229b300a-03fb-40da-98a7-b0def65c2d4b',
      i2cConfig:     '229b300b-03fb-40da-98a7-b0def65c2d4b',
      i2cStartStop:  '229b300c-03fb-40da-98a7-b0def65c2d4b',
      i2cWrite:      '229b300d-03fb-40da-98a7-b0def65c2d4b',
      i2cReadParameter:
                     '229b300e-03fb-40da-98a7-b0def65c2d4b',
      i2cRead:       '229b300f-03fb-40da-98a7-b0def65c2d4b',
      uartConfig:    '229b3010-03fb-40da-98a7-b0def65c2d4b',
      uartBaudRate:  '229b3011-03fb-40da-98a7-b0def65c2d4b',
      uartTx:        '229b3012-03fb-40da-98a7-b0def65c2d4b',
      uartRxNotification:
                     '229b3013-03fb-40da-98a7-b0def65c2d4b',
      hardwareReset: '229b3014-03fb-40da-98a7-b0def65c2d4b',
      hardwareLowBatteryNotification:
                     '229b3015-03fb-40da-98a7-b0def65c2d4b'
    };
  }

  /**
   * Find konasih2 device
   *
   * @param {Boolean} [autoConnect]
   * @param {Object} [options] defaul: `{filters: [{namePrefix: 'konashi2'}], optionalServices: ['229bff00-03fb-40da-98a7-b0def65c2d4b']}`
   * @returns {Promise<Konashi>}
   */
  static find(autoConnect, options) {
    if (typeof autoConnect == undefined) {
      autoConnect = true;
    }
    options = options || {filters: [{namePrefix: 'konashi2'}], optionalServices: [Konashi._serviceUUID]};
    return new Promise((resolve, reject) => {
      navigator.bluetooth
        .requestDevice(options)
        .then(
          (d) => {
            var konashi = new Konashi(d);
            if (autoConnect) {
              konashi.connect().then(resolve, reject);
            } else {
              resolve(konashi);
            }
          },
          (e) => {
            reject(e)
          }
        );
    });
  }

  /**
   * constructor
   *
   * @param {BluetoothDevice}
   */
  constructor(device) {
    /** BluetoothDevice */
    this._device = device;
    /** BluetoothGATTRemoteServer */
    this._gatt = null;
    /** BluetoothGATTService */
    this._service = null;
    /** Object<String, BluetoothGATTCharacteristic> */
    this._characteristic = {};

    for (let key in consts) {
        this[key] = consts[key];
    }
    // TODO
    this._pioOutputStore = 0;

    // TODO
    this._pwmSettingStore = 0;
  }

  /**
   * Connect to konashi
   *
   * Assign `_gatt` and `_service` properties when
   * the connection has been made.
   *
   * @returns {Promise<Konashi>}
   */
  connect() {
    var that = this;
    return new Promise((resolve, reject) => {
      that._device.gatt.connect()
        .then(
          (gatt) => {
            that._gatt = gatt;
            return gatt.getPrimaryService(Konashi._serviceUUID);
          },
          (e) => reject(e)
        )
        .then(
          (service) => {
            that._service = service;
            var promises = [], keys = [];
            for (let key in Konashi._characteristicUUIDs) {
              keys.push(key);
            }
            keys.forEach((label, i) => {
              promises.push(
                that._service.getCharacteristic(Konashi._characteristicUUIDs[label]).then(
                  (c) => {
                    // TODO: Watch changes of all characteristics
                    // https://github.com/WebBluetoothCG/web-bluetooth/issues/176
                    that._characteristic[label] = c;
                    Promise.resolve();
                  }
                )
              );
            });
            return Promise.all(promises);
          },
          (e) => reject(e)
        )
        .then(
          () => resolve(that),
          (e) => reject(e)
        );
    });
  }  

  isConnected() {
  }

  /**
   * Returns peripheral name
   *
   * @returns {Promise<String>}
   */
  peripheralName() {}

  delay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }

  // { Digital I/O

  /**
   * Set konashi's pin mode
   *
   * @param {Number} Konashi.PIO[0-7]
   * @param {Number} Konashi.(INPUT|OUTPUT)
   * @returns {Promise<void>}
   */
  pinMode(pin, flag) {
    var that = this;
    return new Promise((resolve, reject) => {
      that._characteristic.pioSetting.readValue()
        .then((v) => {
          var data = new Uint8Array(v)[0];
          if (flag == consts.OUTPUT) {
            data |= 0x01 << pin;
          } else {
            data &= ~(0x01 << pin);
          }
          this._characteristic.pioSetting.writeValue(new Uint8Array([data]))
            .then(resolve, reject);
        });
    });
  }

  /**
   * Set pullup mode
   *
   * @param {Number} Konashi.PIO[0-7]
   * @param {Number} Konashi.(PULLUP|NO_PULLS)
   * @returns {Promise<Void>}
   */
  pinPullup(pin, mode) {
      var that = this;
      return new Promise((resolve, reject) => {
        that._characteristic.pioPullUp.readValue()
          .then(v => {
            var data = new Uint8Array(v)[0];
            if (mode == consts.PULLUP) {
              data |= 0x01 << pin;
            } else {
              data &= ~(0x01 << pin);
            }
            this._characteristic.pioPullUp.writeValue(new Uint8Array([data]))
              .then(resolve, reject);
          });
      });
  }

  /**
   * Read a value of digital pin
   *
   * @param {Number} Konashi.PIO[0-7]
   * @returns {Promise<Number>} Konashi.(LOW|HIGH)
   */
  digitalRead(pin) {
    return this._characteristic.pioInputNotification.readValue()
      .then((buf) => {
        var bufview = new Uint8Array(buf);
        return bufview[0];
      });
  }

  /**
   * Write value to a digital pin
   *
   * https://github.com/YUKAI/konashi-android-sdk/blob/master/konashi-android-sdk/src/main/java/com/uxxu/konashi/lib/dispatcher/PioStoreUpdater.java
   * https://github.com/YUKAI/konashi-android-sdk/blob/master/konashi-android-sdk/src/main/java/com/uxxu/konashi/lib/store/PioStore.java#L19 
   *
   * @param {Number} Konashi.PIO[0-7]
   * @param {Number} Konashi.(LOW|HIGH)
   * @returns {Promise<Void>} 
   */
  digitalWrite(pin, value) {
    if (value == consts.HIGH) {
      this._pioOutputStore |= 0x01 << pin;
    } else {
      this._pioOutputStore &= ~(0x01 << pin) & 0xFF;
    }
    return this._characteristic.pioOutput.writeValue(new Uint8Array([this._pioOutputStore]));
  }

  // Digital I/O }

  // { Analog Input

  /**
   * Read an analog pin
   *
   * @param {Number} Konashi.PIO[0-7]
   * @returns {Promise<Number>}
   */
  analogRead(pin) {
    var c;
    switch (pin) {
      case consts.AIO0:
        c = this._characteristic.analogRead0;
        break;
      case consts.AIO1:
        c = this._characteristic.analogRead1;
        break;
      case consts.AIO2:
        c = this._characteristic.analogRead2;
        break;
    }
    return this._characteristic.pioInputNotification.readValue()
      .then((buf) => {
        return new Uint8Array(buf)[0];
      });
  }

  // Analog Input }

  // { PWM

  pwmMode(pin, mode) {
    console.log('pwmMode: ' + pin + ' ' + mode);
    if (mode == consts.KONASHI_PWM_ENABLE || mode == consts.KONASHI_PWM_ENABLE_LED_MODE) {
      this._pwmSettingStore |= 0x01 << pin;
    } else {
      this._pwmSettingStore &= ~(0x01 << pin) & 0xff;
    }
    var that = this,
        data = new Uint8Array([this._pwmSettingStore]);
    if (mode == consts.KONASHI_PWM_ENABLE_LED_MODE) {
        return this.pwmPeriod(pin, consts.KONASHI_PWM_LED_PERIOD)
          .then(() => that.pwmDuty(pin, 0))
          .then(() => that._characteristic.pwmConfig.writeValue(data));
    }
    return this._characteristic.pwmConfig.writeValue(data);
  }

  pwmPeriod(pin, period) {
    var data = new Uint8Array([pin,
                               (period >> 24) & 0xff,
                               (period >> 16) & 0xff,
                               (period >> 8) & 0xff,
                               (period >> 0) & 0xff]);
    return this._characteristic.pwmParameter.writeValue(data);

  }

  pwmDuty(pin, duty) {
    duty = parseInt(duty);
    var data = new Uint8Array([pin,
                               (duty >> 24) & 0xff,
                               (duty >> 16) & 0xff,
                               (duty >> 8) & 0xff,
                               (duty >> 0) & 0xff]);
    console.log('pwmDuty: ' + pin + ' ' + duty);
    return this._characteristic.pwmDuty.writeValue(data);
  }

  pwmWrite(pin, ratio) {
    ratio = Math.min(100, Math.max(0, ratio));
    var duty = consts.KONASHI_PWM_LED_PERIOD * ratio / 100;
    return this.pwmDuty(pin, duty);
  }

  // PWM }

  // { UART

  uartMode(mode) {}
  uartBaudrate(baudrate) {}
  uartWrite(data) {}

  // UART }

  // { I2C

  i2cMode(mode) {}
  i2cStartCondition() {}
  i2cRestartCondition() {}
  i2cStopCondition() {}
  i2cWrite(address, data) {}
  i2cRead(address, length) {}
  
  // I2C }

  // { SPI

  spiMode(mode, speed, bitOrder) {}
  spiWrite(data) {}
  spiRead() {}

  // SPI }

  // { Hardware Control

  reset() {}

  /**
   * Read battery level
   *
   * @returns {Promise<Number>}
   */
  batteryLevelRead() {
    return new Promise((resolve, reject) => {
      this._gatt.getPrimaryService('battery_service')
        .then(service => {
          return service.getCharacteristic('battery_level');
        })
        .then(v => {
          resolve(new Uint8Array(v)[0]);
        });
    });
  }

  /**
   * Read deivce's RSSI
   *
   * @returns {Number} RSSI
   */
  signalStrengthRead() {}

  // Hardware Control }
}

class IOState {

    static get pioModes() {
    }

    static get pioPullups() {
    }

    static get pioInputs() {
    }

    static get pioOutputs() {
    }

    static get pwmModes() {
    }

    static get pwmPeriods() {
    }

    static get pwmDuties() {
    }

    static get aio0() {
    }

    static get aio1() {
    }

    static get aio2() {
    }

    static get uartMode() {
    }

    static get uartBaudrate() {
    }

    static get uartData() {
    }

    static get i2cMode() {
    }

    static get i2cAddress() {
    }

    static get i2cData() {
    }

    static get i2cDataLength() {
    }

    static get spiMode() {
    }

    static get spiEndianness() {
    }

    static get spiSpeed() {
    }

    static get spiData() {
    }
}

for (let key in consts) {
    Konashi[key] = consts[key];
}

window.Konashi = Konashi;

})(); // root
