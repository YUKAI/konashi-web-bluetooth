# konashi for Web Bluetooth

konashi を Web Bluetooth で動かす試み。
https://github.com/toyoshim/konashi-js-sdk/tree/web_bluetooth は konashi.js をそのまま動かす想定で実装されているが、このリポジトリでは Web Bluetooth を Promise で操作するもっと薄いラッパーを実装することを目指す。


```javascript
window.addEventListener('click', () => {
  Konashi.find(true /* autoconnect */).then(k => {
    k.pinMode(k.PIO1, k.OUTPUT)
      .then(() => {
        var i = 0;
        setInterval(() => {
          k.digitalWrite(k.PIO1, i % 2 == 0 ? k.HIGH : k.LOW);
          i++;
        }, 500);
      });
  });
});

```


## 動作環境

- Mac El Capitan + Chromium 55.x
- Android 6 + Chrome Dev 54.x
- konashi firmware: 2.x


## 導入

### Mac

1. https://download-chromium.appspot.com/ から Chromium をダウンロードする。
2. `chrome://flags/#enable-web-bluetooth` を開いて Web Bluetooth を有効にする。
3. https://yukai.github.io/konashi-web-bluetooth/examples/pio.html で L チカができる事を確認。


### Android

1. Android 6 に [Chrome Dev](https://play.google.com/store/apps/details?id=com.chrome.dev&hl=en) をインストール。
2. `chrome://flags/#enable-web-bluetooth` を開いて Web Bluetooth を有効にする。
3. https://yukai.github.io/konashi-web-bluetooth/examples/pio.html で L チカができる事を確認。


## 開発ツール

- `fab run_web_server` で https の開発サーバーが起動する。
- PC 上に Android Chrome のログを表示 [Remote Debugging on Android with Chrome](https://developer.chrome.com/devtools/docs/remote-debugging)


## メモ

- 実装状況: [Implementation Status](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md)
- Android では Bluetooth の他に位置情報も ON にしないといけない。


## 参考

- [Web Bluetooth Draft Community Group Report](https://webbluetoothcg.github.io/web-bluetooth/)
- [Interact with BLE devices on the Web - Google Developers](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en)
- [chrome.bluetoothLowEnergy - Google Chrome](https://developer.chrome.com/apps/bluetoothLowEnergy)
- [Web Bluetoothを使ってkonashi2.0でLチカしてみる](http://qiita.com/toyoshim/items/74ae7551dc2c9ab9cbf6)
- [konashi.js向けのコードをChromeで実行](http://qiita.com/toyoshim/items/05b1d14ca925d5df3e43)
