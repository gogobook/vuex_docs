---
sidebar: auto
---

# API 參考

## Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

## Vuex.Store 構造器選項

### state

- 類型: `Object | Function`

  Vuex store 實例的根 state 物件。[詳細介紹](../guide/state.md)

  如果你傳入返回一個物件的函數，其返回的物件會被用作根 state。這在你想要重用 state 物件，尤其是對於重用 module 來說非常有用。[詳細介紹](../guide/modules.md#模組重用)

### mutations

- 類型: `{ [type: string]: Function }`

  在 store 上註冊 mutation，處理函數總是接受 `state` 作爲第一個參數（如果定義在模組中，則爲模組的局部狀態），`payload` 作爲第二個參數（可選）。

  [詳細介紹](../guide/mutations.md)

### actions

- 類型: `{ [type: string]: Function }`

  在 store 上註冊 action。處理函數總是接受 `context` 作爲第一個參數，`payload` 作爲第二個參數（可選）。

  `context` 物件包含以下屬性：

  ``` js
  {
    state,      // 等同於 `store.state`，若在模組中則爲局部狀態
    rootState,  // 等同於 `store.state`，只存在於模組中
    commit,     // 等同於 `store.commit`
    dispatch,   // 等同於 `store.dispatch`
    getters,    // 等同於 `store.getters`
    rootGetters // 等同於 `store.getters`，只存在於模組中
  }
  ```

  同時如果有第二個參數 `payload` 的話也能夠接收。

  [詳細介紹](../guide/actions.md)

### getters

- 類型: `{ [key: string]: Function }`

在 store 上註冊 getter，getter 方法接受以下參數：

  ```
  state,     // 如果在模組中定義則爲模組的局部狀態
  getters,   // 等同於 store.getters
  ```

  當定義在一個模組裏時會特別一些：

  ```
  state,       // 如果在模組中定義則爲模組的局部狀態
  getters,     // 等同於 store.getters
  rootState    // 等同於 store.state
  rootGetters  // 所有 getters
  ```

  註冊的 getter 暴露爲 `store.getters`。

  [詳細介紹](../guide/getters.md)

### modules

- 類型: `Object`

  包含了子模組的物件，會被合併到 store，大概長這樣：

  ``` js
  {
    key: {
      state,
      namespaced?,
      mutations,
      actions?,
      getters?,
      modules?
    },
    ...
  }
  ```

  與根模組的選項一樣，每個模組也包含 `state` 和 `mutations` 選項。模組的狀態使用 key 關聯到 store 的根狀態。模組的 mutation 和 getter 只會接收 module 的局部狀態作爲第一個參數，而不是根狀態，並且模組 action 的 `context.state` 同樣指向局部狀態。

  [詳細介紹](../guide/modules.md)

### plugins

- 類型: `Array<Function>`

  一個數組，包含應用在 store 上的插件方法。這些插件直接接收 store 作爲唯一參數，可以監聽 mutation（用於外部地數據持久化、記錄或調試）或者提交 mutation （用於內部數據，例如 websocket 或 某些觀察者）

  [詳細介紹](../guide/plugins.md)

### strict

- 類型: `Boolean`
- 默認值: `false`

  使 Vuex store 進入嚴格模式，在嚴格模式下，任何 mutation 處理函數以外修改 Vuex state 都會拋出錯誤。

  [詳細介紹](../guide/strict.md)

### devtools

- 類型：`Boolean`

  爲某個特定的 Vuex 實例打開或關閉 devtools。對於傳入 `false` 的實例來說 Vuex store 不會訂閱到 devtools 插件。可用於一個頁面中有多個 store 的情況。

  ``` js
  {
    devtools: false
  }
  ```

## Vuex.Store 實例屬性

### state

- 類型: `Object`

  根狀態，只讀。

### getters

- 類型: `Object`

  暴露出註冊的 getter，只讀。

## Vuex.Store 實例方法

### commit

- `commit(type: string, payload?: any, options?: Object)`
- `commit(mutation: Object, options?: Object)`

  提交 mutation。`options` 裏可以有 `root: true`，它允許在[命名空間模組](../guide/modules.md#命名空間)裏提交根的 mutation。[詳細介紹](../guide/mutations.md)

### dispatch

- `dispatch(type: string, payload?: any, options?: Object)`
- `dispatch(action: Object, options?: Object)`

  分發 action。`options` 裏可以有 `root: true`，它允許在[命名空間模組](../guide/modules.md#命名空間)裏分發根的 action。返回一個解析所有被觸發的 action 處理器的 Promise。[詳細介紹](../guide/actions.md)

### replaceState

- `replaceState(state: Object)`

  替換 store 的根狀態，僅用狀態合併或時光旅行調試。

### watch

- `watch(fn: Function, callback: Function, options?: Object): Function`

  響應式地偵聽 `fn` 的返回值，當值改變時調用回調函數。`fn` 接收 store 的 state 作爲第一個參數，其 getter 作爲第二個參數。最後接收一個可選的物件參數表示 Vue 的 [`vm.$watch`](https://cn.vuejs.org/v2/api/#watch) 方法的參數。

  要停止偵聽，調用此方法返回的函數即可停止偵聽。

### subscribe

- `subscribe(handler: Function): Function`

  訂閱 store 的 mutation。`handler` 會在每個 mutation 完成後調用，接收 mutation 和經過 mutation 後的狀態作爲參數：

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  要停止訂閱，調用此方法返回的函數即可停止訂閱。

  通常用於插件。[詳細介紹](../guide/plugins.md)

### subscribeAction

- `subscribeAction(handler: Function): Function`

  > 2.5.0 新增

  訂閱 store 的 action。`handler` 會在每個 action 分發的時候調用並接收 action 描述和當前的 store 的 state 這兩個參數：

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  要停止訂閱，調用此方法返回的函數即可停止訂閱。

  該功能常用於插件。[詳細介紹](../guide/plugins.md)

### registerModule

- `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  註冊一個動態模組。[詳細介紹](../guide/modules.md#模組動態註冊)

  `options` 可以包含 `preserveState: true` 以允許保留之前的 state。用於服務端渲染。

### unregisterModule

- `unregisterModule(path: string | Array<string>)`

  卸載一個動態模組。[詳細介紹](../guide/modules.md#模組動態註冊)

### hotUpdate

- `hotUpdate(newOptions: Object)`

  熱替換新的 action 和 mutation。[詳細介紹](../guide/hot-reload.md)

## 組件綁定的輔助函數

### mapState

- `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  爲組件創建計算屬性以返回 Vuex store 中的狀態。[詳細介紹](../guide/state.md#mapstate-輔助函數)

  第一個參數是可選的，可以是一個命名空間字符串。[詳細介紹](../guide/modules.md#帶命名空間的綁定函數)

  物件形式的第二個參數的成員可以是一個函數。`function(state: any)`

### mapGetters

- `mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

  爲組件創建計算屬性以返回 getter 的返回值。[詳細介紹](../guide/getters.md#mapgetters-輔助函數)

  第一個參數是可選的，可以是一個命名空間字符串。[詳細介紹](../guide/modules.md#帶命名空間的綁定函數)

### mapActions

- `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  創建組件方法分發 action。[詳細介紹](../guide/actions.md#在組件中分發-action)

  第一個參數是可選的，可以是一個命名空間字符串。[詳細介紹](../guide/modules.md#帶命名空間的綁定函數)

  物件形式的第二個參數的成員可以是一個函數。`function(dispatch: function, ...args: any[])`

### mapMutations

- `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  創建組件方法提交 mutation。[詳細介紹](../guide/mutations.md#在組件中提交-mutation)

  第一個參數是可選的，可以是一個命名空間字符串。[詳細介紹](../guide/modules.md#帶命名空間的綁定函數)

  物件形式的第二個參數的成員可以是一個函數。`function(commit: function, ...args: any[])`

### createNamespacedHelpers

- `createNamespacedHelpers(namespace: string): Object`

  創建基於命名空間的組件綁定輔助函數。其返回一個包含 `mapState`、`mapGetters`、`mapActions` 和 `mapMutations` 的物件。它們都已經綁定在了給定的命名空間上。[詳細介紹](../guide/modules.md#帶命名空間的綁定函數)
