import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useState, useRef } from 'react';
import { API } from 'aws-amplify';
import { useRouter } from 'next/router';
import { v4 as uuid, V4Options } from 'uuid';
import { createPost } from '../src/graphql/mutations';

type Post = {
  title: string;
  content: string;
  id: any;
}


const initialState = { title: "", content: "",id: ""};

const CreatePost = () => {
  const [post, setPost] = useState<Post>(initialState);
  const { title, content } = post;
  const router = useRouter()

  function onChange(e: any) {
    setPost(() => ({
      ...post, [e.target.name]: e.target.value
    }))
  }

  async function createdNewPost() {
    if(!title || !content) return;
    const id = uuid;
    post.id = id;

    await API.graphql({
      query: createPost,
      variables: {input: post},
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    // router.push(`/post/${id}`)
  }

  return (
    <div>
      test
    </div>
  )
}

export default CreatePost
