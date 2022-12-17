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
    <div>
      <h1 className="text-3xl font-semibold trancking-wide mt-6">
        Proofile
      </h1>

      <h1 className="font-medium text-gray-500 my-2">
        {user.username}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {user.attributes.email}
      </p>
    </div>
  )
}
export default withAuthenticator(Profile);
