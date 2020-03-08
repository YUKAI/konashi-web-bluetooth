const konashi = require("../konashi");

test("service UUID", () => {
  const uuid = konashi._serviceUUID;
  expect(uuid).toBe("229bff00-03fb-40da-98a7-b0def65c2d4b");
});

test("create UUID", () => {
  expect(konashi._createUUID("ff00")).toBe(
    "229bff00-03fb-40da-98a7-b0def65c2d4b"
  );
  expect(konashi._createUUID("3005")).toBe(
    "229b3005-03fb-40da-98a7-b0def65c2d4b"
  );
});

test("default filter", () => {
  expect(konashi.defaultFilter).toEqual({
    filters: [{ namePrefix: "konashi" }],
    optionalServices: ["229bff00-03fb-40da-98a7-b0def65c2d4b"]
  });
});

