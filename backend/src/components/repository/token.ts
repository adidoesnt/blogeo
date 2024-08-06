import { database } from 'components';
import { tokens, type NewToken, type Token } from 'components/database/schema';
import { eq } from 'drizzle-orm';

export const createToken = async (token: NewToken): Promise<Token | null> => {
    try {
        return (
            (
                await database.client.insert(tokens).values(token).returning()
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error creating token', error);
        return null;
    }
};

export const getTokenById = async (id: number): Promise<Token | null> => {
    try {
        return (
            (
                await database.client
                    .select()
                    .from(tokens)
                    .where(eq(tokens.id, id))
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error getting token by id', error);
        return null;
    }
};

export const updateTokenByToken = async (
    token: string,
    attributes: Partial<NewToken>,
): Promise<Token | null> => {
    try {
        return (
            (
                await database.client
                    .update(tokens)
                    .set(attributes)
                    .where(eq(tokens.token, token))
                    .returning()
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error updating token', error);
        return null;
    }
};

export const deleteToken = async (id: number): Promise<Token | null> => {
    try {
        return (
            (
                await database.client
                    .delete(tokens)
                    .where(eq(tokens.id, id))
                    .returning()
            ).shift() ?? null
        );
    } catch (error) {
        console.error('Error deleting token', error);
        return null;
    }
};
