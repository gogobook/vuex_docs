# 表單處理

當在嚴格模式中使用 Vuex 時，在屬於 Vuex 的 state 上使用 `v-model` 會比較棘手：

``` html
<input v-model="obj.message">
```

假設這裏的 `obj` 是在計算屬性中返回的一個屬於 Vuex store 的物件，在用戶輸入時，`v-model` 會試圖直接修改 `obj.message`。在嚴格模式中，由於這個修改不是在 mutation 函數中執行的, 這裏會拋出一個錯誤。

用“Vuex 的思維”去解決這個問題的方法是：給 `<input>` 中綁定 value，然後偵聽 `input` 或者 `change` 事件，在事件回調中調用 action:

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

下面是 mutation 函數：

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### 雙向綁定的計算屬性

必須承認，這樣做比簡單地使用“`v-model` + 局部狀態”要囉嗦得多，並且也損失了一些 `v-model` 中很有用的特性。另一個方法是使用帶有 setter 的雙向綁定計算屬性：

``` html
<input v-model="message">
```
``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
