import type { NextPage } from 'next'
import { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { listPosts } from '../src/graphql/queries';



const Home: NextPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  },[])

  async function fetchPosts() {
    const postData: any = await API.graphql({
      query: listPosts
    })
    setPosts(postData.data.listPosts.items);
  }

  // console.log(posts);

  return (
    <>
    <h1>My Posts</h1>
      {
        posts.map((post: any, index: any) => 
            <p key={index} >{post.content}</p>
        )
      }
    </>
    
  );
}

export default Home
