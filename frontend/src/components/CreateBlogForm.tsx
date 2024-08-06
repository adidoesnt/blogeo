import { useCallback, useContext } from 'react';
import { UserContext } from '../context/auth';
import { logout } from '../utils/apiClient';
import { LoginModeContext } from '../context/loginMode';

function CreateBlogForm() {
    const { token, setIsLoggedIn, setToken, setUsername } =
        useContext(UserContext)!;
    const { setIsLogInMode } = useContext(LoginModeContext)!;

    const handleLogout = useCallback(async () => {
        try {
            await logout(token!);
            setIsLoggedIn(false);
            setToken(null);
            setUsername(null);
            setIsLogInMode(false);
        } catch (error) {
            console.error('Error logging out', error);
        }
    }, [token, setIsLoggedIn, setToken, setUsername, setIsLogInMode]);

    const handleCreateBlog = useCallback(() => {
        console.log('Create blog');
    }, []);

    return (
        <div className="flex flex-col justify-center items-center gap-4 bg-zinc-700 rounded-lg p-4">
            <h1 className="text-xl font-bold flex self-start">Create Blog</h1>
            <div className="flex flex-col justify-center p-2 bg-zinc-800 text-zinc-100 rounded-md mt-2 w-full">
                <button onClick={handleCreateBlog}>Create blog</button>
            </div>
            <div className="flex flex-col justify-center p-2 bg-zinc-800 text-zinc-100 rounded-md mt-2 w-full">
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}

export default CreateBlogForm;
