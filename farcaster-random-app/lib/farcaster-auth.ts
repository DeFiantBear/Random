import { NobleEd25519Signer } from "@farcaster/hub-nodejs";

export interface FarcasterAuthConfig {
  fid: number;
  privateKey: string;
  publicKey: string;
}

export async function createFarcasterAuthToken(config: FarcasterAuthConfig): Promise<string> {
  const { fid, privateKey, publicKey } = config;
  
  const signer = new NobleEd25519Signer(new Uint8Array(Buffer.from(privateKey, 'hex')));
  
  const header = {
    fid,
    type: 'app_key',
    key: publicKey
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  
  const payload = { exp: Math.floor(Date.now() / 1000) + 300 }; // 5 minutes
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signatureResult = await signer.signMessageHash(Buffer.from(`${encodedHeader}.${encodedPayload}`, 'utf-8'));
  if (signatureResult.isErr()) {
    throw new Error("Failed to sign message");
  }
  
  const encodedSignature = Buffer.from(signatureResult.value).toString("base64url");
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function makeAuthenticatedFarcasterRequest(
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  config?: FarcasterAuthConfig
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (config) {
    const authToken = await createFarcasterAuthToken(config);
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  return response;
} 