import type { NextPage } from 'next'
import { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { listPosts } from '../src/graphql/queries';
import Link from 'next/link';



const Home: NextPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  },[])

  async function fetchPosts() {
    const postData: any = await API.graphql({
      query: listPosts
    });
    const { items } = postData.data.listPosts;
    const postWithImages: any = await Promise.all(
      items.map(async (post: any) => {
        if (post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage);
        }
        return post
      })
    )
    setPosts(postWithImages);
  }

  // console.log(posts);

  return (
    <div>
    <h1 className='mx-4 text-3xl font-semibold tracking-wide mt-6 mb-8'>投稿一覧</h1>
      {
        posts.map((post: any, index: any) => 
          <Link key={index} href={`/posts/${post.id}`}>
            <div className="cursor-pointer mt-8">
              {
                post.coverImage && (
                  <div className="grid grid-cols-4 cursor-pointer mt-8 ml-4">
                    <img src={post.coverImage} className="w-36 h-36 bg-contain bg-center rounded-md sm:mx-0 sm:shrink-0" />
                    {
                  post.comments.items.length > 0 &&
                  post.comments.items.map((comment: any,index: any)=> (
                  <div>
                    <div className="px-4"> コメント{index+1} </div>
                    <div 
                      key={index}
                      className="py-8 px-4 max-w-xl mx-auto bg-sky-200 rounded-xl 
                      shadow-lg space-y-2 sm:py-1 sm:flex border
                      mb-6
                      mx-2
                      sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
                    >
                    
                      <div>
                        <p className="text-black mt-2">{comment.message}</p> 
                        <p className="text-slate-500 mt-1">{comment.createdBy}</p> 
                      </div>
                  </div>
                </div>
                  ))
                }
                  </div>
                )
              }
              { !post.coverImage && (
                  post.comments.items.length > 0 &&
                  post.comments.items.map((comment: any,index: any)=> (
                    <div>
                      <div className="px-4"> コメント{index+1} </div>
                    <div 
                      key={index}
                      className="pb-4 px-4 max-w-xl mx-auto bg-sky-200 rounded-xl 
                      shadow-lg space-y-2 sm:py-1 sm:flex 
                      mb-4
                      mx-2
                      sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
                    > 
                      <div>
                        <p className="text-black mt-2">{comment.message}</p> 
                        <p className="text-slate-500 mt-1">{comment.createdBy}</p> 
                      </div>
                  </div>
                  </div>
                  ))
                )}
              </div>
              <div className="mx-4 cursor-pointer border-b border-gray-300 mt-8 pb-4">
              <div className="cursor-pointer mt-2">
                <h2 
                  className="text-xl"
                  key={index}>
                    {post.title}
                </h2>
                <p
                  className="text-gray-500 mt-2">
                    {post.username}
                    
                </p>  
                {/* {
                  post.comments.items.length > 0 &&
                  post.comments.items.map((comment: any,index: any)=> (
                    <div 
                      key={index}
                      className="py-8 px-8 max-w-xl mx-auto bg-white rounded-xl 
                      shadow-lg space-y-2 sm:py-1 sm:flex 
                      my-6
                      mx-12
                      sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
                    > 
                      <div>
                        <p className="text-gray-500 mt-2">{comment.message}</p> 
                        <p className="text-gray-200 mt-1">{comment.createdBy}</p> 
                      </div>
                  </div>
                  ))
                } */}
              </div>
            </div>
          </Link>
        )
      }
    </div>
    
  );
}

export default Home
