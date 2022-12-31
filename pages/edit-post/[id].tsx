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


//型定義
type Post = {
  title: string;
  content: string;
  id: string;
  coverImage: any;
  name: string;
}

const initialState: any = { title: "", content: "",id: ""}; //空の値

function EditPost (){
  const [post, setPost] = useState<Post>(initialState); //initialState
  const [coverImage, setCoverImage] = useState<any | null>(null);
  const [localImage, setLocalImage] = useState<any | null>(null);
  const fileInput: any = useRef(); //fileInputの参照を保持する
  const router = useRouter();
  const { id } = router.query; //URLからクエリパラメータを取得する

  //最初のマウント時と与えられた[id]の値に変化があった場合のみに第一引数の関数を実行する。
  useEffect(() => {
    fetchPost();
    
    //Postデータをfetchする
    async function fetchPost() {
      if (!id) return; //idが存在しない場合は何も返さない

      const postData: any = await API.graphql({
        query: getPost, //graphql > queries.tsから[getPost]をクエリする
        variables: { id } //[id]を変数値として
      })

      setPost(postData.data.getPost);//getPostのデータで更新する

      if (postData.data.getPost.coverImage) { //coverImageがあれば、updateCoverImage関数を実行する
        updateCoverImage(postData.data.getPost.coverImage);
      }
    }
  }, [id])

  if(!post) return null; //postのデータがなければ何も返さない

  //S3からカバーイメージを取得して更新する関数
  async function updateCoverImage(coverImage: any) {
    const imageKey: any= await Storage.get(coverImage); //S3 Storageから[coverImage]を取得
      setCoverImage(imageKey); //取得した [coverImage] で更新する
  }

  //画像をアップロードする関数
  async function uploadImage() {
    fileInput.current.click();
  }

  //
  function handleChange(e: any) {
    const fileUpload: any = e.target.files[0]; //fileUploadは、アップロードしたファイルのindex番号0の値
    if(!fileUpload) return; //アップロードされたファイルがなければ何も返さない
    setCoverImage(fileUpload); //アップロードされたファイルでcoverImageを更新
    setLocalImage(URL.createObjectURL(fileUpload)); //ローカルイメージを、アップロードされたオブジェクトによって作成されたURLで更新する
  }

  function onChange(e: any) {
    setPost(() => ({
      ...post,
      [e.target.name]: e.target.value
    }))
  }

  const { title, content } = post;

  //投稿を更新する
  async function updateCurrentPost() {
    if(!title || !content) return; //[title] or [content] がなければ何も返さない
    const postUpdated: any = {
      id,
      content,
      title
    }

    if(coverImage && localImage) {
      const fileName = `${coverImage.name}_${uuidv4()}` //fileNameをuuidv4でユニークな識別子を付加する
      postUpdated.coverImage = fileName;
      await Storage.put(fileName, coverImage); //S3に[fileName], [coverImage]で更新する
    }

    await API.graphql({
      query: updatePost,
      variables: { input: postUpdated },
      authMode: "AMAZON_COGNITO_USER_POOLS" //認証されたユーザーのみ
    })
    router.push("/my-posts") //my-postsにリダイレクト
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
    </div>
  )
}

export default EditPost;
