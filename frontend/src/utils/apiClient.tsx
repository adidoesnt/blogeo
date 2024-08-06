import axios from 'axios';

export type SignupParams = {
    username: string;
    password: string;
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
        const { user } = response.data;
        console.log('Completed signup for user', user);
    } catch (error) {
        console.error('Error completing signup', error);
    }
};
