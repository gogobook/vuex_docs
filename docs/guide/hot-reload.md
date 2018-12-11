# 熱重載

使用 webpack 的 [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/)，Vuex 支持在開發過程中熱重載 mutation、module、action 和 getter。你也可以在 Browserify 中使用 [browserify-hmr](https://github.com/AgentME/browserify-hmr/) 插件。

對於 mutation 和模組，你需要使用 `store.hotUpdate()` 方法：

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // 使 action 和 mutation 成爲可熱重載模組
  module.hot.accept(['./mutations', './modules/a'], () => {
    // 獲取更新後的模組
    // 因爲 babel 6 的模組編譯格式問題，這裏需要加上 `.default`
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // 加載新模組
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

參考熱重載示例 [counter-hot](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot)。
