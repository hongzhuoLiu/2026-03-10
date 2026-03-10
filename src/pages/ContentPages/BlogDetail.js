import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../API';

function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/blogs/${id}`);
                const data = await response.json();
                setBlog(data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch blog details');
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!blog) return <div>Blog not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-6">
                    <img 
                        src={blog.attributes.users_permissions_user?.data?.attributes?.avatar?.data?.attributes?.url 
                            ? `${BASE_URL}${blog.attributes.users_permissions_user.data.attributes.avatar.data.attributes.url}`
                            : "https://backend-dev.studentschoice.blog/uploads/Default_Profile_Photo_3220d06254.jpg"
                        }
                        alt="avatar"
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">
                            {blog.attributes.users_permissions_user?.data?.attributes?.username || 'Anonymous'}
                        </h2>
                        <p className="text-gray-500">
                            {new Date(blog.attributes.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg">
                        {blog.attributes.blogText}
                    </p>
                </div>

                <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center">
                        <img 
                            src="https://backend-dev.studentschoice.blog/uploads/Star_Yellow_Fill_04a8dbbb9b.png" 
                            alt="likes" 
                            className="w-6 h-6 mr-2"
                        />
                        <span className="text-gray-600">
                            {blog.attributes.blogLikes || 0}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <img 
                            src="https://backend-dev.studentschoice.blog/uploads/Comment_Icon_3220d06254.png" 
                            alt="comments" 
                            className="w-6 h-6 mr-2"
                        />
                        <span className="text-gray-600">
                            {blog.attributes.comments?.data?.length || 0}
                        </span>
                    </div>
                </div>

                {blog.attributes.comments?.data && blog.attributes.comments.data.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Comments</h3>
                        <div className="space-y-4">
                            {blog.attributes.comments.data.map(comment => (
                                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <img 
                                            src={comment.attributes.users_permissions_user?.data?.attributes?.avatar?.data?.attributes?.url 
                                                ? `${BASE_URL}${comment.attributes.users_permissions_user.data.attributes.avatar.data.attributes.url}`
                                                : "https://backend-dev.studentschoice.blog/uploads/Default_Profile_Photo_3220d06254.jpg"
                                            }
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                {comment.attributes.users_permissions_user?.data?.attributes?.username || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(comment.attributes.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">
                                        {comment.attributes.commentText}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BlogDetail; 