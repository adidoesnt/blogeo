import React, { useMemo, useState } from 'react';

export type UserContextProviderProps = {
    children: JSX.Element | JSX.Element[];
};

export type UserContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UserContext = React.createContext<UserContextType | null>(null);

function UserContextProvider({ children }: Readonly<UserContextProviderProps>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const context = useMemo(
        () => ({
            isLoggedIn,
            setIsLoggedIn,
            username,
            setUsername,
            token,
            setToken,
        }),
        [isLoggedIn, token, username, setIsLoggedIn, setUsername, setToken],
    );

    return (
        <UserContext.Provider value={context}>{children}</UserContext.Provider>
    );
}

export default UserContextProvider;
