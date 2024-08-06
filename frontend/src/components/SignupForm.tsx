import React, { useCallback, useContext, useMemo, useState } from 'react';
import { signup } from '../utils/apiClient';
import { UserContext } from '../context/auth';

enum Type {
    USERNAME = 'Username',
    PASSWORD = 'Password',
}

function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useContext(UserContext)!;

    const handleSignup = useCallback(async () => {
        await signup({
            username,
            password,
        });
        setIsLoggedIn(true);
    }, [setIsLoggedIn, password, username]);

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

    const hiddenPassword = useMemo(() => {
        return password
            .split('')
            .map(() => '•')
            .join('');
    }, [password]);

    return (
        <div className="p-10 m-4 flex flex-col justify-center items-center gap-4 bg-zinc-700 rounded-lg">
            <h1 className="text-xl font-bold flex self-start">Sign Up</h1>
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
                    value={hiddenPassword}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        handleChange(e, Type.PASSWORD);
                    }}
                    placeholder={Type.PASSWORD}
                />
            </div>
            <div
                className="flex items-center p-2 bg-zinc-800 rounded-md mt-2"
                onClick={handleSignup}
            >
                <button>Sign up</button>
            </div>
        </div>
    );
}

export default SignupForm;
