const konashi = require("../konashi");
const { WebBluetoothMock, DeviceMock } = require("web-bluetooth-mock");

let device;
beforeEach(() => {
  device = new DeviceMock("konashi3-020000", [0xff00]);
  global.navigator = global.navigator || {};
  global.navigator.bluetooth = new WebBluetoothMock([device]);
});

// URL: https://github.com/urish/web-bluetooth-mock
test("find device", async () => {
  jest.spyOn(global.navigator.bluetooth, "requestDevice");
  await konashi.find((willAutoConnect = false));
  expect(global.navigator.bluetooth.requestDevice).toHaveBeenCalled();
});

test("find other device", async () => {
  jest.spyOn(global.navigator.bluetooth, "requestDevice");
  let customFilter = {
    filters: [
      {
        namePrefix: "cocorokit"
      }
    ],
    optionalServices: [konashi._serviceUUID]
  };

  await expect(konashi.find(true, customFilter)).rejects.toThrow(
    "User cancelled device chooser"
  );
});

test("connect to device", async () => {
  jest.spyOn(device.gatt, "connect");
  await konashi.find((willAutoConnect = true));
  expect(device.gatt.connect).toHaveBeenCalled();
});

test("not connect to device", async () => {
  jest.spyOn(device.gatt, "connect");
  await konashi.find((willAutoConnect = false));
  expect(device.gatt.connect).not.toHaveBeenCalled();
});
