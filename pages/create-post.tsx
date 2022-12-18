import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useState, useRef } from 'react';
import { API } from 'aws-amplify';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';
import { createPost } from '../src/graphql/mutations';
import type { NextPage } from 'next'
import TextareaComp from './components/TextareaComp';

// import SimpleMDE from "react-simplemde-editor";
// import dynamic from "next/dynamic";
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"),  { ssr: false});
// import "easymde/dist/easymde.min.css";

type Post = {
  title: string;
  content: string;
  id: any;
}


const initialState = { title: "", content: "",id: ""};
// const initialState = { title: "", content: ""};

// const CreatePost: NextPage = () => {
const CreatePost: NextPage = () => {
  const [post, setPost] = useState<Post>(initialState);
  // const [post, setPost] = useState(initialState);
  const { title, content } = post;
  const router = useRouter()

  function onChange(e: any) {
    setPost(() => ({
      ...post,
      [e.target.name]: e.target.value
    }))
  }

  async function createNewPost() {
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
    <div className="text-3xl font-semibold tracking-wid mt-6">
      <p>Create new Post</p>
        <input 
        onChange={onChange}
        name="title"
        placeholder="タイトル"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />

      <input
        value={post.content}
        // onChange={(value) => setPost({...post, content: value})}
        onChange={onChange}
        placeholder="テキスト"
        className="border-b pb-2 ml-8 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
        name="content"
        />

      <button 
        type="button" 
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" 
        onClick={createNewPost}
      >
        Create Post
      </button>
    </div> 
  )
}

export default withAuthenticator(CreatePost);
// export default CreatePost;
