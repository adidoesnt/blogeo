import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../context/auth';
import { logout } from '../utils/apiClient';
import { LoginModeContext } from '../context/loginMode';
import CreatePostPopup from './CreatePostPopup';

function CreateBlogForm() {
    const { token, setIsLoggedIn, setToken, setUsername, hasBlog } =
        useContext(UserContext)!;
    const { setIsLogInMode } = useContext(LoginModeContext)!;
    const [isOpen, setIsOpen] = useState(false);

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

    const handleCreatePost = useCallback(() => {
        setIsOpen(true);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center gap-4 bg-zinc-700 rounded-lg p-8 min-w-[300px] text-center">
            <h1 className="text-xl font-bold">Manage Blog</h1>
            <div className="flex flex-col justify-center p-2 bg-zinc-800 text-zinc-100 rounded-md mt-2 w-[50%]">
                <button disabled={hasBlog} onClick={handleCreateBlog}>
                    Create Blog
                </button>
            </div>
            <div className="flex flex-col justify-center p-2 bg-zinc-800 text-zinc-100 rounded-md mt-2 w-[50%]">
                <button disabled={!hasBlog} onClick={handleCreatePost}>
                    Create Post
                </button>
            </div>
            <div className="flex flex-col justify-center p-2 bg-zinc-800 text-zinc-100 rounded-md mt-2 w-[50%]">
                <button onClick={handleLogout}>Log Out</button>
            </div>
            <CreatePostPopup isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}

export default CreateBlogForm;
