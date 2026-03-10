import React from 'react';

const MyActivityBar = () => {

  const posts = [
    { content: "Post/Review/Question 1 posted by the user" },
    { content: "Post/Review/Question 2 liked by the user" },
    { content: "Post/Review/Question 3 responded by the user" },
    { content: "Comment of Post/Review/Question 4 liked by the user" },
    { content: "Post/Review/Question 5 downvoted by the user" },
  ];

  return (
    <div className="w-4/5 mx-auto my-5">
      {posts.map((post, index) => (
        <div key={index} className="border-2 border-black p-5 mb-4">
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MyActivityBar;
