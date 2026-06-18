import "dotenv/config";
import chokidar from 'chokidar';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';

const projectId = process.env.PROJECT_ID;
const bucketName = "capstone-bucket-1702";
const localDirectory = '/workspace';

const hasAwsCredentials = Boolean(
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
);

const s3Client = hasAwsCredentials ? new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}) : null;

async function checkS3ForFiles() {
    if (!s3Client) {
        console.log("AWS credentials are not configured; skipping S3 file check.");
        return [];
    }

    try {
        console.log(`Checking S3 for existing files in project: ${projectId}`);
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: `${projectId}/`
        });
        const listResponse = await s3Client.send(listCommand);
        return listResponse.Contents || [];
    } catch (error) {
        console.error("Failed to check S3 for files:", error);
        return [];
    }
}

async function downloadFilesFromS3(s3Objects) {
    if (!s3Client) {
        return;
    }

    if (!s3Objects.length) {
        return;
    }

    console.log("Found existing files in S3. Syncing to local directory...");
    for (const file of s3Objects) {
        try {
            if (!file.Key || file.Key.endsWith('/')) continue;

            const getCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: file.Key
            });
            const getResponse = await s3Client.send(getCommand);

            const relativePath = file.Key.replace(`${projectId}/`, '');
            const localFilePath = path.join(localDirectory, relativePath);
            fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

            const writeStream = fs.createWriteStream(localFilePath);
            getResponse.Body.pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log(`Downloaded ${file.Key} to ${localFilePath}`);
        } catch (error) {
            console.error(`Failed to download ${file.Key} from S3:`, error);
        }
    }
}

async function uploadFileToS3(filePath) {
    if (!s3Client) {
        console.log(`Skipping S3 upload for ${filePath} because AWS is not configured.`);
        return;
    }

    try {
        if (filePath.includes('node_modules') || filePath.includes('.env')) {
            return; // Skip syncing node_modules and .env files
        }

        const fileContent = fs.readFileSync(filePath);
        const relativePath = path.relative(localDirectory, filePath);
        const s3Key = `${projectId}/${relativePath}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: fileContent
        });

        await s3Client.send(command);
        console.log(`Successfully synced ${filePath} to s3://${bucketName}/${s3Key}`);
    } catch (error) {
        console.error(`Error syncing ${filePath} to S3:`, error);
    }
}

function startWatcher(hasFiles) {
    console.log("Starting chokidar watch...");
    chokidar.watch(localDirectory, {
        ignored: [
            /(^|[\/\\])\../, // ignore dotfiles
            /node_modules/,  // ignore node_modules completely
            /\.env/          // ignore .env files
        ],
        persistent: true,
        ignoreInitial: hasFiles
    }).on('all', async (event, filePath) => {
        if (event === 'add' || event === 'change') {
            if (filePath.includes('node_modules') || filePath.includes('.env')) {
                return;
            }
            await uploadFileToS3(filePath);
        }
    });
}

async function init() {
    try {
        const s3Objects = await checkS3ForFiles();
        const hasFiles = s3Objects.length > 0;

        if (hasFiles && s3Client) {
            await downloadFilesFromS3(s3Objects);
        } else if (!s3Client) {
            console.log("S3 is disabled. Running in local development mode.");
        } else {
            console.log("No files found in S3. Local files will be synced to S3 automatically.");
        }
    } catch (error) {
        console.error("Error during S3 initialization:", error);
    } finally {
        startWatcher(false);
    }
}

process.on('uncaughtException', (error) => {
    console.error('Unhandled exception in sync-agent:', error);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection in sync-agent:', reason);
});

init();
