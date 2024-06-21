import fs from 'fs';
import path from 'path';
import jwtPassport from 'passport-jwt';
import { db } from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const pathToKey = path.join(__dirname, '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const JwtStrategy = jwtPassport.Strategy;
const ExtractJwt = jwtPassport.ExtractJwt;
// TODO
const options: jwtPassport.StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new JwtStrategy(options, function (payload, done) {
    db.user
        .findFirst({ where: { id: payload.sub } })
        .then((user) => {
            if (user) return done(null, user);
            else return done(null, false);
        })
        .catch((err: PrismaClientKnownRequestError) => done(err, null));
});

export default strategy;

// const passportJWTOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: PUB_KEY || 'secret phrase',
//     issuer: 'enter issuer here',
//     audience: 'enter audience here',
//     algorithms: ['RS256'],
//     ignoreExpiration: false,
//     passReqToCallback: false,
//     jsonWebTokenOptions: {
//         complete: false,
//         clcokTolerance: '',
//         maxAge: '2d',
//         clockTimestamp: '100',
//         nonce: 'string here for OpenID'
//     }
// }
