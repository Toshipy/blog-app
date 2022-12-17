import React from 'react'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';

type User = {
  username: string;
  attributes: any
}


function Profile() {
  const [user,setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();
  },[])

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    setUser(user);
  }
  if (!user) return null
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
      <AmplifySignOut className="inline-flex items-center px-6 py-2 text-white font-medium rounded-md mx-2"/>
    </div>
  )
}
export default withAuthenticator(Profile);
