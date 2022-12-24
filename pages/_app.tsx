import React from 'react';
import '../styles/globals.css'
import '../configureAmplify';
import type { AppProps } from 'next/app';
import Navbar from './components/navbar';
// import { vocabularies } from '../amplify/vocabularies';
import { Auth, I18n } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import config from '../src/aws-exports';
import '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify from '@aws-amplify/core'
// import Amplify from 'aws-amplify';



function MyApp({ Component, pageProps }: AppProps) {
  return (
      <div>
        <div>
          <Navbar />
        </div>
        <Component {...pageProps} />
      </div>
  )
}

export default MyApp;

const vocabularies = {
  'ja': {
    'Back to Sign In': 'サインイン画面に戻る',
    'Confirm': '確認',
    'Confirm Sign Up': 'サインアップの確認',
    'Confirmation Code': '確認コード',
    'Confirm Password': 'パスワードの確認',
    'Create Account': '新規登録',
    'Create a new account': 'アカウントの新規登録',
    'Create account': '新規登録',
    'Email': 'メールアドレス',
    'Enter your code': '確認コードを入力してください',
    'Enter your password': 'パスワードを入力してください',
    'Enter your username': 'ユーザー名を入力してください',
    'Forgot your password?': 'パスワードをお忘れの方 ',
    'Have an account? ': 'アカウント登録済みの方 ',
    'Hello': 'こんにちは ',
    'Incorrect username or password': 'ユーザー名またはパスワードが異なります',
    'Lost your code? ': 'コードを紛失した方 ',
    'No account? ': 'アカウント未登録の方 ',
    'Password': 'パスワード',
    'Phone Number': '電話番号',
    'Resend Code': '確認コードの再送',
    'Reset password': 'パスワードのリセット',
    'Reset your password': 'パスワードのリセット',
    'Send Code': 'コードの送信',
    'Sign In': 'サインイン',
    'Sign Out': 'サインアウト',
    'Sign in': 'サインイン',
    'Sign in to your account': 'サインイン',
    'User does not exist': 'ユーザーが存在しません',
    'Username': 'ユーザー名',
    'Username cannot be empty': 'ユーザー名は必須入力です',
    'Username/client id combination not found.': 'ユーザー名が見つかりません',
    }
};

I18n.putVocabularies(vocabularies);
I18n.setLanguage('ja');
