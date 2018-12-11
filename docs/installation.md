# 安裝

### 直接下載 / CDN 引用

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) 提供了基於 NPM 的 CDN 鏈接。以上的鏈接會一直指向 NPM 上發佈的最新版本。您也可以通過 `https://unpkg.com/vuex@2.0.0` 這樣的方式指定特定的版本。
<!--/email_off-->

在 Vue 之後引入 `vuex` 會進行自動安裝：

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex --save
```

### Yarn

``` bash
yarn add vuex
```

在一個模組化的打包系統中，您必須顯式地通過 `Vue.use()` 來安裝 Vuex：

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

當使用全局 script 標籤引用 Vuex 時，不需要以上安裝過程。

### Promise

Vuex 依賴 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)。如果你支持的瀏覽器並沒有實現 Promise (比如 IE)，那麼你可以使用一個 polyfill 的庫，例如 [es6-promise](https://github.com/stefanpenner/es6-promise)。

你可以通過 CDN 將其引入：

``` html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

然後 `window.Promise` 會自動可用。

如果你喜歡使用諸如 npm 或 Yarn 等包管理器，可以按照下列方式執行安裝：

``` bash
npm install es6-promise --save # npm
yarn add es6-promise # Yarn
```

或者更進一步，將下列代碼添加到你使用 Vuex 之前的一個地方：

``` js
import 'es6-promise/auto'
```

### 自己構建

如果需要使用 dev 分支下的最新版本，您可以直接從 GitHub 上克隆代碼並自己構建。

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
