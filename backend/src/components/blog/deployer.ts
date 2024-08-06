import { BlogStatus, type User } from 'components/database/schema';
import { queue } from 'components/queue';
import { MessageType } from 'components/queue/queue';
import { userRepository } from 'components/repository';

export type DeployBlogParams = {
    userId: number;
};

export const deployBlogValidator = async (userId: number, handle: string) => {
    try {
        console.log('Checking if blog exists...');
        const user = await userRepository.getUserById(userId);
        if (!user) throw new Error('User not found');
        if (!user.hasBlog)
            throw new Error('User did send a blog creation request');
        switch (user.blogStatus as BlogStatus) {
            case BlogStatus.DEPLOYED:
                console.log('Blog already deployed');
                await queue.deleteMessage(handle);
                return;
            case BlogStatus.DEPLOYING:
                console.log('Blog is pending');
                await queue.deleteMessage(handle);
                return;
            case BlogStatus.FAILED:
                console.log('Blog failed to deploy');
                await queue.deleteMessage(handle);
                return;
            case BlogStatus.UNINITIALIZED:
                console.log('Deploying blog...');
                await deployBlog(user, handle);
                return;
            default:
                throw new Error('Unknown blog status');
        }
    } catch (error) {
        console.error('Error deploying blog', error);
    }
};

export const deployBlog = async (user: User, handle: string) => {
    console.log('Deploying blog...');
    // TODO: deploy blog
    await queue.deleteMessage(handle);
    await userRepository.updateUser(user.id, {
        blogStatus: BlogStatus.DEPLOYING,
    });
    await queue.sendMessage({
        user,
        type: MessageType.DEPLOYMENT_STATUS,
    });
    console.log('Sent blog deployment status message');
};

export const blogDeploymentStatusHandler = async (userId: number, handle: string) => {
    console.log('Checking blog deployment status...');
    // TODO: check blog deployment status
    // if successful, update blog deployment status and delete message
    console.log('Blog deployment status checked');
};
