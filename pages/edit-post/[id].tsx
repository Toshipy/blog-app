import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import { listPosts, getPost } from '../../src/graphql/queries';
import '../../configureAmplify';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid'
import type { NextPage } from 'next'
import { useState, useRef } from 'react';
import { Auth, API, Storage } from "aws-amplify";
import { updatePost } from '../../src/graphql/mutations';

type Post = {
  title: string;
  content: string;
  id: any;
}

const initialState = { title: "", content: "",id: ""};

function EditPost (){
  // const [post, setPost] = useState<Post>(null);
  const [post, setPost] = useState<Post>(initialState);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const postData: any = await API.graphql({
        query: getPost,
        variables: { id }
      })
      setPost(postData.data.getPost);
    }
  }, [id])

  if(!post) return null;


  function onChange(e: any) {
    setPost(() => ({
      ...post,
      [e.target.name]: e.target.value
    }))
  }

  const { title, content} = post;
  async function updateCurrentPost() {
    if(!title || !content) return;
    const postUpdated = {
      id,
      content,
      title
    }
    await API.graphql({
      query: updatePost,
      variables: { input: postUpdated },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    router.push("/my-posts")
  }

  return(
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        編集する
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="タイトル"
        value={post.title}
        className='border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2'
      />
      
      <input
        value={post.content}
        onChange={onChange}
        name="content"
      />

      <button
        className='mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg'
        onClick={updateCurrentPost}
      >投稿を更新する</button>
    </div>
  )
}

export default EditPost;
