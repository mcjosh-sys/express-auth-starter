import passport from 'passport';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { db } from '@/config/db';
import JwtStrategy from './jwt-strategy';

passport.use(JwtStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId: string, done) => {
    db.user
        .findUnique({ where: { id: userId } })
        .then((user) => {
            done(null, user);
        })
        .catch((err: PrismaClientKnownRequestError) => {
            done(err);
        });
});
