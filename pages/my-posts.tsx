import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { postsByUsername } from "../src/graphql/queries";
import { API } from "aws-amplify";
import Link from "next/link";

export default function MyPosts () {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    // const { username } = await Auth.currentAuthenticatedUser();
    const user = await Auth.currentAuthenticatedUser()
    const username = `${user.attributes.sub}::${user.username}`
    const postData = await API.graphql({
      query: postsByUsername,
      variables: {username}
    })
    setPosts(postData.data.postsByUsername.items);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        あなたの投稿
      </h1>
      {
        posts.map((post, index) => (
          <Link 
            key={index}
            href={`/posts/${post.id}`}>
              <div className="curosr-pointer border-b border-gray-300 mt-8 pb-4">
                <h2 className="text-xl font-semibold">
                  {post.title}
                </h2>
                <p className="text-gray-500 mt-2">
                  投稿した人：{post.username}
                </p>
              </div>
            </Link>
        ))
      }
    </div>
  )
}
