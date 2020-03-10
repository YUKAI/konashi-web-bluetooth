const konashi = require("../konashi");
const { WebBluetoothMock, DeviceMock } = require("web-bluetooth-mock");

// if test using web-bluetooth-mock you need to delete catch function
// such as await konashi.pinMode(konashi.PIO0, konashi.HIGH);
// because the web-bluetooth-mock return only Promise.resolve().
// TODO: clone web-bluetooth-mock and modify for konashi.

let device;
beforeEach(() => {
  device = new DeviceMock("konashi3-020000");
  global.navigator = global.navigator || {};
  global.navigator.bluetooth = new WebBluetoothMock([device]);
});

test("Change digital pin mode", async () => {
  const controlCharacteristic = device
    .getServiceMock("229bff00-03fb-40da-98a7-b0def65c2d4b")
    .getCharacteristicMock("229b3000-03fb-40da-98a7-b0def65c2d4b");

  controlCharacteristic.writeValue = jest.fn();
  controlCharacteristic.value = new DataView(new Uint8Array([0]).buffer);

  const k = await konashi.find();
  await k.pinMode(konashi.PIO0, konashi.OUTPUT);
  expect(controlCharacteristic.writeValue).toHaveBeenCalledWith(
    new Uint8Array([0b00000001])
  );
});
