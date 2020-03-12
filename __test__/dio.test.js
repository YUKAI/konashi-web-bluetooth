const konashi = require("../konashi");
const { WebBluetoothMock, DeviceMock } = require("web-bluetooth-mock");

let device;
beforeEach(() => {
  device = new DeviceMock("konashi3-020000");
  global.navigator = global.navigator || {};
  global.navigator.bluetooth = new WebBluetoothMock([device]);
});

/**
 * Digital pin mode
 */
test("Change digital pin mode", async () => {
  const controlCharacteristic = device
    .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
    .getCharacteristicMock("229b3000-03fb-40da-98a7-b0def65c2d4b"); //3000

  controlCharacteristic.writeValue = jest.fn();
  controlCharacteristic.value = new DataView(new Uint8Array([0]).buffer);

  const k = await konashi.find();
  let errorMsg = "";
  await k
    .pinMode(konashi.PIO0, konashi.OUTPUT)
    .catch(e => (errorMsg = e.message));

  // web-bluetooth-mock does not impliment "GATT operation already in progress."
  // return Promise.resolve(value)
  expect(errorMsg).toEqual("Cannot read property 'catch' of undefined");
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b00000001])
  );
});

/**
 * Change Digital pin mode at all.
 */
test("Change all digital pin mode", async () => {
  const controlCharacteristic = device
    .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
    .getCharacteristicMock("229b3000-03fb-40da-98a7-b0def65c2d4b"); //3000

  controlCharacteristic.writeValue = jest.fn();
  controlCharacteristic.value = new DataView(new Uint8Array([0]).buffer);

  const k = await konashi.find();
  let errorMsg = "";
  await k.pinModeAll(0b01010101).catch(e => (errorMsg = e.message));

  expect(errorMsg).toEqual("Cannot read property 'catch' of undefined");
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b01010101])
  );
  expect(controlCharacteristic.writeValue).not.toHaveBeenCalledWith(
    new Uint8Array([0b10101010])
  );
});

/**
 * Change digital pin pullup or not.
 */
test("Change digital pin pullup", async () => {
  const controlCharacteristic = device
    .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
    .getCharacteristicMock("229b3001-03fb-40da-98a7-b0def65c2d4b"); //3001

  controlCharacteristic.writeValue = jest.fn();
  controlCharacteristic.value = new DataView(new Uint8Array([0]).buffer);

  const k = await konashi.find();
  let errorMsg = "";
  await k
    .pinPullUp(konashi.PIO1, konashi.PULLUP)
    .catch(e => (errorMsg = e.message));

  expect(errorMsg).toEqual("Cannot read property 'catch' of undefined");
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b00000010])
  );
});

/**
 * Write a single digital pin.
 */
test("Write single digital pin value", async () => {
  const controlCharacteristic = device
    .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
    .getCharacteristicMock("229b3002-03fb-40da-98a7-b0def65c2d4b"); //3002

  controlCharacteristic.writeValue = jest.fn();
  controlCharacteristic.value = new DataView(new Uint8Array([0]).buffer);

  const k = await konashi.find();
  let errorMsg = "";
  await k
    .digitalWrite(konashi.PIO3, konashi.HIGH)
    .catch(e => (errorMsg = e.message));

  expect(errorMsg).toEqual("Cannot read property 'catch' of undefined");
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b00001000]) // konashi.PIO3
  );
  expect(controlCharacteristic.writeValue).not.toHaveBeenCalledWith(
    new Uint8Array([0b00000100]) // not konashi.PIO2
  );

  // initial state: PIO3(HIGH)
  controlCharacteristic.value = new DataView(
    new Uint8Array([0b00001000]).buffer
  );
  k.digitalWrite(konashi.PIO4, konashi.HIGH).catch(e => (errorMsg = e.message));
  expect(errorMsg).toEqual("Cannot read property 'catch' of undefined");
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b00011000]) // konashi.PIO3
  );
  expect(controlCharacteristic.writeValue).not.toHaveBeenCalledWith(
    new Uint8Array([0b00010000]) // not konashi.PIO2
  );
});

/**
 * Digital Write at all
 */
test("Write digital pins value at all", async () => {
  const controlCharacteristic = device
    .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
    .getCharacteristicMock("229b3002-03fb-40da-98a7-b0def65c2d4b"); //3002

  controlCharacteristic.writeValue = jest.fn();
  controlCharacteristic.value = new DataView(new Uint8Array([0]).buffer);

  const k = await konashi.find();
  let errorMsg = "";
  await k
    .digitalWriteAll(0x1F)
    .catch(e => (errorMsg = e.message));

  expect(errorMsg).toEqual("Cannot read property 'catch' of undefined");
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b00011111])
  );

  // initial state: PIO0(HIGH)
  controlCharacteristic.value = new DataView(
    new Uint8Array([0b00000001]).buffer
  );

  k.digitalWriteAll(0b00010100).catch(e => (errorMsg = e.message));
  expect(errorMsg).toEqual("Cannot read property 'catch' of undefined");
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b00010100]) // not konashi.PIO2
  );
  expect(controlCharacteristic.writeValue).not.toHaveBeenCalledWith(
    new Uint8Array([0b00010101]) // konashi.PIO3
  );
});

/**
 * Digital Read from a single pin
 */
test("Read a value from single pin", async () => {
  const controlCharacteristic = device
    .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
    .getCharacteristicMock("229b3003-03fb-40da-98a7-b0def65c2d4b"); //3003

  controlCharacteristic.writeValue = jest.fn();
  controlCharacteristic.value = new DataView(new Uint8Array([0]).buffer);

  // readValue have been called.
  jest.spyOn(controlCharacteristic, "readValue");
  const k = await konashi.find();
  const value = await k.digitalRead(konashi.PIO2);
  expect(controlCharacteristic.readValue).toHaveBeenCalled();

  // readValue was same as setting.
  controlCharacteristic.value = new DataView(new Uint8Array([0b00001000]).buffer);
  const value0 = await k.digitalRead(konashi.PIO0);
  const value3 = await k.digitalRead(konashi.PIO3);

  expect(value0).toEqual(0);
  expect(value3).toEqual(1);
});

/**
 * Input Notification Start Stop
 */
test("Input Notification", async() => {
  const controlCharacteristic = device
  .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
  .getCharacteristicMock("229b3003-03fb-40da-98a7-b0def65c2d4b"); //3003
  
  let notifiedValue = 0;
  const receivedFunction = (value) => {
    notifiedValue = value; // set Int8Number
  }

  controlCharacteristic.value = new DataView(new Uint8Array([0b00000000]).buffer);

  // startNotification have been called
  jest.spyOn(controlCharacteristic, "startNotifications");
  const k = await konashi.find();
  await k.startDigitalInputNotification(receivedFunction);
  expect(controlCharacteristic.startNotifications).toHaveBeenCalled();

  jest.spyOn(controlCharacteristic, "stopNotifications");
  await k.stopDigitalInputNotification();
  expect(controlCharacteristic.stopNotifications).toHaveBeenCalled();
})

