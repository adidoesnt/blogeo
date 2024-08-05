import { eq } from 'drizzle-orm';
import { database } from 'components';
import { users, type NewUser, type User } from 'components/database/schema';

export const createUser = async (user: NewUser): Promise<User[] | null> => {
    try {
        return await database.client.insert(users).values(user).returning();
    } catch (error) {
        console.error('Error creating user', error);
        return null;
    }
};

export const getUserById = async (id: number): Promise<User | null> => {
    try {
        return (
            (
                await database.client
                    .select()
                    .from(users)
                    .where(eq(users.id, id))
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error getting user by id', error);
        return null;
    }
};

export const updateUser = async (
    id: number,
    user: Partial<NewUser>,
): Promise<User | null> => {
    try {
        return (
            (
                await database.client
                    .update(users)
                    .set(user)
                    .where(eq(users.id, id))
                    .returning()
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error updating user', error);
        return null;
    }
};

export const deleteUser = async (id: number): Promise<User | null> => {
    try {
        return (
            (
                await database.client
                    .delete(users)
                    .where(eq(users.id, id))
                    .returning()
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error deleting user', error);
        return null;
    }
};
