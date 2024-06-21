import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import type { User } from '@prisma/client';
import type { NextFunction, Response, Request } from 'express';

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password: string, hash: string, salt: string) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password: string) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user: User, sid: string) {
    const id = user.id;

    const expiresIn = '1d';
    const expiresAt = new Date()

    const payload = {
        sub: id,
        sid,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

    expiresAt.setDate(expiresAt.getDate()+1)

    return {
        token: signedToken,
        expiresAt: expiresAt.getTime()
    };
}

const generateNewSession = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.sessionID)
    req.session.regenerate((err) => {
        if (err)
            res.sendStatus(500)
     next()
    })
        req.session.destroy((err) => {
                if (err)
                    res.sendStatus(500)
            })
}

export default {
    validPassword,
    genPassword,
    issueJWT,
    generateNewSession
};
