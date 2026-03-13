import { Client, Account, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const projectName = import.meta.env.VITE_APPWRITE_PROJECT_NAME;

const client = new Client();

if (endpoint && projectId) {
    client.setEndpoint(endpoint).setProject(projectId);
}

const account = new Account(client);
const storage = new Storage(client);

export {
    account,
    client,
    projectId,
    projectName,
    endpoint,
    storage,
};
