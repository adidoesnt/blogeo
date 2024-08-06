import React, { useMemo, useState } from 'react';

export type LoginModeContextProviderProps = {
    children: JSX.Element | JSX.Element[];
};

export type LoginModeContextType = {
    isLoginMode: boolean;
    setIsLogInMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginModeContext =
    React.createContext<LoginModeContextType | null>(null);

function LoginModeContextProvider({
    children,
}: Readonly<LoginModeContextProviderProps>) {
    const [isLoginMode, setIsLogInMode] = useState(false);

    const context = useMemo(
        () => ({
            isLoginMode,
            setIsLogInMode,
        }),
        [isLoginMode, setIsLogInMode],
    );

    return (
        <LoginModeContext.Provider value={context}>
            {children}
        </LoginModeContext.Provider>
    );
}

export default LoginModeContextProvider;
