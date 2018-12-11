# 嚴格模式

開啓嚴格模式，僅需在創建 store 的時候傳入 `strict: true`：

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

在嚴格模式下，無論何時發生了狀態變更且不是由 mutation 函數引起的，將會拋出錯誤。這能保證所有的狀態變更都能被調試工具跟蹤到。

### 開發環境與發佈環境

**不要在發佈環境下啓用嚴格模式！**嚴格模式會深度監測狀態樹來檢測不合規的狀態變更——請確保在發佈環境下關閉嚴格模式，以避免性能損失。

類似於插件，我們可以讓構建工具來處理這種情況：

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
