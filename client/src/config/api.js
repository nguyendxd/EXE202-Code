export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',

    // Profile
    PROFILE: '/profiles',

    // Pets
    PETS: '/pets',
    PET_DETAIL: (id) => `/pets/${id}`,

    // Posts
    POSTS: '/posts',
    POST_DETAIL: (id) => `/posts/${id}`,

    // Wishlist
    WISHLIST: '/wishlist',

    // Blogs
    BLOGS: '/blogs',
    BLOG_DETAIL: (id) => `/blogs/${id}`,

    // Messages
    MESSAGES: '/messages',

    // Users
    USERS: '/users',
    USER_DETAIL: (id) => `/users/${id}`,
}; 