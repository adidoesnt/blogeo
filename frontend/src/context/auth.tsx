import React, { useMemo, useState } from 'react';

export type UserContextProviderProps = {
    children: JSX.Element | JSX.Element[];
};

export type UserContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userId: number | null;
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    hasBlog: boolean;
    setHasBlog: React.Dispatch<React.SetStateAction<boolean>>;
    hasBlogRequest: boolean;
    setHasBlogRequest: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = React.createContext<UserContextType | null>(null);

function UserContextProvider({ children }: Readonly<UserContextProviderProps>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [hasBlog, setHasBlog] = useState(false);
    const [hasBlogRequest, setHasBlogRequest] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const context = useMemo(
        () => ({
            isLoggedIn,
            setIsLoggedIn,
            username,
            setUsername,
            token,
            setToken,
            hasBlog,
            setHasBlog,
            userId,
            setUserId,
            hasBlogRequest,
            setHasBlogRequest,
        }),
        [
            isLoggedIn,
            token,
            username,
            setIsLoggedIn,
            setUsername,
            setToken,
            hasBlog,
            setHasBlog,
            userId,
            setUserId,
            hasBlogRequest,
            setHasBlogRequest,
        ],
    );

    return (
        <UserContext.Provider value={context}>{children}</UserContext.Provider>
    );
}

export default UserContextProvider;
