# 開始

每一個 Vuex 應用的核心就是 store（倉庫）。“store”基本上就是一個容器，它包含着你的應用中大部分的**狀態 (state)**。Vuex 和單純的全局對象有以下兩點不同：

1. Vuex 的狀態存儲是響應式的。當 Vue 組件從 store 中讀取狀態的時候，若 store 中的狀態發生變化，那麼相應的組件也會相應地得到高效更新。

2. 你不能直接改變 store 中的狀態。改變 store 中的狀態的唯一途徑就是顯式地**提交 (commit) mutation**。這樣使得我們可以方便地跟蹤每一個狀態的變化，從而讓我們能夠實現一些工具幫助我們更好地瞭解我們的應用。

### 最簡單的 Store

> **提示：** 我們將在後續的文檔示例代碼中使用 ES2015 語法。如果你還沒能掌握 ES2015，[你得抓緊了](https://babeljs.io/docs/learn-es2015/)！

[安裝](../installation.md) Vuex 之後，讓我們來創建一個 store。創建過程直截了當——僅需要提供一個初始 state 對象和一些 mutation：

``` js
// 如果在模塊化構建系統中，請確保在開頭調用了 Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

現在，你可以通過 `store.state` 來獲取狀態對象，以及通過 `store.commit` 方法觸發狀態變更：

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

再次強調，我們通過提交 mutation 的方式，而非直接改變 `store.state.count`，是因爲我們想要更明確地追蹤到狀態的變化。這個簡單的約定能夠讓你的意圖更加明顯，這樣你在閱讀代碼的時候能更容易地解讀應用內部的狀態改變。此外，這樣也讓我們有機會去實現一些能記錄每次狀態改變，保存狀態快照的調試工具。有了它，我們甚至可以實現如時間穿梭般的調試體驗。

由於 store 中的狀態是響應式的，在組件中調用 store 中的狀態簡單到僅需要在計算屬性中返回即可。觸發變化也僅僅是在組件的 methods 中提交 mutation。

這是一個[最基本的 Vuex 記數應用](https://jsfiddle.net/n9jmu5v7/1269/)示例。

接下來，我們將會更深入地探討一些核心概念。讓我們先從 [State](state.md) 概念開始。
