// Used when the like icon on a Review Card (review/blog/qna) or its corresponding Comment Popup is clicked 
// This is for syncing the displayed icon like/dislike count and color between ReviewCard.js and CommentsPopup.js (Not updating the value on Strapi)
// When like on a review card is clicked, the corresponding comment popup also reflects the same like count and color (And vice versa)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    likeNumberTracker: {}, // JavaScript object (Like Java Map)
    likeColorTracker: {},
    dislikeNumberTracker: {},
    dislikeColorTracker: {}
};

const displayedLikeDislikeSlice = createSlice({
    name: 'displayedLikeDislike',
    initialState,
    reducers: {
        setCurrentLikeCount: (state, action) => {
            const { id, likes } = action.payload; // Extract the specific "id" property from the payload
            state.likeNumberTracker[id] = likes; // Store the key-value pair into the likeNumberTracker object
            console.log("Current like count in reducer: ", likes);
        },
        setCurrentLikeColor: (state, action) => {
            const { id, color } = action.payload;
            state.likeColorTracker[id] = color;
            console.log("Current like color in reducer: ", color);
        },
        setCurrentDislikeCount: (state, action) => {
            const { id, dislikes } = action.payload;
            state.dislikeNumberTracker[id] = dislikes;
            console.log("Current dislike count in reducer: ", dislikes);
        },
        setCurrentDislikeColor: (state, action) => {
            const { id, color } = action.payload;
            state.dislikeColorTracker[id] = color;
        }
    }
});

export const { setCurrentLikeCount, setCurrentLikeColor, setCurrentDislikeCount, setCurrentDislikeColor } = displayedLikeDislikeSlice.actions;
export default displayedLikeDislikeSlice.reducer;