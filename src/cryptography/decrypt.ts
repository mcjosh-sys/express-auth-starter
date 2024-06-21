import crypto from 'crypto';

export function decryptWithPrivateKey(privateKey: string, encryptedMessage: Buffer) {
    return crypto.privateDecrypt(privateKey, encryptedMessage);
}
export function decryptWithPublicKey(publicKey: string, encryptedMessage: Buffer) {
    return crypto.publicDecrypt(publicKey, encryptedMessage);
}
