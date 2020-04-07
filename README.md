# konashi 3.0 SDK for Web Bluetooth

konashi 3.0 を Web Bluetooth で操作することができます。

開発言語は以下のものに対応しております。

- JavaScript(ES2015, async await)
- typescript

konashi 公式ドキュメント：https://konashi.ux-xu.com/

```js
import { Konashi } from "@ux-xu/konashi-web-bluetooth";

window.addEventListener("click", async () => {
  const k = await Konashi.find();
  await k
    .pinMode(Konashi.PIO0, Konashi.OUTPUT)
    .catch((error) => console.log(error));
  let i = 0;
  setInterval(async () => {
    k.digitalWrite(Konashi.PIO0, i % 2 === 0 ? Konashi.HIGH : Konashi.LOW);
  }, 1000);
});
```

## 動作環境

Web Bluetooth API 公式 Github の Implementation Status をご確認ください。

https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md

## 導入

### Windows, Mac, Linux

Chrome をインストール・アップグレードする。

### Android

Chrome をインストール・アップグレードする。

### iOS

WebBLE（有料）アプリをインストールする。  
https://apps.apple.com/jp/app/webble/id1193531073

## 機能と関数について

現在対応している機能は以下の通りです。

- Digital I/O
- Digital Input Notification
- Analog Input
- PWM
- UART

対応していない機能は以下の通りです

- Analog Output（未実装）
- SPI（未実装）
- I2C(未検証)

## 関数について

typescript の定義を利用して説明します。

### 定数

`Konashi.HIGH` で呼びだせる定数です。

```typescript
static get HIGH(): number;  // Digital HIGH
static get LOW(): number;  // Digital LOW
static get OUTPUT(): number;  // mode: Digital Pin OUTPUT
static get INPUT(): number;  // mode: Digital Pin INPUT
static get PULLUP(): number;  // mode: Digital pullup
static get NO_PULLS(): number;  // mode: Digital no pullup

// ピンの定義
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
static get PWM_DISABLE(): number;  // PWM mode: disable
static get PWM_ENABLE(): number;  // PWM mode: enable
static get PWM_ENABLE_LED_MODE(): number;  // PWM mode: LED mode
static get PWM_LED_PERIOD(): number;  // PWM constant: LED mode period

// analog I/O
static get ANALOG_REFERENCE(): number;  // konashi3.0 のアナログ値 1300mV

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

static get _serviceUUID(): string;
static get defaultFilter(): object;
```

### クラス関数

konashi のインスタンスを作成するために利用する関数群

```typescript
static _createUUID(part: string): string;
static find(willAutoConnect: boolean, options: Object): Promise<Konashi>;
```

以下のサンプルは，

①konashiを見つけて自動的に接続する
②cocorokitを見つけて接続する

```js
const konashi = await Konashi.findk();
const konashi = await Konashi.find({
  filters: [{ namePrefix: "cocorokit" }],
  optionalServices: [Konashi._serviceUUID],
});
```

### インスタンス関数

`find` 関数に `willAutoConnect = false` を設定した場合，別途接続する必要があります．

```typescript
connect(): void;
disconnect(): void;
```

以下，見つけて接続するサンプルです．

```js
const konashi = await Konashi.find(willAutoConnect = false);
await konashi.connect().catch(async error => {
  whatyouwant();
});
```

#### 接続したkonashiの情報を取得する関数

```typescript
get _c12cUUIDs(): { [key: string]: string };
get isConnected(): boolean;
get deviceName(): string;
```

#### デジタルピンの入出力

```typescript
// start Digital I/O {
pinMode(pin: number, mode: number): Promise<void>;
pinModeAll(modes: number): Promise<void>;
pinPullUp(pin: number, mode: number): Promise<void>;
digitalWrite(pin: number, value: number): Promise<void>;
digitalWriteAll(values: number): Promise<void>;
digitalRead(pin: number): Promise<number>;
startDigitalInputNotification(callback: (arg0: number) => void): Promise<void>;
stopDigitalInputNotification(): Promise<void>;
// close Digital I/O }
```

```js
const konashi = await Konashi.find();

async () => {
  await konashi.pinMode(Konashi.PIO0, Konashi.OUTPUT);
  await konashi.digitalWrite(Konashi.PIO0, Konashi.HIGH);
}

async () => {
  await konashi.pinModeAll(0b11111111);
  await konashi.digitalWriteAll(0b11111111);
}

async () => {
  await konashi.pinMode(Konashi.PIO0, Konashi.INPUT)
  const p0_input = await konashi.digitalRead(Konashi.PIO0);
}

const printValue = (value) => {
  console.log("received: " + value);
}

konashi.startDigitalInputNotification(printValue);

// if input pin 1 value changed to HIGH
// received: 0b00000010

konashi.startDigitalInputNotification(printValue);
```

#### アナログピンの入力

```typescript
// start Analog Input {
analogRead(pin: number): Promise<number>;
// close Analog Input }
```

```js
const konashi = await Konashi.find();
const analog0_value = konashi.analogRead(Konashi.AIO0);
```

#### PWM の操作

```typescript
// start PWM {
pwmMode(pin: number, mode: number): Promise<void>;
pwmPeriod(pin: number, period: number): Promise<void>;
pwmDuty(pin: number, duty: number): Promise<void>;
pwmWrite(pin: number, ratio: number): Promise<void>;
// close PWM }
```

```js
const konashi = await Konashi.find();
konashi.pwmMode(Konashi.PIO1, Konashi.PWM_ENABLE_LED_MODE);
konashi.pwmWrite(Konashi.PIO1, 100);
```
#### その他デバイスの操作

```typescript
// start Hardware control {
reset(): Promise<void>;
readBatteryLevel(): Promise<number>;
readSignalStrength(): Promise<number>;
// close Hardware control }
```
