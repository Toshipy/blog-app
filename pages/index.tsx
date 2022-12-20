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
    <h1 className="text-sky-400 text-3xl font-bold tracking-wide mt-6 mb-2">My Posts</h1>
      {
        posts.map((post: any, index: any) => 
          <Link key={index} href={`/posts/${post.id}`}>
            <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
              {
                post.coverImage && (
                  <img src={post.coverImage} className="w-36 h-36 bg-center rounded-full sm:mx-0 sm:shrink-0" />
                )
              }
              <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
                <h2 
                  className="text-xl font-semibold"
                  key={index}>
                    {post.title}
                </h2>
                <p
                  className="text-gray-500 mt-2">
                    投稿した人：{post.username}
                </p>
              </div>
            </div>
          </Link>
        )
      }
    </div>
    
  );
}

export default Home
