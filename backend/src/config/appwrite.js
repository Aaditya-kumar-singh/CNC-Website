const sdk = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const bucketId = process.env.APPWRITE_BUCKET_ID;

const isPlaceholderValue = (value = '') => {
    const normalized = String(value).trim().toLowerCase();
    return (
        !normalized ||
        normalized.startsWith('your_') ||
        normalized.includes('_here') ||
        normalized.includes('placeholder')
    );
};

const missingConfig = [];

if (isPlaceholderValue(endpoint)) missingConfig.push('APPWRITE_ENDPOINT');
if (isPlaceholderValue(projectId)) missingConfig.push('APPWRITE_PROJECT_ID');
if (isPlaceholderValue(apiKey)) missingConfig.push('APPWRITE_API_KEY');
if (isPlaceholderValue(bucketId)) missingConfig.push('APPWRITE_BUCKET_ID');

const isConfigured = missingConfig.length === 0;
const configError = isConfigured
    ? null
    : `Appwrite is not configured correctly. Missing or placeholder values: ${missingConfig.join(', ')}`;

const client = new sdk.Client();

if (isConfigured) {
    client
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);
}

const storage = new sdk.Storage(client);
const tokens = new sdk.Tokens(client);

module.exports = {
    bucketId,
    configError,
    endpoint,
    ID: sdk.ID,
    InputFile,
    isConfigured,
    missingConfig,
    projectId,
    storage,
    tokens,
};
