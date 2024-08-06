import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import UserContextProvider from './context/auth.tsx';
import LoginModeContextProvider from './context/loginMode.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LoginModeContextProvider>
            <UserContextProvider>
                <App />
            </UserContextProvider>
        </LoginModeContextProvider>
    </React.StrictMode>,
);
