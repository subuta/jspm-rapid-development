# jspm-rapid-development
jspmで爆速開発していきましょう！

# 必要なもの
```
- node(v5.5.0)
- Mac El Capitan(の前提で進めています。Windowsの場合は色々読み変えてください)
```

# demoの流れ
step1 - jspmプロジェクトの作成
step2 - Caddyの設定
step3 - HMR(Hot Module Reloading)の設定
step4 - Reactのインストールと設定

# 手順
- step1
```
git clone https://github.com/subuta/jspm-rapid-development
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
```