import { postRepository, userRepository } from 'components/repository';
import { type NewPost, type Post } from 'components/database/schema';

export const createPost = async (post: NewPost): Promise<Post | null> => {
    try {
        return await postRepository.createPost(post);
    } catch (error) {
        console.error('Error creating post', error);
        return null;
    }
};

export const getPostsByUsername = async (
    username: string,
): Promise<Post[] | null> => {
    try {
        const user = await userRepository.getUserByUsername(username);
        if (!user) throw new Error('User not found');
        const { id: userId } = user;
        return await postRepository.getPostsByUserId(userId);
    } catch (error) {
        console.error('Error getting posts by username', error);
        return null;
    }
};
