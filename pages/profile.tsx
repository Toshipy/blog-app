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
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Profile
      </h1>

      <h1 className="font-medium text-gray-500 my-2">
        Username: {user.username}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Email: {user.attributes.email}
      </p>
      {/* <AmplifySignOut className="inline-flex items-center px-6 py-2 text-white font-medium rounded-md mx-2"/> */}
      <button onClick={signOut}>サインアウト</button>
    </div>
  )
}
// export default (Profile);
export default withAuthenticator(Profile);
