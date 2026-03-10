const { getPostData } = require('./utils');


global.trimmedReplyText = 'Test comment';
global.user = { id: 123 };
global.args = { initialID: 1 };
global.selectedButton = 'review';

test('returns correct data for review', () => {
    const result = getPostData();
    expect(result).toEqual({
        commentText: 'Test comment',
        users_permissions_user: 123,
        reviews: { id: 1 },
    });
});