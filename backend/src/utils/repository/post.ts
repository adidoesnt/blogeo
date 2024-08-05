import { eq } from 'drizzle-orm';
import { database } from 'utils';
import { posts, type NewPost, type Post } from 'utils/database/schema';

export const createPost = async (post: NewPost): Promise<Post[] | null> => {
    try {
        return await database.client.insert(posts).values(post).returning();
    } catch (error) {
        console.error('Error creating post', error);
        return null;
    }
};

export const getPostById = async (id: number): Promise<Post | null> => {
    try {
        return (
            (
                await database.client
                    .select()
                    .from(posts)
                    .where(eq(posts.id, id))
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error getting post by id', error);
        return null;
    }
};

export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
    try {
        return (
            await database.client
                .select()
                .from(posts)
                .where(eq(posts.userId, userId))
        ).sort((a, b) => a.id - b.id);
    } catch (error) {
        console.error('Error getting posts by user id', error);
        return [];
    }
};

export const updatePost = async (
    id: number,
    post: Partial<NewPost>,
): Promise<Post | null> => {
    try {
        return (
            (
                await database.client
                    .update(posts)
                    .set(post)
                    .where(eq(posts.id, id))
                    .returning()
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error updating post', error);
        return null;
    }
};

export const deletePost = async (id: number): Promise<Post | null> => {
    try {
        return (
            (
                await database.client
                    .delete(posts)
                    .where(eq(posts.id, id))
                    .returning()
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error deleting post', error);
        return null;
    }
};
