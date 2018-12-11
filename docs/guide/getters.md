# Getter

有時候我們需要從 store 中的 state 中派生出一些狀態，例如對列表進行過濾並計數：

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

如果有多個組件需要用到此屬性，我們要麼複製這個函數，或者抽取到一個共享函數然後在多處導入它——無論哪種方式都不是很理想。

Vuex 允許我們在 store 中定義“getter”（可以認爲是 store 的計算屬性）。就像計算屬性一樣，getter 的返回值會根據它的依賴被緩存起來，且只有當它的依賴值發生了改變纔會被重新計算。

Getter 接受 state 作爲其第一個參數：

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

### 通過屬性訪問

Getter 會暴露爲 `store.getters` 物件，你可以以屬性的形式訪問這些值：

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getter 也可以接受其他 getter 作爲第二個參數：

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

我們可以很容易地在任何組件中使用它：

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

注意，getter 在通過屬性訪問時是作爲 Vue 的響應式系統的一部分緩存其中的。

### 通過方法訪問

你也可以通過讓 getter 返回一個函數，來實現給 getter 傳參。在你對 store 裏的數組進行查詢時非常有用。

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

注意，getter 在通過方法訪問時，每次都會去進行調用，而不會緩存結果。

### `mapGetters` 輔助函數

`mapGetters` 輔助函數僅僅是將 store 中的 getter 映射到局部計算屬性：

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用物件展開運算符將 getter 混入 computed 物件中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

如果你想將一個 getter 屬性另取一個名字，使用物件形式：

``` js
mapGetters({
  // 把 `this.doneCount` 映射爲 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
