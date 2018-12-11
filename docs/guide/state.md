# State

### 單一狀態樹

Vuex 使用**單一狀態樹**——是的，用一個物件就包含了全部的應用層級狀態。
至此它便作爲一個“唯一數據源 ([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth))”而存在。
這也意味着，每個應用將僅僅包含一個 store 實例。
單一狀態樹讓我們能夠直接地定位任一特定的狀態片段，在調試的過程中也能輕易地取得整個當前應用狀態的快照。

單狀態樹和模組化並不衝突——在後面的章節裏我們會討論如何將狀態和狀態變更事件分佈到各個子模組中。

### 在 Vue 組件中獲得 Vuex 狀態

那麼我們如何在 Vue 組件中展示狀態呢？由於 Vuex 的狀態存儲是響應式的，從 store 實例中讀取狀態最簡單的方法就是在[計算屬性](https://cn.vuejs.org/guide/computed.html)中返回某個狀態：

``` js
// 創建一個 Counter 組件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

每當 `store.state.count` 變化的時候, 都會重新求取計算屬性，並且觸發更新相關聯的 DOM。

然而，這種模式導致組件依賴全局狀態單例。在模組化的構建系統中，在每個需要使用 state 的組件中需要頻繁地導入，並且在測試組件時需要模擬狀態。

Vuex 通過 `store` 選項，提供了一種機制將狀態從根組件“注入”到每一個子組件中（需調用 `Vue.use(Vuex)`）：

``` js
const app = new Vue({
  el: '#app',
  // 把 store 物件提供給 “store” 選項，這可以把 store 的實例注入所有的子組件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

通過在根實例中註冊 `store` 選項，該 store 實例會注入到根組件下的所有子組件中，且子組件能通過 `this.$store` 訪問到。讓我們更新下 `Counter` 的實現：

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### `mapState` 輔助函數

當一個組件需要獲取多個狀態時候，將這些狀態都聲明爲計算屬性會有些重複和冗餘。爲了解決這個問題，我們可以使用 `mapState` 輔助函數幫助我們生成計算屬性，讓你少按幾次鍵：

``` js
// 在單獨構建的版本中輔助函數爲 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭頭函數可使代碼更簡練
    count: state => state.count,

    // 傳字符串參數 'count' 等同於 `state => state.count`
    countAlias: 'count',

    // 爲了能夠使用 `this` 獲取局部狀態，必須使用常規函數
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

當映射的計算屬性的名稱與 state 的子節點名稱相同時，我們也可以給 `mapState` 傳一個字符串數組。

``` js
computed: mapState([
  // 映射 this.count 爲 store.state.count
  'count'
])
```

### 物件展開運算符

`mapState` 函數返回的是一個物件。我們如何將它與局部計算屬性混合使用呢？通常，我們需要使用一個工具函數將多個物件合併爲一個，以使我們可以將最終物件傳給 `computed` 屬性。但是自從有了[物件展開運算符](https://github.com/sebmarkbage/ecmascript-rest-spread)（現處於 ECMASCript 提案 stage-4 階段），我們可以極大地簡化寫法：

``` js
computed: {
  localComputed () { /* ... */ },
  // 使用物件展開運算符將此物件混入到外部物件中
  ...mapState({
    // ...
  })
}
```

### 組件仍然保有局部狀態

使用 Vuex 並不意味着你需要將**所有的**狀態放入 Vuex。
雖然將所有的狀態放到 Vuex 會使狀態變化更顯式和易調試，但也會使代碼變得冗長和不直觀。
如果有些狀態嚴格屬於單個組件，最好還是作爲組件的局部狀態。
你應該根據你的應用開發需要進行權衡和確定。
