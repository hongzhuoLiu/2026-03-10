import React from 'react';
import ActivityCard from './ActivityCard';

const ActivityGrid = ({ posts, onDelete}) => { // Removed 'user' prop
    console.log("Posts in ActivityGrid:", posts); // Debugging

    if (!Array.isArray(posts) || posts.length === 0) {
        return <div className="w-4/5 mx-auto my-5">No activity to display</div>;
    }

    return (
        <div className="w-4/5 mx-auto my-5">
            <div className="grid grid-cols-1 gap-4">
                {posts.map((post) => (
                    <ActivityCard key={`${post.type}-${post.id}`} post={post} onDelete={onDelete}/>
                ))}
            </div>
        </div>
    );
};

export default ActivityGrid;
