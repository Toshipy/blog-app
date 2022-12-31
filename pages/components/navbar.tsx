import type { NextPage } from 'next'
import Link from 'next/link';
import React from 'react';
import '../../configureAmplify';
import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';


//ユーザーのサインイン状況
const Navbar: NextPage = () => {
  const [signedUser, setSignedUser] = useState(false);
  useEffect(() => {
    authListener()
  },[])

//singInならサインイン状態、signOutならサインアウト状態
  async function authListener() {
    Hub.listen("auth", (data) => {
      switch(data.payload.event) {
        case "signIn":
          return setSignedUser(true);
        case "signOut":
          return setSignedUser(false);
      }
    })
    try {
      await Auth.currentAuthenticatedUser() //例外が発生しうる場合：現在のユーザー情報を取得して、サインイン状態にする。
      setSignedUser(true)
    } catch (err) {

    }
  }
  return (
    <nav className="bg-gray-800 w-screen">
      <div className="flex items-center pl-8 h-14">
        <div className="flex space-x-4">
          {[ //デフォルトでナビゲーションバーに表示する
            ["ホーム", "/"],
            ["投稿する", "/create-post"],
            ["プロフィール", "/profile"]
          ].map(([title, url], index) => 
            <Link legacyBehavior href={url} key={index}>
              <a className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">
                {title}
              </a>
            </Link>
          )}
          { //サインインをしているユーザーに表示する
            signedUser && (
              <Link legacyBehavior href='/my-posts'>
                <a className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">あなたの投稿</a>
              </Link>
            )
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar

