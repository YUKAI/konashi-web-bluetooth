# konashi SDK for Web Bluetooth

konashi を Web Bluetooth で操作できます。  
現在：ドキュメント等準備中

```js
import { konashi } from "@ux-xu/konashi-web-bluetooth";

window.addEventListener("click", async () => {
  const k = await konashi.find();
  await k
    .pinMode(konashi.PIO0, konashi.OUTPUT)
    .catch(error => console.log(error));
  let i = 0;
  setInterval(async () => {
    k.digitalWrite(konashi.PIO0, i % 2 === 0 ? konashi.HIGH : konashi.LOW);
  }, 1000);
});
```

## konashi inspector for Web Bluetooth using Vue.js

konashi の機能を簡単に操作できるツール

comming soon...

## 動作環境

公式GithubのImplementation Status をご確認ください。  
https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md


## 導入

### Windows, Mac, Linux

Chrome をインストール・アップグレードする。

### Android

Chrome をインストール・アップグレードする。

### iOS

WebBLE（有料）アプリをインストールする。  
https://apps.apple.com/jp/app/webble/id1193531073

## 開発ツール

node.js


