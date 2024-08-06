import { useCallback, useEffect, useState } from 'react';
import { getUserPosts, Post } from './apiClient';
import PostPopup from './PostPopup';

const { VITE_USERNAME = 'dummy' } = import.meta.env;

function App() {
    const toFirstLetterUppercase = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);
    const username = toFirstLetterUppercase(VITE_USERNAME);

    const [posts, setPosts] = useState<Post[]>([]);

    const getPosts = useCallback(async () => {
        return await getUserPosts(username);
    }, [username]);

    useEffect(() => {
        getPosts().then((fetchedPosts) => {
            console.log('Fetched posts', fetchedPosts);
            setPosts(fetchedPosts ?? []);
        });
    }, [getPosts]);

    return (
        <div className="flex flex-col justify-center items-center gap-4 bg-zinc-700 rounded-lg p-8 min-w-[300px] text-center">
            <h1 className="text-xl font-bold">{username}'s Blog</h1>
            {posts?.length > 0 ? (
                <div className="flex flex-col justify-center p-4 bg-zinc-800 text-zinc-100 rounded-md w-full gap-4">
                    {posts.map((post) => (
                        <PostPopup post={post} />
                    ))}
                </div>
            ) : (
                <span>No posts yet!</span>
            )}
        </div>
    );
}

export default App;
