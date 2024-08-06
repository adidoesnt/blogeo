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

type User = {
    id: number;
    username: string;
    password: string;
    hasBlogRequest: boolean;
    hasBlog: boolean;
    token: string;
};

const { VITE_SERVER_URL: baseURL = 'DUMMY_SERVER_URL' } = import.meta.env;

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthHeader = (token: string | null) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const signup = async ({
    username,
    password,
    loginMode,
}: SignupParams) => {
    try {
        const path = loginMode ? '/user/login' : '/user/signup';
        const response = await apiClient.post(path, {
            username,
            password,
        });
        const user = response.data.user as User;
        console.log('Completed signup for user', user);
        setAuthHeader(user.token);
        return {
            userId: user.id,
            username: user.username,
            token: user.token,
            hasBlog: user.hasBlog,
            hasBlogRequest: user.hasBlogRequest,
        };
    } catch (error) {
        console.error('Error completing signup', error);
    }
};

export const logout = async (token: string) => {
    try {
        const response = await apiClient.post('/user/logout', {
            token,
        });
        setAuthHeader(null);
        console.log('Completed logout', response);
    } catch (error) {
        console.error('Error completing logout', error);
    }
};

export const createPost = async ({
    userId,
    title,
    content,
}: CreatePostParams) => {
    try {
        const response = await apiClient.post('/post', {
            userId,
            title,
            content,
        });
        const { post } = response.data;
        console.log('Created post', post);
    } catch (error) {
        console.error('Error creating post', error);
    }
};

export const createBlog = async (userId: number) => {
    try {
        const response = await apiClient.post('/user/blog', { userId });
        console.log('Sent blog creation request', response);
    } catch (error) {
        console.error('Error sending blog creation request', error);
    }
};
