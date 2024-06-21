import crypto from 'crypto';

export function encryptWithPublicKey(publicKey: string, message: string) {
    const bufferMessage = Buffer.from(message, 'utf8');

    return crypto.publicEncrypt(publicKey, bufferMessage);
}
export function encryptWithPrivateKey(privateKey: string, message: string) {
    const bufferMessage = Buffer.from(message, 'utf8');

    return crypto.privateEncrypt(privateKey, bufferMessage);
}
