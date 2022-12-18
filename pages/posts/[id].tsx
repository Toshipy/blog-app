import React from 'react'
import { API } from 'aws-amplify';
import { useRouter } from 'next/router';
import { listPosts, getPost } from '../../src/graphql/queries';
import '../../configureAmplify';
import ReactMarkdown from 'react-markdown';


// const Test = () => {
//   return (
//     <div>
//       test
//     </div>
//   )
// }

// export default Test




export default function Post({ post }:{post: any}) {  
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return ( 
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracing-wide">
        {post.title}
      </h1>
      <p className="text-sm  font-light my-4">ユーザー名：{post.username}</p>
      <div className="mt-8">
        <p className="text-sm  font-light my-4">内容：{post.content}</p>
        {/* <p ReactMarkDown="prose">内容：{post.content}</p> */}
      </div>
    </div>
  )

}

export async function getStaticPaths() {
  const postData = await API.graphql({
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
    const postData = await API.graphql({
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
