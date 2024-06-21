import crypto from 'crypto';
import fs from 'fs';
import * as encrypt from './encrypt';

const hash = crypto.createHash('sha256');

const myData = {
    fileName: 'Zach',
    lastName: 'Gollwitzer',
    socialSecurityNumber:
        'NO NO NO. Never put persoal info in a digitally \
    signed message this form of cryptography does not hide the data!'
};

const myDataString = JSON.stringify(myData);

hash.update(myDataString);

const hashedData = hash.digest('hex');

const senderPrivateKey = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');

const signedMessage = encrypt.encryptWithPrivateKey(senderPrivateKey, hashedData);

export const packagedData = {
    algorithm: 'sha256',
    originalData: myData,
    signedAndEncryptedData: signedMessage
};
