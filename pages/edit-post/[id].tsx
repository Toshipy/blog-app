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
  coverImage: any;
  name: any;
}

const initialState: any = { title: "", content: "",id: ""};

function EditPost (){
  // const [post, setPost] = useState<Post>(null);
  const [post, setPost] = useState<Post>(initialState);
  const [coverImage, setCoverImage] = useState<any | null>(null);
  const [localImage, setLocalImage] = useState<any | null>(null);
  const fileInput: any = useRef();
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
      if (postData.data.getPost.coverImage) {
        updateCoverImage(postData.data.getPost.coverImage);
      }
    }
  }, [id])

  if(!post) return null;
  async function updateCoverImage(coverImage: any) {
    const imageKey: any= await Storage.get(coverImage);
      setCoverImage(imageKey);
  }

  async function uploadImage() {
    fileInput.current.click();
  }

  function handleChange(e: any) {
    const fileUpload: any = e.target.files[0];
    if(!fileUpload) return;
    setCoverImage(fileUpload);
    setLocalImage(URL.createObjectURL(fileUpload));
  }

  function onChange(e: any) {
    setPost(() => ({
      ...post,
      [e.target.name]: e.target.value
    }))
  }

  const { title, content} = post;
  async function updateCurrentPost() {
    if(!title || !content) return;
    const postUpdated: any = {
      id,
      content,
      title
    }

    if(coverImage && localImage) {
      const fileName = `${coverImage.name}_${uuidv4()}`
      postUpdated.coverImage = fileName;
      await Storage.put(fileName, coverImage);
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
      <h1 className="ml-10 text-3xl font-semibold tracking-wide mt-6 mb-2">
        編集する
      </h1>
      {
        coverImage && (
          <img src={localImage ? localImage : coverImage}   width={500} height={500} className="max-w-xs h-auto rounded-lg mt-4" />
        )
      }
      {/* <input
        onChange={onChange}
        name="title"
        placeholder="タイトル"
        value={post.title}
        className='border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2'
      /> */}
      <input 
        onChange={onChange}
        name="title"
        placeholder="タイトル"
        value={post.title}
        className="text-xl mt-5 ml-10 w-100 bg-white bg-clip-padding
        border border-solid border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      />
      
      <textarea
        onChange={onChange}
        name="content"
        placeholder="テキスト"
        className="form-control
          ml-10
          my-5
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          value={post.content}
        ></textarea>
      

      <input 
        type="file"
        ref={fileInput}
        className="absolute w-0 h-0"
        onChange={handleChange}
      />

      {/* <button
        className='mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg'
        onClick={uploadImage}
      >画像をアップロードする</button> */}

        <button 
        type="button" 
        className="block w-200 text-sm text-slate-500
        ml-10 mr-4 py-2 px-4
        rounded-md border-0
        text-sm font-semibold
        bg-violet-50 text-violet-700
        hover:bg-violet-100"
        onClick={uploadImage}
      >
        画像をアップロードする
      </button>

      <button 
        type="button"
        className="ml-10 mr-4 py-2 px-4 mt-10 block w-200 text-lg inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
        onClick={updateCurrentPost}
      >
        投稿する
      </button>
      {/* <button
        className='ml-2 mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg'
        onClick={updateCurrentPost}
      >投稿を更新する
      </button> */}
    </div>
  )
}

export default EditPost;
