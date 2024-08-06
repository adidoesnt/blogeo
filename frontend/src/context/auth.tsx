import React, { useMemo, useState } from 'react';

export type UserContextProviderProps = {
    children: JSX.Element | JSX.Element[];
};

export type UserContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = React.createContext<UserContextType | null>(null);

function UserContextProvider({ children }: Readonly<UserContextProviderProps>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const context = useMemo(
        () => ({
            isLoggedIn,
            setIsLoggedIn,
        }),
        [isLoggedIn, setIsLoggedIn],
    );

    return (
        <UserContext.Provider value={context}>{children}</UserContext.Provider>
    );
}

export default UserContextProvider;
