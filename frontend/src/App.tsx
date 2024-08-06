import { useContext } from 'react';
import SignupForm from './components/SignupForm';
import { UserContext } from './context/auth';
import CreateBlogForm from './components/CreateBlogForm';
import { LoginModeContext } from './context/loginMode';

function App() {
    const { isLoggedIn } = useContext(UserContext)!;
    const { isLoginMode } = useContext(LoginModeContext)!;

    return (
        <>
            {isLoggedIn ? (
                <CreateBlogForm />
            ) : (
                <SignupForm loginMode={isLoginMode} />
            )}
        </>
    );
}

export default App;
