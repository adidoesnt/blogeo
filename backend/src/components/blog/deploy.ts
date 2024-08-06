import path from 'path';
import fs from 'fs';
import { createBucket } from 'components/bucket/bucket';
import { execSync } from 'child_process';
import { bucketClient } from 'components/bucket';
import { userRepository } from 'components/repository';
import { BlogStatus, type User } from 'components/database/schema';

const { SERVER_URL = 'DUMMY_SERVER_URL' } = process.env;

const templateRepoPath = path.join(
    process.cwd(),
    './src/components/blog/template-repo',
);

const writeEnvFile = (username: string) => {
    const envContent = `VITE_USERNAME=${username}\nVITE_SERVER_URL=${SERVER_URL}`;
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
    try {
        execSync('bun install', { cwd: templateRepoPath, stdio: 'inherit' });
        execSync('bun run build', { cwd: templateRepoPath, stdio: 'inherit' });
        console.log('Template repo built successfully.');
    } catch (error) {
        console.error('Error building template repo:', error);
    }
};

async function main(user: User) {
    const { id: userId, username } = user;
    try {
        writeEnvFile(username);
        createBucket(`${username}-bucket`);
        buildTemplateRepo();
        const buildDirectoryPath = path.join(templateRepoPath, 'dist');
        await bucketClient.uploadDirectory(username, buildDirectoryPath);
        await userRepository.updateUser(userId, {
            blogStatus: BlogStatus.DEPLOYED,
        });
        deleteEnvFile();
    } catch (error) {
        console.error('Error deploying blog:', error);
        await userRepository.updateUser(userId, {
            blogStatus: BlogStatus.FAILED,
        });
    }
}

export default main;
