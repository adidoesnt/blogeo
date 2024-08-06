import path from 'path';
import fs from 'fs';
import { createBucket } from 'components/bucket/bucket';
import { execSync } from 'child_process';
import { bucketClient } from 'components/bucket';
import {type User } from 'components/database/schema';

const templateRepoPath = path.join(
    process.cwd(),
    './src/components/blog/template-repo',
);

const writeEnvFile = (username: string, serverUrl: string) => {
    const envContent = `VITE_USERNAME=${username}\nVITE_SERVER_URL=${serverUrl}`;
    const envFilePath = path.join(templateRepoPath, '.env');
    fs.writeFileSync(envFilePath, envContent);
    console.log('.env file written successfully.');
};

const deleteEnvFile = () => {
    const envFilePath = path.join(templateRepoPath, '.env');
    fs.unlinkSync(envFilePath);
    console.log('.env file deleted successfully.');
};

const buildTemplateRepo = () => {
    execSync('bun install', { cwd: templateRepoPath, stdio: 'inherit' });
    execSync('bun run build', { cwd: templateRepoPath, stdio: 'inherit' });
    console.log('Template repo built successfully.');
};

async function main(user: User, serverUrl: string) {
    try {
        const { username } = user;
        writeEnvFile(username, serverUrl);
        const bucketName = `${username}-bucket`;
        await createBucket(bucketName);
        buildTemplateRepo();
        const buildDirectoryPath = path.join(templateRepoPath, 'dist');
        await bucketClient.uploadDirectory(bucketName, buildDirectoryPath);
        deleteEnvFile();
    } catch (error) {
        console.error('Error deploying blog:', error);
    }
}

export default main;
