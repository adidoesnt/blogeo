import { SQS } from '@aws-sdk/client-sqs';
import { deployBlogValidator } from 'components/blog/deployer';
import type { User } from 'components/database/schema';

const {
    AWS_REGION: region = 'ap-southeast-1',
    SQS_ENDPOINT: endpoint = 'DUMMY-ENDPOINT',
    SQS_INTERVAL = 30,
} = process.env;

export enum MessageType {
    DEPLOYMENT_REQUEST = 'DEPLOYMENT_REQUEST',
}

const queue = new SQS({
    region,
    endpoint,
});

export const sendMessage = async ({
    user,
    type,
}: {
    type: MessageType;
    user: User;
}) => {
    try {
        console.log('Sending message to SQS queue...');
        await queue.sendMessage({
            MessageBody: JSON.stringify({ user, type }),
            QueueUrl: endpoint,
        });
    } catch (error) {
        console.error('Error sending message', error);
    }
};

export const pullMessages = async () => {
    try {
        console.log('📩 Pulling messages from SQS queue...');
        const response = await queue.receiveMessage({
            QueueUrl: endpoint,
        });
        const { Messages: messages } = response;
        console.log(`📬 Received ${messages?.length ?? 0} messages.`);
        if (messages) {
            const promises = messages.map(async (message) => {
                const { Body: body, ReceiptHandle: handle } = message;
                console.log(`Processing message ${handle}`);
                const { user, type } = JSON.parse(body ?? '{}');
                switch (type) {
                    case MessageType.DEPLOYMENT_REQUEST:
                        console.log('Received deployment request message');
                        await deployBlogValidator(user.id, handle!);
                        break;
                    default:
                        throw new Error('Unknown message type');
                }
            });
            await Promise.all(promises);
        }
    } catch (error) {
        console.error('Error pulling messages', error);
    }
};

const init = async () => {
    await pullMessages();
    setInterval(async () => await pullMessages(), Number(SQS_INTERVAL) * 1000);
};

const deleteMessage = async (handle: string) => {
    queue.deleteMessage({
        QueueUrl: endpoint,
        ReceiptHandle: handle,
    });
};

export default {
    init,
    sendMessage,
    deleteMessage,
};
