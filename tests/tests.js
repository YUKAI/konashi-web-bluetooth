QUnit.test('.find', (assert) => {
  return Konashi.find(true, {}).then((_k) => {
    assert.ok(_k instanceof Konashi);
  });
});

Konashi.find(true).then((k) => {

  QUnit.module('.pinMode', () => {
    QUnit.test('INPUT', (assert) => {
      return k.pinMode(k.PIO0, k.INPUT)
        .then(() => k.pinMode(k.PIO1, k.INPUT))
        .then(() => k.pinMode(k.PIO2, k.INPUT))
        .then(() => k.pinMode(k.PIO3, k.INPUT))
        .then(() => k.pinMode(k.PIO4, k.INPUT))
        .then(() => {
          assert.ok(true);
        });
    });
    QUnit.test('OUTPUT', (assert) => {
      return k.pinMode(k.PIO0, k.OUTPUT)
        .then(() => k.pinMode(k.PIO1, k.OUTPUT))
        .then(() => k.pinMode(k.PIO2, k.OUTPUT))
        .then(() => k.pinMode(k.PIO3, k.OUTPUT))
        .then(() => k.pinMode(k.PIO4, k.OUTPUT))
        .then(() => {
          assert.ok(true);
        });
    });
    QUnit.test('INPUT & OUTPUT', (assert) => {
      return k.pinMode(k.PIO0, k.INPUT)
        .then(() => k.pinMode(k.PIO1, k.OUTPUT))
        .then(() => k.pinMode(k.PIO2, k.INPUT))
        .then(() => k.pinMode(k.PIO3, k.OUTPUT))
        .then(() => k.pinMode(k.PIO4, k.INPUT))
        .then(() => {
          assert.ok(true);
        });
    });
  }); // .pinMode


});

