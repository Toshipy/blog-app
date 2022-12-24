import React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next'


type User = {
  username: string;
  attributes: any
}


const Profile: NextPage = () => {
  const [user,setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();
  },[])

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    setUser(user);
  }

  async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }

  if (!user) return null;
  return (
    <div className="ml-4 mr-4">
      <h1 className="text-2xl font-semibold tracking-wide mt-6">
        プロフィール
      </h1>

      <h1 className="text-gray-500 my-2">
        ユーザー名: {user.username}
      </h1>
      <p className="text-gray-500 my-2 mb-6">
        Eメール: {user.attributes.email}
      </p>
      {/* <AmplifySignOut className="inline-flex items-center px-6 py-2 text-white font-medium rounded-md mx-2"/> */}
      <button className="block w-200 text-lg inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out" onClick={signOut}>サインアウト</button>
    </div>
  )
}
// export default (Profile);
export default withAuthenticator(Profile);
