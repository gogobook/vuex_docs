# Vuex 是什麼？

Vuex 是一個專爲 Vue.js 應用程序開發的**狀態管理模式**。它採用集中式存儲管理應用的所有組件的狀態，並以相應的規則保證狀態以一種可預測的方式發生變化。Vuex 也集成到 Vue 的官方調試工具 [devtools extension](https://github.com/vuejs/vue-devtools)，提供了諸如零配置的 time-travel 調試、狀態快照導入導出等高級調試功能。

### 什麼是“狀態管理模式”？

讓我們從一個簡單的 Vue 計數應用開始：

``` js
new Vue({
  // state
  data () {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
})
```

這個狀態自管理應用包含以下幾個部分：

- **state**，驅動應用的數據源；
- **view**，以聲明方式將 **state** 映射到視圖；
- **actions**，響應在 **view** 上的用戶輸入導致的狀態變化。

以下是一個表示“單向數據流”理念的極簡示意：

<p style="text-align: center; margin: 2em;">
  <img style="width: 100%; max-width: 450px;" src="/flow.png">
</p>

但是，當我們的應用遇到**多個組件共享狀態**時，單向數據流的簡潔性很容易被破壞：

- 多個視圖依賴於同一狀態。
- 來自不同視圖的行爲需要變更同一狀態。

對於問題一，傳參的方法對於多層嵌套的組件將會非常繁瑣，並且對於兄弟組件間的狀態傳遞無能爲力。對於問題二，我們經常會採用父子組件直接引用或者通過事件來變更和同步狀態的多份拷貝。以上的這些模式非常脆弱，通常會導致無法維護的代碼。

因此，我們爲什麼不把組件的共享狀態抽取出來，以一個全局單例模式管理呢？在這種模式下，我們的組件樹構成了一個巨大的“視圖”，不管在樹的哪個位置，任何組件都能獲取狀態或者觸發行爲！

另外，通過定義和隔離狀態管理中的各種概念並強制遵守一定的規則，我們的代碼將會變得更結構化且易維護。

這就是 Vuex 背後的基本思想，借鑑了 [Flux](https://facebook.github.io/flux/docs/overview.html)、[Redux](http://redux.js.org/)、和 [The Elm Architecture](https://guide.elm-lang.org/architecture/)。與其他模式不同的是，Vuex 是專門爲 Vue.js 設計的狀態管理庫，以利用 Vue.js 的細粒度數據響應機制來進行高效的狀態更新。

![vuex](/vuex.png)

### 什麼情況下我應該使用 Vuex？

雖然 Vuex 可以幫助我們管理共享狀態，但也附帶了更多的概念和框架。這需要對短期和長期效益進行權衡。

如果您不打算開發大型單頁應用，使用 Vuex 可能是繁瑣冗餘的。確實是如此——如果您的應用夠簡單，您最好不要使用 Vuex。一個簡單的 [store 模式](https://cn.vuejs.org/v2/guide/state-management.html#簡單狀態管理起步使用)就足夠您所需了。但是，如果您需要構建一箇中大型單頁應用，您很可能會考慮如何更好地在組件外部管理狀態，Vuex 將會成爲自然而然的選擇。引用 Redux 的作者 Dan Abramov 的話說就是：

> Flux 架構就像眼鏡：您自會知道什麼時候需要它。
