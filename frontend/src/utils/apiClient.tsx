import axios from 'axios';

export type SignupParams = {
    username: string;
    password: string;
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

export const signup = async ({ username, password }: SignupParams) => {
    try {
        const response = await apiClient.post('/user', {
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
