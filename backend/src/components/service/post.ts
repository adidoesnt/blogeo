import { postRepository } from 'components/repository';
import { type NewPost, type Post } from 'components/database/schema';

export const createPost = async (post: NewPost): Promise<Post | null> => {
    try {
        return await postRepository.createPost(post);
    } catch (error) {
        console.error('Error creating post', error);
        return null;
    }
};
