# jspm-rapid-development
jspmで爆速開発していきましょう！

# TODO
- Remove --skip-rollup from `npm run build` (after https://github.com/jspm/jspm-cli/issues/1805 and https://github.com/rollup/rollup/issues/650 fixed)

# 必要なもの
```
- node(v5.5.0)
- homebrew(v0.9.9)
- Mac El Capitan(の前提で進めています。Windowsの場合は色々読み変えてください)
```

# demoの流れ
- step1 - jspmプロジェクトの作成
- step2 - Caddyの設定
- step3 - HMR(Hot Module Reloading)の設定
- step4 - Reactのインストールと設定
- step5 - ロード時間の短縮(bundlingの追加)
- step6 - リリース

# 手順
## step1 - jspmプロジェクトの作成
```
git clone https://github.com/subuta/jspm-rapid-development
npm install jspm@beta -g

jspm init

# (プロンプトは全部デフォルト値(Enter)で進める。)
Package.json file does not exist, create it? [Yes]: Yes
Init mode (Quick, Standard, Custom) [Quick]: Quick
Local package name (recommended, optional): app
package.json directories.baseURL: .
package.json configFiles folder [./]: ./
Use package.json configFiles.jspm:dev? [No]: No
SystemJS.config browser baseURL (optional): /
SystemJS.config Node local project path [src/]: src/
SystemJS.config local package main [app.js]: app.js
SystemJS.config transpiler (Babel, Traceur, TypeScript, None) [babel]: babel

npm i
jspm i
```

## step2 - Caddyの設定
```
brew install caddy
```

```
cat << EOF > Caddyfile
localhost:3000

gzip
browse
ext .html
log / stdout "{method} {uri} {latency}"

websocket /watch "node ./node_modules/.bin/jspm-caddy-hmr"

rewrite {
  regexp (^/$)
  to /index.html?{query}
}
EOF
```

```
cat << EOF > index.html
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
     <script src="jspm_packages/system.js"></script>
     <script src="jspm.config.js"></script>
    <title>jspm-rapid-development</title>
</head>
<body>
<h1>jspmで爆速開発</h1>
<div id="app-container"></div>
<script>
//    if (location.origin.match(/localhost/)) {
//        System.trace = true;
//        System.import('jspm-caddy-hmr').then(function(Watcher){
//          new Watcher.default('/watch');
//        });
//    }
    System.import('example/app.js');
</script>
</body>
</html>
EOF
```

```
mkdir example
echo "console.log('app loaded!');" > example/app.js

# jspm/caddyインストール後の状態
caddy
```

## step3 - HMR(Hot Module Reloading)の設定
今回は説明を簡単にするために自前のもの[jspm-caddy-hmr](https://github.com/subuta/jspm-caddy-hmr)を使ってますが、<br/>
Productionで使ってくならこの辺を使いましょう。
- [systemjs-hot-reloader](https://github.com/capaj/systemjs-hot-reloader)

```
# jspm-caddy-hmr(クライアントのインストール)
jspm i npm:jspm-caddy-hmr css
# jspm-caddy-hmr(サーバのインストール)
npm install jspm-caddy-hmr --save-dev
```

```
cat << EOF > example/app.css
body {
    background-color: #dddddd;
}
EOF
```

```
cat << EOF > example/app.js
import "example/app.css!";

console.log('app loaded!');
EOF
```

```
# index.html内のbody内のscriptタグを有効にする(uncomment)
<script>
if (location.origin.match(/localhost/)) {
    System.trace = true;
    System.import('jspm-caddy-hmr').then(function(Watcher){
        new Watcher.default('/watch');
    });
}
System.import('example/app.js');
</script>
```

```
# CSS / HMR追加後の状態
caddy
```

## step4 - Reactのインストールと設定
Reactを使うためにはbabelのJSXプラグインを使います。
※systemjsのplugin-jsxは何か動かなかったりするので、こっちの方法がオススメ。
```
jspm i npm:react npm:react-dom npm:babel-plugin-transform-class-properties npm:babel-plugin-transform-react-jsx
```

```
#以下の設定を`jspm.config.js`のSystemJS.configに追加しましょう。（transpilerの設定と同じ位置でOK）
"babelOptions": {
  "plugins": [
    "babel-plugin-transform-class-properties",
    "babel-plugin-transform-react-jsx"
  ],
  "optional": [
    "runtime",
    "optimisation.modules.system"
  ]
}
```

```
cat << EOF > example/app.js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "example/app.css!";

class Application extends Component {
    render() {
        return (
            <div>
                <h1>My React Application</h1>
            </div>
        );
    }
}

export const _unload = () => {
    const container = document.querySelector('#app-container');
    // force unload React components
    ReactDOM.unmountComponentAtNode(container); // your container node
}

const onDOMReady = () => {
    const container = document.querySelector('#app-container');
    ReactDOM.render(<Application />, container);
};

if (document.readyState === 'complete' || document.readyState !== 'loading') {
    onDOMReady();
} else {
    document.addEventListener('DOMContentLoaded', onDOMReady);
}

console.log('app loaded!');
EOF
```

```
# React追加後の状態
caddy
```

## step5 - ロード時間の短縮(bundlingの追加)
```
jspm bundle example/app.js -wid

#bundleをやめる時
jspm unbundle example/app.js
```

```
# bundle後の状態
caddy
```

## step6 - リリース
```
mkdir dist
jspm build example/app.js dist/bundled.js --format umd --skip-source-maps --minify
```

```
cat << EOF > index.html
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="dist/bundled.js"></script>
    <title>jspm-rapid-development</title>
</head>
<body>
<h1>jspmで爆速開発</h1>
<div id="app-container"></div>
</body>
</html>
EOF
```

```
# build後の状態
caddy
```