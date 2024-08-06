import { tokenRepository, userRepository } from 'components/repository';
import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'DUMMY-SECRET', JWT_EXPIRY = 60 } = process.env;

export type CreateTokenParams = {
    userId: number;
    username: string;
};

export const createToken = async ({
    userId,
    username,
}: CreateTokenParams): Promise<string | null> => {
    try {
        const expiresIn = Number(JWT_EXPIRY) * 60;
        const expiresInMs = expiresIn * 1000;
        const token = jwt.sign({ userId, username }, JWT_SECRET, {
            expiresIn,
        });
        await tokenRepository.createToken({
            userId,
            token,
        });
        setTimeout(expireToken.bind(null, token), expiresInMs);
        return token;
    } catch (error) {
        console.error('Error creating token', error);
        return null;
    }
};

export const expireToken = async (token: string): Promise<boolean> => {
    try {
        await tokenRepository.updateTokenByToken(token, {
            expired: true,
        });
        return true;
    } catch (error) {
        console.error('Error expiring token', error);
        return false;
    }
};

export const validateToken = async (token: string): Promise<boolean> => {
    const { userId, username } = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        username: string;
    };
    const user = await userRepository.getUserByUsername(username);
    if (!user) return false;
    const { id: fetchedUserId } = user;
    return fetchedUserId === userId;
};
