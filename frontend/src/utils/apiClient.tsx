import axios from 'axios';

export type SignupParams = {
    username: string;
    password: string;
    loginMode?: boolean;
};

type User = {
    id: number;
    username: string;
    password: string;
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
        return {
            username: user.username,
            token: user.token,
            hasBlog: user.hasBlog,
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
        console.log('Completed logout', response);
    } catch (error) {
        console.error('Error completing logout', error);
    }
};
