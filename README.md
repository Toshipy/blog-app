# コメント投稿付き、ブログアプリケーション

![スクリーンショット 2022-12-30 20 37 41](https://user-images.githubusercontent.com/44152472/210066389-35be7221-b340-44f9-b5b7-49e25462858c.png)


## 1.サイト概要
サイトURL：https://main.do1bnofl345o8.amplifyapp.com/

このサイトでは、ログイン認証をしたユーザーが、文字や写真を載せて投稿でき、投稿に対してコメントをすることができます。


## 2.使用技術

### フロントエンド
・Next.js
・Tailwind CSS

### バックエンド
・GraphQL
・Cognito
・DynamoDB

### インフラ
・Amplify


###　その他
・GitHub

## ３.インフラ構成図
![インフラ構成図 drawio](https://user-images.githubusercontent.com/44152472/210078773-32855c6e-7f3b-4b9c-ab0e-d686c6a5d8fb.png)

## 4.ER図
<img width="734" alt="スクリーンショット 2023-01-01 4 08 08" src="https://user-images.githubusercontent.com/44152472/210153539-62617348-5787-48d5-9f55-a8bea2fb4d40.png">

## 5.機能一覧
・Cognito認証（ユーザー新規登録、サインイン、サインアウト、パスワード再設定）。
・投稿ができます（タイトル、テキストメッセージ、画像アップロード）。
・投稿内容を編集できます（タイトル、テキストメッセージ、画像アップロード）。
・自分の投稿一覧を編集、閲覧、削除できます。
・コメント投稿機能（テキストメッセージ）


