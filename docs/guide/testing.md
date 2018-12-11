# 測試

我們主要想針對 Vuex 中的 mutation 和 action 進行單元測試。

### 測試 Mutation

Mutation 很容易被測試，因爲它們僅僅是一些完全依賴參數的函數。這裏有一個小技巧，如果你在 `store.js` 文件中定義了 mutation，並且使用 ES2015 模組功能默認輸出了 Vuex.Store 的實例，那麼你仍然可以給 mutation 取個變量名然後把它輸出去：

``` js
const state = { ... }

// `mutations` 作爲命名輸出物件
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

下面是用 Mocha + Chai 測試一個 mutation 的例子（實際上你可以用任何你喜歡的測試框架）：

``` js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// 解構 `mutations`
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // 模擬狀態
    const state = { count: 0 }
    // 應用 mutation
    increment(state)
    // 斷言結果
    expect(state.count).to.equal(1)
  })
})
```

### 測試 Action

Action 應對起來略微棘手，因爲它們可能需要調用外部的 API。當測試 action 的時候，我們需要增加一個 mocking 服務層——例如，我們可以把 API 調用抽象成服務，然後在測試文件中用 mock 服務迴應 API 調用。爲了便於解決 mock 依賴，可以用 webpack 和 [inject-loader](https://github.com/plasticine/inject-loader) 打包測試文件。

下面是一個測試異步 action 的例子：

``` js
// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ commit }) => {
  commit('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}
```

``` js
// actions.spec.js

// 使用 require 語法處理內聯 loaders。
// inject-loader 返回一個允許我們注入 mock 依賴的模組工廠
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// 使用 mocks 創建模組
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// 用指定的 mutations 測試 action 的輔助函數
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0

  // 模擬提交
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).to.equal(type)
      if (payload) {
        expect(mutation.payload).to.deep.equal(payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // 用模擬的 store 和參數調用 action
  action({ commit, state }, ...args)

  // 檢查是否沒有 mutation 被 dispatch
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, [], {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* mocked response */ } }
    ], done)
  })
})
```

如果在測試環境下有可用的 spy (比如通過 [Sinon.JS](http://sinonjs.org/))，你可以使用它們替換輔助函數 `testAction`：

``` js
describe('actions', () => {
  it('getAllProducts', () => {
    const commit = sinon.spy()
    const state = {}
    
    actions.getAllProducts({ commit, state })
    
    expect(commit.args).to.deep.equal([
      ['REQUEST_PRODUCTS'],
      ['RECEIVE_PRODUCTS', { /* mocked response */ }]
    ])
  })
})
```

### 測試 Getter

如果你的 getter 包含很複雜的計算過程，很有必要測試它們。Getter 的測試與 mutation 一樣直截了當。

測試一個 getter 的示例：

``` js
// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```

``` js
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // 模擬狀態
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // 模擬 getter
    const filterCategory = 'fruit'

    // 獲取 getter 的結果
    const result = getters.filteredProducts(state, { filterCategory })

    // 斷言結果
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### 執行測試

如果你的 mutation 和 action 編寫正確，經過合理地 mocking 處理之後這些測試應該不依賴任何瀏覽器 API，因此你可以直接用 webpack 打包這些測試文件然後在 Node 中執行。換種方式，你也可以用 `mocha-loader` 或 Karma + `karma-webpack`在真實瀏覽器環境中進行測試。

#### 在 Node 中執行測試

創建以下 webpack 配置（配置好 [`.babelrc`](https://babeljs.io/docs/usage/babelrc/)）:

``` js
// webpack.config.js
module.exports = {
  entry: './test.js',
  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

然後：

``` bash
webpack
mocha test-bundle.js
```

#### 在瀏覽器中測試

1. 安裝 `mocha-loader`。
2. 把上述 webpack 配置中的 `entry` 改成 `'mocha-loader!babel-loader!./test.js'`。
3. 用以上配置啓動 `webpack-dev-server`。
4. 訪問 `localhost:8080/webpack-dev-server/test-bundle`。

#### 使用 Karma + karma-webpack 在瀏覽器中執行測試

詳見 [vue-loader documentation](https://vuejs.github.io/vue-loader/workflow/testing.html)。
