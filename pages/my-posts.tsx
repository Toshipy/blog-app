import { Auth, API, Storage } from "aws-amplify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { postsByUsername } from "../src/graphql/queries";
import Moment from "moment";
import { deletePost as deletePostMutation } from "../src/graphql/mutations";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    // const { username } = await Auth.currentAuthenticatedUser();
    const user = await Auth.currentAuthenticatedUser()
    const username = `${user.attributes.sub}::${user.username}`
    const postData: any = await API.graphql({
      query: postsByUsername,
      variables: { username },
    });

    const { items } = postData.data.postsByUsername;
    const postWithImages: any = await Promise.all(
      items.map(async (post: any) => {
        if (post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage);
        }
        return post;
      })
    )
      // setPosts(postData.data.postsByUsername.items)
      setPosts(postWithImages);
    // setPosts(postData.data.postsByUsername.items);
  }
  
  async function deletePost(id: string) {
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    fetchPosts();
  }

  return (
    <div className="mt-5">
      {posts.map((post: any, index: any)=> (
        <div
          key={index}
          className='py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-1 sm:flex 
          sm:items-center sm:space-y-0 sm:space-x-6 mb-2'
        >
          {post.coverImage && (
            <img
              className='w-36 h-36 bg-contain bg-center rounded-md sm:mx-0 sm:shrink-0'
              src={post.coverImage}
            />
          )}
          <div className='text-center space-y-2 sm:text-left'>
            <div className='space-y-0.5'>
              <p className='text-lg text-black font-semibold'>{post.title}</p>
              <p className='text-slate-500 font-medium'>
                作成日: {Moment(post.createdAt).format("YYYY年MM月DD日 HH:mm")}
              </p>
            </div>
            <div
              className='sm:py-4 sm:flex 
        sm:items-center sm:space-y-0 sm:space-x-4'
            >
              {/* <p
                className='px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 
    hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none 
    focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'
              > */}
              <p className="block w-200 text-lg inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">
                <Link href={`/edit-post/${post.id}`}>投稿を編集する</Link>
              </p>

              {/* <p
                className='mr-5 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 
    hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none 
    focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'
              > */}
              <p className="block w-200 text-lg inline-block px-6 py-2.5  text-black font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-gray-200 hover:shadow-lg focus:bg-gray-200 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-200 active:shadow-lg transition duration-150 ease-in-out">
                <Link href={`/posts/${post.id}`}>投稿を見る</Link>
              </p>

              <button
                className='text-red-500 block w-200 text-lg inline-block px-6 py-2.5 text-black font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-gray-200 hover:shadow-lg focus:bg-gray-200 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-200 active:shadow-lg transition duration-150 ease-in-out'
                onClick={() => deletePost(post.id)}
              >
                投稿を削除する
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
