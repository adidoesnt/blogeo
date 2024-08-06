import { useState } from 'react';
import { Post } from './apiClient';

export type PostPopupProps = {
    post: Post;
};

function PostPopup({ post }: PostPopupProps) {
    const [isOpen, setIsOpen] = useState(false);

    return isOpen ? (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-50 flex justify-center items-center backdrop-blur-md">
            <div className="bg-zinc-700 rounded-lg p-4 w-full max-w-[500px] flex flex-col items-center text-left gap-4 backdrop-blur-md">
                <h1 className="text-xl font-bold">{post.title}</h1>
                <div className="flex flex-col justify-center p-2 text-zinc-100 rounded-md mt-2 w-[85%] gap-4">
                    <div className="flex flex-col justify-center gap-2">
                        <p>{post.content}</p>
                    </div>
                    <div className="flex w-[50%] self-center justify-center p-2 bg-zinc-800 rounded-md mt-10">
                        <button onClick={() => setIsOpen(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex flex-col justify-center p-2 bg-zinc-700 rounded-md mt-2">
            <div className="flex flex-col justify-center gap-2">
                <span onClick={() => setIsOpen(true)}>{post.title}</span>
            </div>
        </div>
    );
}

export default PostPopup;
