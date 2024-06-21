import crypto from 'crypto';
import fs from 'fs';

function genKeyPair() {
    // Generates object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, //bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', //Public key cryptography standards 1
            format: 'pem' //Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey);
    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
}

genKeyPair();
