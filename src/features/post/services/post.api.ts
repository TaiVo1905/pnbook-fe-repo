const BASE_URL = 'https://pn-book-bj6tn.ondigitalocean.app/api/v1';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const postApi = {
  createPost: async (payload: { content: string; image_url?: string }) => {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getFeeds: async () => {
    const res = await fetch(`${BASE_URL}/feeds`, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    return res.json();
  },

  getUserPosts: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/posts`, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    return res.json();
  },

  getPostDetail: async (postId: string) => {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    return res.json();
  },

  updatePost: async (postId: string, content: string) => {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'PATCH',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify({ content }),
    });
    return res.json();
  },

  deletePost: async (postId: string) => {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return res.json();
  },

  getReactions: async (postId: string) => {
    const res = await fetch(`${BASE_URL}/posts/${postId}/reactions`, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    return res.json();
  },

  getUserById: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    return res.json();
  },

  searchUsers: async (
    keyword: string,
    page: number = 1,
    limit: number = 20
  ) => {
    const res = await fetch(
      `${BASE_URL}/search/users?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`,
      {
        headers: defaultHeaders,
        credentials: 'include',
      }
    );
    return res.json();
  },
};
