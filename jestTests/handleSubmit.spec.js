const { handleSubmit } = require('./utils');

test('should show error when postText is empty', () => {
    // Mock相关的依赖项
    const e = { preventDefault: jest.fn(), target: { elements: { postTextInput: { value: '   ' } } } };
    const setError = jest.fn();
    const setAddingPost = jest.fn();

    handleSubmit(e);

    expect(setError).toHaveBeenCalledWith("Post cannot be empty or just spaces");
    expect(setAddingPost).toHaveBeenCalledWith(false);
});

test('should prevent multiple submissions if a post is already being added', () => {
    const e = { preventDefault: jest.fn() };
    const setAddingPost = jest.fn();

    // 假设 addingPost 为 true
    addingPost = true;

    handleSubmit(e);

    expect(setAddingPost).not.toHaveBeenCalled();
});

test('should generate correct post data for review', () => {
    const postTypeSelect = 'reviews';
    const user = { id: 123 };
    const interactionName = 'program-pages/456';
    const postText = 'Test post';

    const data = getPostData();  // 确保函数可以访问到这些全局变量

    expect(data).toEqual({
        likes: 0,
        text: 'Test post',
        users_permissions_user: 123,
        reviewLikes: 0,
        reviewText: 'Test post',
        reviewRating: 0,
        program_page: { id: '456' }
    });
});
