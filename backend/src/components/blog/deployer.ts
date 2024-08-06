import { type User } from 'components/database/schema';
import { queue } from 'components/queue';
import { MessageType } from 'components/queue/queue';
import { userRepository } from 'components/repository';
import { default as deploy } from 'components/blog/deploy';

const { SERVER_URL = 'DUMMY_SERVER_URL' } = process.env;

export type DeployBlogParams = {
    userId: number;
};

export const deployBlogValidator = async (userId: number, handle: string) => {
    try {
        console.log('Checking if blog exists...');
        const user = await userRepository.getUserById(userId);
        if (!user) throw new Error('User not found');
        if (!user.hasBlog)
            throw new Error('User did not send a blog creation request');
    } catch (error) {
        console.error('Error deploying blog', error);
    }
};

export const deployBlog = async (user: User, handle: string) => {
    console.log('Deploying blog...');
    await deploy(user, SERVER_URL);
    await queue.deleteMessage(handle);
    console.log('Sent blog deployment status message');
};
