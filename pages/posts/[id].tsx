import React, { useEffect } from 'react'
import { API, Storage } from 'aws-amplify';
import { useRouter } from 'next/router';
import { listPosts, getPost } from '../../src/graphql/queries';
import '../../configureAmplify';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { createComment } from '../../src/graphql/mutations';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import { Auth, Hub } from 'aws-amplify';


const initialState = { message: "" };


export default function Post({ post }:{post: any}) {  
  const [signedInUser, setSignedInUser] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [comment, setComment] = useState<any>(initialState);
  const [showMe, setShowMe] = useState(false);
  const { message } = comment

  function toggle() {
    setShowMe(!showMe);
  }

  useEffect(() => {
    updateCoverImage();
  },[]);

  useEffect(() => {
    authListener();
  }, []);

  async function updateCoverImage() {
    if (post.coverImage) {
      const imageKey: any = await Storage.get(post.coverImage)
      setCoverImage(imageKey);
    }
  }

    const router = useRouter();
    if (router.isFallback) {
      return <div>Loading...</div>
    }

    async function createTheComment () {
      if (!message) return;
      const id = uuidv4();
      comment.id = id;
      try {
        await API.graphql({
          query: createComment,
          variables: {input: comment},
          authMode: "AMAZON_COGNITO_USER_POOLS"
        })
      } catch (error) {
        console.log(error);
      }
      router.push("/my-posts");
    }


    function onChange(e: any) {
      setComment(() => ({
        ...comment,
        message: e.target.value,
        postID: post.id
      }))
    }

    async function authListener () {
      Hub.listen("auth", (data) => {
        switch(data.payload.event) {
          case "signIn":
            return setSignedInUser(true);
          case "signOut":
            return setSignedInUser(false);
        }
      });
      try {
        await Auth.currentAuthenticatedUser();
        setSignedInUser(true);
      } catch (err) {}
    }

    return ( 
      <div>
        <h1 className="text-3xl my-4 tracing-wide">
          タイトル：{post.title}
        </h1>
        {
          coverImage && (
            <img src={coverImage} className="mt4" />
          )
        }

        <p className="text-sm  font-light my-4">投稿したユーザー：{post.username}</p>
        <div className="mt-8">
          <p className="text-sm  font-light my-4">投稿内容：{post.content}</p>
          {/* <p ReactMarkDown="prose">内容：{post.content}</p> */}
        </div>

        <div>
          {
            signedInUser && (
            <button
            type="button"
            className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
            onClick={toggle}
            >
            コメントを書く
            </button>
            )
          }
          {
            <div
              style={{ display: showMe ? "block" : "none" }}
            >
            <input
              value={comment.message}
              onChange={onChange}
              name="content"
            />
              <button
                onClick={createTheComment}
                type="button"
                className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
                // onClick={}
              >
                保存
              </button>
            </div>
          }
        </div>
      </div>
    );

  }



  export async function getStaticPaths() {
    const postData: any = await API.graphql({
      query: listPosts,
    });
    const paths = postData.data.listPosts.items.map((post: any)=> ({
      params: {
        id: post.id
      }
    }));
    
    return  { 
      paths,
      fallback: true,
    }
  }

  export async function getStaticProps({ params }: { params: any}) {
    const { id } = params
    const postData: any = await API.graphql({
      query: getPost,
      variables: { id }
    })

    return {
      props: {
        post: postData.data.getPost
      },
      revalidate: 1,
    };
  }
