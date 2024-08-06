import {
    CreateBucketCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const {
    AWS_REGION: region = 'ap-southeast-1',
    S3_ENDPOINT: endpoint = 'DUMMY-ENDPOINT',
    AWS_ACCESS_KEY_ID: accessKeyId = 'DUMMY-ACCESS-KEY-ID',
    AWS_SECRET_ACCESS_KEY: secretAccessKey = 'DUMMY-SECRET-ACCESS-KEY',
} = process.env;

const s3Client = new S3Client({
    endpoint,
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    forcePathStyle: true,
});

const uploadFile = async (
    bucketName: string,
    filePath: string,
    key: string,
) => {
    const fileContent = fs.readFileSync(filePath);
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: 'text/html',
    };

    try {
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log(`Successfully uploaded ${key} to ${bucketName}`);
    } catch (err) {
        console.error('Error uploading file:', err);
    }
};

const uploadDirectory = async (bucketName: string, directoryPath: string) => {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const key = file;

        if (fs.lstatSync(filePath).isDirectory()) {
            await uploadDirectory(bucketName, filePath);
        } else {
            await uploadFile(bucketName, filePath, key);
        }
    }
};

export const createBucket = async (bucketName: string) => {
    try {
        await s3Client.send(
            new CreateBucketCommand({
                Bucket: bucketName,
            }),
        );
        const endpoint = `${s3Client.config.endpoint}/${bucketName}`;
        console.log(`Successfully created bucket ${bucketName}`);
        return endpoint;
    } catch (err) {
        console.error('Error creating bucket:', err);
    }
};

export default {
    uploadDirectory,
    createBucket,
    uploadFile,
};
