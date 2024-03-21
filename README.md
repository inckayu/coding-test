READMEには確定したコーディングルールや技術仕様を書きます。開発過程の検討事項・tips・試行錯誤は`memo.md`にまとめています。

## ルール

### ブランチ

| ブランチ名        | 用途       |
| :---------------- | :--------- |
| main              | 本番環境   |
| dev               | 開発環境   |
| feat-[ブランチ名] | 新機能追加 |
| fix-[ブランチ名]  | 修正       |

ブランチ名はケバブケース(ex: `feat-new-function`)

原則として開発はfeatまたはfixブランチで行い、devブランチにマージする。devブランチでの正常な動作が確認された場合のみmainブランチにマージする。
<br>
devブランチにはfeatまたはfixブランチのみマージできる。
<br>
mainブランチにはdevまたはfixブランチのみマージできる。緊急の修正を要する場合のみfixブランチをmainブランチに直接マージできる。

## 使用技術

### commitlint

保守性を高めるため、コミットメッセージは下記のフォーマットに従う必要がある。

```
:gitmoji: message
```
