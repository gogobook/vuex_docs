# Action

Action 類似於 mutation，不同在於：

- Action 提交的是 mutation，而不是直接變更狀態。
- Action 可以包含任意異步操作。

讓我們來註冊一個簡單的 action：

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 函數接受一個與 store 實例具有相同方法和屬性的 context 物件，因此你可以調用 `context.commit` 提交一個 mutation，或者通過 `context.state` 和 `context.getters` 來獲取 state 和 getters。當我們在之後介紹到 [Modules](modules.md) 時，你就知道 context 物件爲什麼不是 store 實例本身了。

實踐中，我們會經常用到 ES2015 的 [參數解構](https://github.com/lukehoban/es6features#destructuring) 來簡化代碼（特別是我們需要調用 `commit` 很多次的時候）：

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### 分發 Action

Action 通過 `store.dispatch` 方法觸發：

``` js
store.dispatch('increment')
```

乍一眼看上去感覺多此一舉，我們直接分發 mutation 豈不更方便？實際上並非如此，還記得 **mutation 必須同步執行**這個限制麼？Action 就不受約束！我們可以在 action 內部執行**異步**操作：

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Actions 支持同樣的載荷方式和物件方式進行分發：

``` js
// 以載荷形式分發
store.dispatch('incrementAsync', {
  amount: 10
})

// 以物件形式分發
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

來看一個更加實際的購物車示例，涉及到**調用異步 API** 和**分發多重 mutation**：

``` js
actions: {
  checkout ({ commit, state }, products) {
    // 把當前購物車的物品備份起來
    const savedCartItems = [...state.cart.added]
    // 發出結賬請求，然後樂觀地清空購物車
    commit(types.CHECKOUT_REQUEST)
    // 購物 API 接受一個成功回調和一個失敗回調
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失敗操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

注意我們正在進行一系列的異步操作，並且通過提交 mutation 來記錄 action 產生的副作用（即狀態變更）。

### 在組件中分發 Action

你在組件中使用 `this.$store.dispatch('xxx')` 分發 action，或者使用 `mapActions` 輔助函數將組件的 methods 映射爲 `store.dispatch` 調用（需要先在根節點注入 `store`）：

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 將 `this.increment()` 映射爲 `this.$store.dispatch('increment')`

      // `mapActions` 也支持載荷：
      'incrementBy' // 將 `this.incrementBy(amount)` 映射爲 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 將 `this.add()` 映射爲 `this.$store.dispatch('increment')`
    })
  }
}
```

### 組合 Action

Action 通常是異步的，那麼如何知道 action 什麼時候結束呢？更重要的是，我們如何才能組合多個 action，以處理更加複雜的異步流程？

首先，你需要明白 `store.dispatch` 可以處理被觸發的 action 的處理函數返回的 Promise，並且 `store.dispatch` 仍舊返回 Promise：

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

現在你可以：

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

在另外一個 action 中也可以：

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

最後，如果我們利用 [async / await](https://tc39.github.io/ecmascript-asyncawait/)，我們可以如下組合 action：

``` js
// 假設 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

> 一個 `store.dispatch` 在不同模組中可以觸發多個 action 函數。在這種情況下，只有當所有觸發函數完成後，返回的 Promise 纔會執行。
