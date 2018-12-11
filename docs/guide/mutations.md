# Mutation

更改 Vuex 的 store 中的狀態的唯一方法是提交 mutation。Vuex 中的 mutation 非常類似於事件：每個 mutation 都有一個字符串的 **事件類型 (type)** 和 一個 **回調函數 (handler)**。這個回調函數就是我們實際進行狀態更改的地方，並且它會接受 state 作爲第一個參數：

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 變更狀態
      state.count++
    }
  }
})
```

你不能直接調用一個 mutation handler。這個選項更像是事件註冊：“當觸發一個類型爲 `increment` 的 mutation 時，調用此函數。”要喚醒一個 mutation handler，你需要以相應的 type 調用 **store.commit** 方法：

``` js
store.commit('increment')
```

### 提交載荷（Payload）

你可以向 `store.commit` 傳入額外的參數，即 mutation 的 **載荷（payload）**：

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('increment', 10)
```

在大多數情況下，載荷應該是一個物件，這樣可以包含多個欄位並且記錄的 mutation 會更易讀：

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

``` js
store.commit('increment', {
  amount: 10
})
```

### 物件風格的提交方式

提交 mutation 的另一種方式是直接使用包含 `type` 屬性的物件：

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

當使用物件風格的提交方式，整個物件都作爲載荷傳給 mutation 函數，因此 handler 保持不變：

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Mutation 需遵守 Vue 的響應規則

既然 Vuex 的 store 中的狀態是響應式的，那麼當我們變更狀態時，監視狀態的 Vue 組件也會自動更新。這也意味着 Vuex 中的 mutation 也需要與使用 Vue 一樣遵守一些注意事項：

1. 最好提前在你的 store 中初始化好所有所需屬性。

2. 當需要在物件上添加新屬性時，你應該

  - 使用 `Vue.set(obj, 'newProp', 123)`, 或者

  - 以新物件替換老物件。例如，利用 stage-3 的[物件展開運算符](https://github.com/sebmarkbage/ecmascript-rest-spread)我們可以這樣寫：

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### 使用常量替代 Mutation 事件類型

使用常量替代 mutation 事件類型在各種 Flux 實現中是很常見的模式。這樣可以使 linter 之類的工具發揮作用，同時把這些常量放在單獨的文件中可以讓你的代碼合作者對整個 app 包含的 mutation 一目瞭然：

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我們可以使用 ES2015 風格的計算屬性命名功能來使用一個常量作爲函數名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

用不用常量取決於你——在需要多人協作的大型項目中，這會很有幫助。但如果你不喜歡，你完全可以不這樣做。

### Mutation 必須是同步函數

一條重要的原則就是要記住 **mutation 必須是同步函數**。爲什麼？請參考下面的例子：

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

現在想象，我們正在 debug 一個 app 並且觀察 devtool 中的 mutation 日誌。每一條 mutation 被記錄，devtools 都需要捕捉到前一狀態和後一狀態的快照。然而，在上面的例子中 mutation 中的異步函數中的回調讓這不可能完成：因爲當 mutation 觸發的時候，回調函數還沒有被調用，devtools 不知道什麼時候回調函數實際上被調用——實質上任何在回調函數中進行的狀態的改變都是不可追蹤的。

### 在組件中提交 Mutation

你可以在組件中使用 `this.$store.commit('xxx')` 提交 mutation，或者使用 `mapMutations` 輔助函數將組件中的 methods 映射爲 `store.commit` 調用（需要在根節點注入 `store`）。

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 將 `this.increment()` 映射爲 `this.$store.commit('increment')`

      // `mapMutations` 也支持載荷：
      'incrementBy' // 將 `this.incrementBy(amount)` 映射爲 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 將 `this.add()` 映射爲 `this.$store.commit('increment')`
    })
  }
}
```

### 下一步：Action

在 mutation 中混合異步調用會導致你的程序很難調試。例如，當你調用了兩個包含異步回調的 mutation 來改變狀態，你怎麼知道什麼時候回調和哪個先回調呢？這就是爲什麼我們要區分這兩個概念。在 Vuex 中，**mutation 都是同步事務**：

``` js
store.commit('increment')
// 任何由 "increment" 導致的狀態變更都應該在此刻完成。
```

爲了處理異步操作，讓我們來看一看 [Action](actions.md)。
