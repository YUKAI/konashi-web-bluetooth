const Konashi = require("../konashi");

test("service UUID", () => {
  const uuid = Konashi._serviceUUID;
  expect(uuid).toBe("229bff00-03fb-40da-98a7-b0def65c2d4b");
});

test("create UUID", () => {
  expect(Konashi._createUUID("ff00")).toBe(
    "229bff00-03fb-40da-98a7-b0def65c2d4b"
  );
  expect(Konashi._createUUID("3005")).toBe(
    "229b3005-03fb-40da-98a7-b0def65c2d4b"
  );
});

test("default filter", () => {
  expect(Konashi.defaultFilter).toEqual({
    filters: [{ namePrefix: "konashi" }],
    optionalServices: ["229bff00-03fb-40da-98a7-b0def65c2d4b"]
  });
});

