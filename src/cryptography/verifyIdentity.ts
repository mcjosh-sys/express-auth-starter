import crypto from 'crypto';
import fs from 'fs';
import * as decrypt from './decrypt';
import { packagedData as receivedData } from './signMessage';

const publicKey = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');

const hash = crypto.createHash(receivedData.algorithm);

const decryptedMessage = decrypt.decryptWithPublicKey(publicKey, receivedData.signedAndEncryptedData).toString();

hash.update(JSON.stringify(receivedData.originalData));

const hashOfOriginalHex = hash.digest('hex');

if (hashOfOriginalHex === decryptedMessage) console.log('Successs! The data has not been tempered with and the sender is valid.');
else console.log('Oppsie! Someone is trying to manipulate the data ');
