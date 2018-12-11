# Module

由於使用單一狀態樹，應用的所有狀態會集中到一個比較大的物件。當應用變得非常複雜時，store 物件就有可能變得相當臃腫。

爲了解決以上問題，Vuex 允許我們將 store 分割成**模組（module）**。每個模組擁有自己的 state、mutation、action、getter、甚至是嵌套子模組——從上至下進行同樣方式的分割：

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的狀態
store.state.b // -> moduleB 的狀態
```

### 模組的局部狀態

對於模組內部的 mutation 和 getter，接收的第一個參數是**模組的局部狀態物件**。

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // 這裏的 `state` 物件是模組的局部狀態
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

同樣，對於模組內部的 action，局部狀態通過 `context.state` 暴露出來，根節點狀態則爲 `context.rootState`：

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

對於模組內部的 getter，根節點狀態會作爲第三個參數暴露出來：

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### 命名空間

默認情況下，模組內部的 action、mutation 和 getter 是註冊在**全局命名空間**的——這樣使得多個模組能夠對同一 mutation 或 action 作出響應。

如果希望你的模組具有更高的封裝度和複用性，你可以通過添加 `namespaced: true` 的方式使其成爲帶命名空間的模組。當模組被註冊後，它的所有 getter、action 及 mutation 都會自動根據模組註冊的路徑調整命名。例如：

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模組內容（module assets）
      state: { ... }, // 模組內的狀態已經是嵌套的了，使用 `namespaced` 屬性不會對其產生影響
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模組
      modules: {
        // 繼承父模組的命名空間
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 進一步嵌套命名空間
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

啓用了命名空間的 getter 和 action 會收到局部化的 `getter`，`dispatch` 和 `commit`。換言之，你在使用模組內容（module assets）時不需要在同一模組內額外添加空間名前綴。更改 `namespaced` 屬性後不需要修改模組內的代碼。

#### 在帶命名空間的模組內訪問全局內容（Global Assets）

如果你希望使用全局 state 和 getter，`rootState` 和 `rootGetter` 會作爲第三和第四參數傳入 getter，也會通過 `context` 物件的屬性傳入 action。

若需要在全局命名空間內分發 action 或提交 mutation，將 `{ root: true }` 作爲第三參數傳給 `dispatch` 或 `commit` 即可。

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在這個模組的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四個參數來調用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在這個模組中， dispatch 和 commit 也被局部化了
      // 他們可以接受 `root` 屬性以訪問根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### 在帶命名空間的模組註冊全局 action

若需要在帶命名空間的模組註冊全局 action，你可添加 `root: true`，並將這個 action 的定義放在函數 `handler` 中。例如：

``` js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

#### 帶命名空間的綁定函數

當使用 `mapState`, `mapGetters`, `mapActions` 和 `mapMutations` 這些函數來綁定帶命名空間的模組時，寫起來可能比較繁瑣：

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

對於這種情況，你可以將模組的空間名稱字符串作爲第一個參數傳遞給上述函數，這樣所有綁定都會自動將該模組作爲上下文。於是上面的例子可以簡化爲：

``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

而且，你可以通過使用 `createNamespacedHelpers` 創建基於某個命名空間輔助函數。它返回一個物件，物件裏有新的綁定在給定命名空間值上的組件綁定輔助函數：

``` js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### 給插件開發者的注意事項

如果你開發的[插件（Plugin）](plugins.md)提供了模組並允許用戶將其添加到 Vuex store，可能需要考慮模組的空間名稱問題。對於這種情況，你可以通過插件的參數物件來允許用戶指定空間名稱：

``` js
// 通過插件的參數物件得到空間名稱
// 然後返回 Vuex 插件函數
export function createPlugin (options = {}) {
  return function (store) {
    // 把空間名字添加到插件模組的類型（type）中去
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### 模組動態註冊

在 store 創建**之後**，你可以使用 `store.registerModule` 方法註冊模組：

``` js
// 註冊模組 `myModule`
store.registerModule('myModule', {
  // ...
})
// 註冊嵌套模組 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

之後就可以通過 `store.state.myModule` 和 `store.state.nested.myModule` 訪問模組的狀態。

模組動態註冊功能使得其他 Vue 插件可以通過在 store 中附加新模組的方式來使用 Vuex 管理狀態。例如，[`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) 插件就是通過動態註冊模組將 vue-router 和 vuex 結合在一起，實現應用的路由狀態管理。

你也可以使用 `store.unregisterModule(moduleName)` 來動態卸載模組。注意，你不能使用此方法卸載靜態模組（即創建 store 時聲明的模組）。

在註冊一個新 module 時，你很有可能想保留過去的 state，例如從一個服務端渲染的應用保留 state。你可以通過 `preserveState` 選項將其歸檔：`store.registerModule('a', module, { preserveState: true })`。

### 模組重用

有時我們可能需要創建一個模組的多個實例，例如：

- 創建多個 store，他們公用同一個模組 (例如當 `runInNewContext` 選項是 `false` 或 `'once'` 時，爲了[在服務端渲染中避免有狀態的單例](https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons))
- 在一個 store 中多次註冊同一個模組

如果我們使用一個純物件來聲明模組的狀態，那麼這個狀態物件會通過引用被共享，導致狀態物件被修改時 store 或模組間數據互相污染的問題。

實際上這和 Vue 組件內的 `data` 是同樣的問題。因此解決辦法也是相同的——使用一個函數來聲明模組狀態（僅 2.3.0+ 支持）：

``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutation, action 和 getter 等等...
}
```
