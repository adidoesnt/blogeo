import { type User } from 'components/database/schema';
import { queue } from 'components/queue';
import { userRepository } from 'components/repository';
import { default as deploy } from 'components/blog/deploy';

const { SERVER_URL = 'DUMMY_SERVER_URL' } = process.env;

export type DeployBlogParams = {
    userId: number;
};

export const deployBlogValidator = async (userId: number, handle: string) => {
    try {
        console.log('Checking for blog creation request...');
        const user = await userRepository.getUserById(userId);
        if (!user) throw new Error('User not found');
        if (!user.hasBlogRequest)
            throw new Error('User did not send a blog creation request');
        console.log('Blog creation request found.');
        await deployBlog(user, handle);
    } catch (error) {
        console.error('Error deploying blog', error);
    }
};

export const deployBlog = async (user: User, handle: string) => {
    console.log('Deploying blog...');
    await deploy(user, SERVER_URL);
    await userRepository.updateUser(user.id, { hasBlog: true });
    await queue.deleteMessage(handle);
    console.log('Blog deployed successfully, deleted message');
};
