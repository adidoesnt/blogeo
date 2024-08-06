import { userRepository } from 'components/repository';
import { type NewUser, type User } from 'components/database/schema';
import { compare, hash } from 'bcrypt';
import { tokenService } from '.';

const { SALT_ROUNDS = 10 } = process.env;

export const signup = async (
    user: NewUser,
): Promise<(User & { token: string }) | null> => {
    try {
        const { username, password } = user;
        const fetchedUser = await userRepository.getUserByUsername(username);
        if (fetchedUser) throw new Error('User already exists');
        user.password = await hash(password, Number(SALT_ROUNDS));
        const createdUser = await userRepository.createUser(user);
        if (!createdUser) throw new Error('Error creating user');
        const token = await tokenService.createToken({
            userId: createdUser.id,
            username,
        });
        if (!token) throw new Error('Error creating token');
        return {
            ...createdUser,
            token,
        };
    } catch (error) {
        console.error('Error creating user', error);
        return null;
    }
};

export const login = async (
    user: NewUser,
): Promise<(User & { token: string }) | null> => {
    try {
        const { username, password } = user;
        const fetchedUser = await userRepository.getUserByUsername(username);
        if (!fetchedUser) throw new Error('User not found');
        const isPasswordValid = await compare(password, fetchedUser.password);
        if (!isPasswordValid) throw new Error('Invalid password');
        const token = await tokenService.createToken({
            userId: fetchedUser.id,
            username,
        });
        if (!token) throw new Error('Error creating token');
        return { ...fetchedUser, token };
    } catch (error) {
        console.error('Error logging in user', error);
        return null;
    }
};

export const logout = async (token: string): Promise<boolean> => {
    try {
        await tokenService.expireToken(token);
        return true;
    } catch (error) {
        console.error('Error logging out user', error);
        return false;
    }
};
