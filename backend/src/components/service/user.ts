import { userRepository } from 'components/repository';
import { type NewUser, type User } from 'components/database/schema';
import { hash } from 'bcrypt';

const { SALT_ROUNDS = 10 } = process.env;

export const createUser = async (user: NewUser): Promise<User | null> => {
    try {
        const { password } = user;
        user.password = await hash(password, Number(SALT_ROUNDS));
        return await userRepository.createUser(user);
    } catch (error) {
        console.error('Error creating user', error);
        return null;
    }
};
