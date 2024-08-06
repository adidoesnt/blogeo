import {
    CreateBucketCommand,
    PutBucketPolicyCommand,
    PutBucketWebsiteCommand,
    PutObjectCommand,
    PutPublicAccessBlockCommand,
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

const getContentType = (filePath: string): string => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'application/javascript';
        case '.svg':
            return 'image/svg+xml';
        case '.json':
            return 'application/json';
        default:
            return 'application/octet-stream';
    }
};

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
        ContentType: getContentType(filePath),
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
        const key = path.relative(directoryPath, filePath).replace(/\\/g, '/');

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

export const setupStaticHosting = async (bucketName: string) => {
    try {
        await s3Client.send(
            new PutBucketWebsiteCommand({
                Bucket: bucketName,
                WebsiteConfiguration: {
                    IndexDocument: {
                        Suffix: 'index.html',
                    },
                    ErrorDocument: {
                        Key: 'error.html',
                    },
                },
            }),
        );
        console.log(`Successfully setup static hosting for ${bucketName}`);
    } catch (err) {
        console.error('Error setting up static hosting:', err);
    }
};

export const allowPublicAccess = async (bucketName: string) => {
    try {
        await s3Client.send(
            new PutPublicAccessBlockCommand({
                Bucket: bucketName,
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true,
                },
            }),
        );
        console.log(`Successfully allowed public access for ${bucketName}`);
    } catch (err) {
        console.error('Error allowing public access:', err);
    }
};

export const allowReadAccessViaPolicy = async (bucketName: string) => {
    try {
        await s3Client.send(
            new PutBucketPolicyCommand({
                Bucket: bucketName,
                Policy: JSON.stringify({
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Sid: 'AllowPublicRead',
                            Effect: 'Allow',
                            Principal: '*',
                            Action: 's3:GetObject',
                            Resource: `arn:aws:s3:::${bucketName}/*`,
                        },
                    ],
                }),
            }),
        );
        console.log(
            `Successfully allowed public read access for ${bucketName}`,
        );
    } catch (err) {
        console.error('Error allowing public read access:', err);
    }
};

export default {
    uploadDirectory,
    createBucket,
    uploadFile,
};
