import React, { useCallback, useContext, useState } from 'react';
import { signup } from '../utils/apiClient';
import { UserContext } from '../context/auth';
import { LoginModeContext } from '../context/loginMode';

enum Type {
    USERNAME = 'Username',
    PASSWORD = 'Password',
}

export type SignupFormProps = {
    loginMode?: boolean;
};

function SignupForm({ loginMode }: SignupFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {
        setIsLoggedIn,
        setUsername: setLoggedInUsername,
        setToken,
        setHasBlog,
        setUserId,
        setHasBlogRequest,
    } = useContext(UserContext)!;
    const { setIsLogInMode: setLoginMode } = useContext(LoginModeContext)!;

    const handleSubmit = useCallback(async () => {
        const user = await signup({
            username,
            password,
            loginMode,
        });
        if (!user) throw new Error('Signup failed');
        const {
            username: loggedInUsername,
            token,
            hasBlog,
            userId,
            hasBlogRequest,
        } = user;
        setLoggedInUsername(loggedInUsername);
        setUserId(userId);
        setHasBlog(hasBlog);
        setHasBlogRequest(hasBlogRequest);
        setToken(token);
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
    }, [
        username,
        password,
        setLoggedInUsername,
        setToken,
        setIsLoggedIn,
        loginMode,
        setHasBlog,
        setUserId,
        setHasBlogRequest
    ]);

    const handleSwitch = useCallback(() => {
        setUsername('');
        setPassword('');
        setLoginMode(!loginMode);
    }, [loginMode, setLoginMode]);

    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>, type: Type) => {
            switch (type) {
                case Type.USERNAME:
                    setUsername((e.target as HTMLInputElement).value);
                    break;
                case Type.PASSWORD:
                    setPassword((e.target as HTMLInputElement).value);
                    break;
                default:
                    throw new Error(`Unknown type: ${type}`);
            }
        },
        [],
    );

    return (
        <div className="p-10 m-4 flex flex-col justify-center items-center gap-4 bg-zinc-700 rounded-lg">
            <h1 className="text-xl font-bold flex self-start">
                {loginMode ? 'Log In' : 'Sign Up'}
            </h1>
            <div className="flex flex-col justify-center gap-2">
                <span>{Type.USERNAME}</span>
                <input
                    className="flex p-2 rounded-md bg-zinc-100 text-black"
                    value={username}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        handleChange(e, Type.USERNAME);
                    }}
                    placeholder={Type.USERNAME}
                />
            </div>
            <div className="flex flex-col justify-center gap-2">
                <span>{Type.PASSWORD}</span>
                <input
                    className="flex p-2 rounded-md bg-zinc-100 text-black"
                    value={password}
                    type={Type.PASSWORD.toLowerCase()}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        handleChange(e, Type.PASSWORD);
                    }}
                    placeholder={Type.PASSWORD}
                />
            </div>
            <div
                className="flex flex-col justify-center p-2 bg-zinc-800 rounded-md mt-2 w-[50%]"
                onClick={handleSubmit}
            >
                <button>{loginMode ? 'Log In' : 'Sign Up'}</button>
            </div>
            <div className="flex flex-col justify-center p-2 bg-zinc-100 text-zinc-700 rounded-md mt-2 w-[50%]">
                <button onClick={handleSwitch}>
                    {loginMode ? 'Sign Up' : 'Log In'}
                </button>
            </div>
        </div>
    );
}

export default SignupForm;
