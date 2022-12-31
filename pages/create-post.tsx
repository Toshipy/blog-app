import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useState, useRef } from 'react';
import { API, Storage } from 'aws-amplify';
import { useRouter } from 'next/router';
// import { v4 as uuid } from 'uuid';
// import { uuid } from 'uuidv4';
import { v4 as uuidv4 } from 'uuid'
import { createPost } from '../src/graphql/mutations';
import type { NextPage } from 'next'

type Post = {
  title: string;
  content: string;
  id: any;
  coverImage: any;
  name: any;
}

// type Image = {
//   name: any
// }

const id= uuidv4();
// console.log(`uuidは${id}`); 
// console.log(`[uuid]は${[id]}`);

const initialState: any = { title: "", content: "",id: ""};
// const initialState = { title: "", content: ""};

// const CreatePost: NextPage = () => {
const CreatePost: NextPage = () => {
  const [post, setPost] = useState<Post>(initialState);
  // const [post, setPost] = useState(initialState);
  const { title, content } = post;
  const router = useRouter();
  const [image, setImage] = useState<any>(null);
  const imageFileInput: any = useRef(null);

  function onChange(e: any) {
    setPost(() => ({
      ...post,
      [e.target.name]: e.target.value
    }))
  }


  async function createNewPost() {
    if(!title || !content) return;
    // const id= uuidv4();
    post.id = id;

    if (image) {
      const filename = `${image.name}_${uuidv4()}`
      post.coverImage = filename;
      await Storage.put(filename, image);
    }

    await API.graphql({
      query: createPost,
      variables: {input: post},
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });

    router.push(`/posts/${id}`)
  }


  async function uploadImage() {
    imageFileInput.current.click();
  }

  function handleChange(e: any) {
    const fileUploaded = e.target.files[0]
    if (!fileUploaded) return;
    setImage(fileUploaded);
  }
  // function console(){
  //   // console.log(uuid);
  //   return uuid;
  // }

  return (
    <div className="mx-10 text-2xl font-semibold tracking-wide mt-6 ">
      <p className="">投稿を作成</p>
        {/* <input 
        onChange={onChange}
        name="title"
        placeholder="タイトル"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> */}
      <input 
      onChange={onChange}
      name="title"
      placeholder="タイトル"
      value={post.title}
      className="text-2xl mt-5 w-full bg-white bg-clip-padding
      border border-solid border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
      />


      {/* <input
        value={post.content}
        // onChange={(value) => setPost({...post, content: value})}
        onChange={onChange}
        placeholder="テキスト"
        className="border-b pb-2 ml-8 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
        name="content"
        /> */}

      <textarea
        value={post.content}
        onChange={onChange}
        name="content"
        placeholder="テキスト"
        className="form-control
          max-h-full	
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
        ></textarea>

      <input
        type="file"
        ref={imageFileInput}
        className="absolute w-0 h-0"  
        onChange={handleChange}
      />
      {
        image && (
          <img src={URL.createObjectURL(image)}
            className="my-4"
          />
        )
      }

      <button 
        type="button" 
        className="block w-200 text-sm text-slate-500
        mr-4 py-2 px-4
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
        // className="ml-10 mt-10 mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" 
        // className="mt-10 block w-200 text-sm text-slate-500
        // ml-10 mr-4 py-2 px-4
        // rounded-full border-0
        // text-3xl font-semibold
        // bg-violet-50 text-violet-700
        // hover:bg-violet-100"
        className=" mr-4 py-2 px-4 mt-10 block w-200 text-lg inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
        onClick={createNewPost}
      >
        投稿する
      </button>
    </div> 
  )
}

export default withAuthenticator(CreatePost);
