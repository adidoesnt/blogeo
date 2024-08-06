import { SQS } from '@aws-sdk/client-sqs';
import type { User } from 'components/database/schema';

const {
    AWS_REGION: region = 'ap-southeast-1',
    SQS_ENDPOINT: endpoint = 'DUMMY-ENDPOINT',
    SQS_INTERVAL = 30,
} = process.env;

const queue = new SQS({
    region,
    endpoint,
});

export const sendMessage = async (user: User) => {
    try {
        console.log('Sending message to SQS queue...');
        await queue.sendMessage({
            MessageBody: JSON.stringify(user),
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
        console.log(`📬 Received ${messages?.length ?? 0} messages.`)
        if (messages) {
            const promises = messages.map(async (message) => {
                const { Body: body, ReceiptHandle: handle } = message;
                console.log(`Processing message ${handle}`);
                const user = JSON.parse(body ?? '{}');
                // TODO: deploy template FE repo with relevant env vars
                await Promise.resolve();
                queue.deleteMessage({
                    QueueUrl: endpoint,
                    ReceiptHandle: handle,
                });
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

export default {
    init,
    sendMessage,
};
