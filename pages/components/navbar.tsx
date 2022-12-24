import type { NextPage } from 'next'
import Link from 'next/link';
import React from 'react';
import '../../configureAmplify';
import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

const Navbar: NextPage = () => {
  const [signedUser, setSignedUser] = useState(false);
  useEffect(() => {
    authListener()
  },[])

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
      await Auth.currentAuthenticatedUser()
      setSignedUser(true)
    }catch(err) {

    }
  }
  return (
    <nav className="bg-gray-800 w-screen">
      <div className="flex items-center pl-8 h-14">
        <div className="flex space-x-4">
          {[
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
          {
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

