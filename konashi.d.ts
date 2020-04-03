declare module "@ux-xu/konashi-web-bluetooth" {
  class Konashi {
    static get HIGH(): number;
    static get LOW(): number;
    static get OUTPUT(): number;
    static get INPUT(): number;
    static get PULLUP(): number;
    static get NO_PULLS(): number;

    // pins
    static get PIO0(): number;
    static get PIO1(): number;
    static get PIO2(): number;
    static get PIO3(): number;
    static get PIO4(): number;
    static get PIO5(): number;
    static get PIO6(): number;
    static get PIO7(): number;
    static get AIO0(): number;
    static get AIO1(): number;
    static get AIO2(): number;
    static get I2C_SDA(): number;
    static get I2C_SCL(): number;

    // PWM
    static get PWM_DISABLE(): number;
    static get PWM_ENABLE(): number;
    static get PWM_ENABLE_LED_MODE(): number;
    static get PWM_LED_PERIOD(): number;

    // analog I/O
    static get ANALOG_REFERENCE(): number;

    // I2C
    static get I2C_DATA_MAX_LENGTH(): number;
    static get I2C_DISABLE(): number;
    static get I2C_ENABLE(): number;
    static get I2C_ENABLE_100K(): number;
    static get I2C_ENABLE_400K(): number;
    static get I2C_STOP_CONDITION(): number;
    static get I2C_START_CONDITION(): number;
    static get I2C_RESTART_CONDITION(): number;

    // UART
    static get UART_RATE_2K4(): number;
    static get UART_RATE_9K6(): number;
    static get UART_DATA_MAX_LENGTH(): number;
    static get UART_DISABLE(): number;
    static get UART_ENABLE(): number;

    static _createUUID(part: string): string;
    static get _serviceUUID(): string;
    static get defaultFilter(): object;

    static find(willAutoConnect: boolean, options: Object): Promise<Konashi>;
    constructor(device: BluetoothDevice);

    get _c12cUUIDs(): { [key: string]: string };

    connect(): void;
    disconnect(): void;
    get isConnected(): boolean;
    get deviceName(): string;

    // start Digital I/O {
    pinMode(pin: number, mode: number): Promise<void>;
    pinModeAll(modes: number): Promise<void>;
    pinPullUp(pin: number, mode: number): Promise<void>;
    digitalWrite(pin: number, value: number): Promise<void>;
    digitalWriteAll(values: number): Promise<void>;
    digitalRead(pin: number): Promise<number>;
    startDigitalInputNotification(
      callback: (arg0: number) => void
    ): Promise<void>;
    stopDigitalInputNotification(): Promise<void>;
    // close Digital I/O }

    // start Analog Input {
    analogRead(pin: number): Promise<number>;
    // close Analog Input }

    // start PWM {
    pwmMode(pin: number, mode: number): Promise<void>;
    pwmPeriod(pin: number, period: number): Promise<void>;
    pwmDuty(pin: number, duty: number): Promise<void>;
    pwmWrite(pin: number, ratio: number): Promise<void>;
    // close PWM }

    // start uart {
    uartMode(mode: number): Promise<void>;
    uartBaudRate(rate: number): Promise<void>;
    uartWrite(data: Uint8Array): Promise<void>;
    _uartWriteChunks(chunks: Uint8Array, index: number): Promise<void>;
    _uartWrite(data: Uint8Array): Promise<void>;
    // close uart }

    // start i2c {
    i2cMode(mode: number): Promise<void>;
    i2cStopCondition(): Promise<void>;
    i2cStartCondition(): Promise<void>;
    i2cRestartCondition(): Promise<void>;
    _i2cSendCondition(condition: number): Promise<void>;
    i2cWrite(address: number, data: Uint8Array): Promise<void>;
    _i2cWriteChunks(
      address: number,
      chunks: Uint8Array,
      index: number
    ): Promise<void>;
    _i2cWrite(address: number, data: Uint8Array): Promise<void>;
    i2cRead(address: number, length: number): Promise<DataView>;
    _i2cReadRequest(address: number, length: number): Promise<void>;
    _i2cRead(callback: (arg0: DataView) => {}): Promise<void>;
    // close i2c }

    // start SPI {
    // TODO
    // close SPI }

    // start Hardware control {
    reset(): Promise<void>;
    readBatteryLevel(): Promise<number>;
    readSignalStrength(): Promise<number>;
    // close Hardware control }
  }

  export default Konashi;
}

