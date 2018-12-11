# 項目結構

Vuex 並不限制你的代碼結構。但是，它規定了一些需要遵守的規則：

1. 應用層級的狀態應該集中到單個 store 物件中。

2. 提交 **mutation** 是更改狀態的唯一方法，並且這個過程是同步的。

3. 異步邏輯都應該封裝到 **action** 裏面。

只要你遵守以上規則，如何組織代碼隨你便。如果你的 store 文件太大，只需將 action、mutation 和 getter 分割到單獨的文件。

對於大型應用，我們會希望把 Vuex 相關代碼分割到模組中。下面是項目結構示例：


``` bash
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API請求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我們組裝模組並導出 store 的地方
    ├── actions.js        # 根級別的 action
    ├── mutations.js      # 根級別的 mutation
    └── modules
        ├── cart.js       # 購物車模組
        └── products.js   # 產品模組
```

請參考[購物車示例](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart)。
