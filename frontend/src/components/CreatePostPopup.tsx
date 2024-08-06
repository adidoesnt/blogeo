import { useCallback, useContext, useState } from 'react';
import { UserContext } from '../context/auth';
import { createPost } from '../utils/apiClient';

enum Type {
    USER_ID = 'User ID',
    TITLE = 'Title',
    CONTENT = 'Content',
}

export type CreatePostPopupProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreatePostPopup({ isOpen, setIsOpen }: CreatePostPopupProps) {
    const { userId } = useContext(UserContext)!;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setTitle('');
        setContent('');
    }, [setIsOpen]);

    const handleSubmit = useCallback(async () => {
        await createPost({
            userId: userId!,
            title,
            content,
        });
        handleClose();
    }, [userId, title, content, handleClose]);

    return (
        isOpen && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-md">
                <div className="bg-zinc-800 rounded-lg p-4 w-full max-w-[500px] flex flex-col items-center text-left gap-4">
                    <h1 className="text-xl font-bold">Create Post</h1>
                    <div className="flex flex-col justify-center p-2 bg-zinc-800 text-zinc-100 rounded-md mt-2 w-[85%] gap-4">
                        <div className="flex flex-col justify-center gap-2">
                            <span>{Type.USER_ID}</span>
                            <input
                                className="flex p-2 rounded-md bg-zinc-400 text-gray"
                                type="text"
                                value={String(userId!)}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                            <span>{Type.TITLE}</span>
                            <input
                                className="flex p-2 rounded-md bg-zinc-100 text-black"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={Type.TITLE}
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                            <span>{Type.CONTENT}</span>
                            <textarea
                                className="flex p-2 rounded-md bg-zinc-100 text-black min-h-[200px]"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={Type.CONTENT}
                            />
                        </div>
                        <div className="flex flex-col justify-center p-2 bg-zinc-700 rounded-md mt-2">
                            <button onClick={handleSubmit}>Create Post</button>
                        </div>
                        <div className="flex flex-col justify-center p-2 bg-zinc-700 rounded-md mt-2">
                            <button onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default CreatePostPopup;
