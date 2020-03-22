const Konashi = require("../konashi");
const { WebBluetoothMock, DeviceMock } = require("web-bluetooth-mock");

let device;
beforeEach(() => {
  device = new DeviceMock("konashi3-020000");
  global.navigator = global.navigator || {};
  global.navigator.bluetooth = new WebBluetoothMock([device]);
});

// URL: https://github.com/urish/web-bluetooth-mock
test("find device", async () => {
  jest.spyOn(global.navigator.bluetooth, "requestDevice");
  await Konashi.find((willAutoConnect = false));
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
    optionalServices: [Konashi._serviceUUID]
  };

  await expect(Konashi.find(true, customFilter)).rejects.toThrow(
    "User cancelled device chooser"
  );
});

test("connect to device", async () => {
  jest.spyOn(device.gatt, "connect");
  await Konashi.find((willAutoConnect = true));
  expect(device.gatt.connect).toHaveBeenCalled();
});

test("not connect to device", async () => {
  jest.spyOn(device.gatt, "connect");
  await Konashi.find((willAutoConnect = false));
  expect(device.gatt.connect).not.toHaveBeenCalled();
});
