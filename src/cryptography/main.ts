import fs from 'fs';
import { encryptWithPublicKey } from './encrypt';
import { decryptWithPrivateKey } from './decrypt';

const publicKey = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');

const encryptedMessage = encryptWithPublicKey(publicKey, 'This is a super secret message.');

console.log(encryptedMessage.toString('hex'));

const privateKey = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');

const decryptedMessage = decryptWithPrivateKey(privateKey, encryptedMessage);

console.log(decryptedMessage.toString());
