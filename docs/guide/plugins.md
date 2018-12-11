# 插件

Vuex 的 store 接受 `plugins` 選項，這個選項暴露出每次 mutation 的鉤子。Vuex 插件就是一個函數，它接收 store 作爲唯一參數：

``` js
const myPlugin = store => {
  // 當 store 初始化後調用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之後調用
    // mutation 的格式爲 { type, payload }
  })
}
```

然後像這樣使用：

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### 在插件內提交 Mutation

在插件中不允許直接修改狀態——類似於組件，只能通過提交 mutation 來觸發變化。

通過提交 mutation，插件可以用來同步數據源到 store。例如，同步 websocket 數據源到 store（下面是個大概例子，實際上 `createPlugin` 方法可以有更多選項來完成複雜任務）：

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### 生成 State 快照

有時候插件需要獲得狀態的“快照”，比較改變的前後狀態。想要實現這項功能，你需要對狀態物件進行深拷貝：

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // 比較 prevState 和 nextState...

    // 保存狀態，用於下一次 mutation
    prevState = nextState
  })
}
```

**生成狀態快照的插件應該只在開發階段使用**，使用 webpack 或 Browserify，讓構建工具幫我們處理：

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

上面插件會默認啓用。在發佈階段，你需要使用 webpack 的 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 或者是 Browserify 的 [envify](https://github.com/hughsk/envify) 使 `process.env.NODE_ENV !== 'production'` 爲 `false`。

### 內置 Logger 插件

> 如果正在使用 [vue-devtools](https://github.com/vuejs/vue-devtools)，你可能不需要此插件。

Vuex 自帶一個日誌插件用於一般的調試:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

`createLogger` 函數有幾個配置項：

``` js
const logger = createLogger({
  collapsed: false, // 自動展開記錄的 mutation
  filter (mutation, stateBefore, stateAfter) {
    // 若 mutation 需要被記錄，就讓它返回 true 即可
    // 順便，`mutation` 是個 { type, payload } 物件
    return mutation.type !== "aBlacklistedMutation"
  },
  transformer (state) {
    // 在開始記錄之前轉換狀態
    // 例如，只返回指定的子樹
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutation 按照 { type, payload } 格式記錄
    // 我們可以按任意方式格式化
    return mutation.type
  },
  logger: console, // 自定義 console 實現，默認爲 `console`
})
```

日誌插件還可以直接通過 `<script>` 標籤引入，它會提供全局方法 `createVuexLogger`。

要注意，logger 插件會生成狀態快照，所以僅在開發環境使用。
