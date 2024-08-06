import axios from 'axios';

export type SignupParams = {
    username: string;
    password: string;
    loginMode?: boolean;
};

export type CreatePostParams = {
    userId: number;
    title: string;
    content: string;
};

export type Post = {
    id: number;
    title: string;
    content: string;
    userId: number;
};

const { VITE_SERVER_URL: baseURL = 'DUMMY_SERVER_URL' } = import.meta.env;

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUserPosts = async (username: string) => {
    try {
        const response = await apiClient.get(`/user/${username}/posts`);
        const { posts } = response.data;
        console.log('Fetched user posts', posts);
        return posts as Post[];
    } catch (error) {
        console.error('Error getting user posts', error);
    }
};
