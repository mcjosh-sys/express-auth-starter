import jwt from 'jsonwebtoken';
import fs from 'fs';

const priv_key = fs.readFileSync(__dirname + '/priv_key.pem', 'utf8');
const pub_key = fs.readFileSync(__dirname + '/pub_key.pem', 'utf8');

const header = {
    alg: 'RS256',
    typ: 'JWT'
};

const payload = {
    sub: '1234567890',
    name: 'John Doe',
    admin: true
};

const signedJwt = jwt.sign(payload, priv_key, { algorithm: 'RS256', expiresIn: 30 });

console.log({ signedJwt });

jwt.verify(signedJwt, pub_key, { algorithms: ['RS256'] }, (err, payload) => {
    console.log({ err });
    console.log({ payload });
});
