import base64url from 'base64url';
import crypto from 'crypto';
import fs from 'fs';

const signatureFunction = crypto.createSign('RSA-SHA256');
const verificationFuntion = crypto.createVerify('RSA-SHA256');

/**
 * ISSUANCE
 */
const header = {
    alg: 'RS256',
    typ: 'JWT'
};

const payload = {
    sub: '1234567890',
    name: 'John Doe',
    admin: true,
    iat: 1516239022
};

const headerString = JSON.stringify(header);
const payloadString = JSON.stringify(payload);

const base64urlHeader = base64url(headerString);
const base64urlPayload = base64url(payloadString);

signatureFunction.write(base64urlHeader + '.' + base64urlPayload);
signatureFunction.end();

const priv_key = fs.readFileSync(__dirname + '/priv_key.pem', 'utf8');
const signatureBase64 = signatureFunction.sign(priv_key, 'base64');

const signatureBase64Url = base64url.fromBase64(signatureBase64);

console.log({ signatureBase64Url });

// END ISSUANCE

/**
 * VERIFICATION
 */

const jwt =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ';

const jwtParts = jwt.split('.');

const headerInBase64Url = jwtParts[0];
const payloadInBase64Url = jwtParts[1];
const signatureInBase64Url = jwtParts[2];

verificationFuntion.write(headerInBase64Url + '.' + payloadInBase64Url);
verificationFuntion.end();

const jwtSignatureBase64 = base64url.toBase64(signatureInBase64Url);

const pub_key = fs.readFileSync(__dirname + '/pub_key.pem', 'utf8');

const signatureIsValid = verificationFuntion.verify(pub_key, jwtSignatureBase64, 'base64');

console.log(signatureIsValid);
