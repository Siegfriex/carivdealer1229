import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<string> {
  try {
    const projectId = 'carivdealer';
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    return version.payload?.data?.toString() || '';
  } catch (error) {
    console.error(`Failed to get secret ${secretName}:`, error);
    throw error;
  }
}

