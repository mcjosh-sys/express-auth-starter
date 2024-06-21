import { db } from '@/config/db';
import utils from '@/lib/utils';
import { Router } from 'express';
import passport from 'passport';

/**
 * -------------- POST ROUTES ----------------
 */

// TODO

const router = Router();
router.post(
    '/login',
    async (req, res, next) => {
        const { email, password } = req.body
        const user = await db.user.findUnique({ where: { email } })
        
        if (!user)
            return res.status(403).json({ msg: 'could not find user' })
        
        const isPasswordValid = utils.validPassword(password, user.hash, user.salt)

        if (isPasswordValid) {
            req.session.regenerate((err) => {
                if (err)
                    return next(err)
            })
            const tokenObject = utils.issueJWT(user, req.sessionID)

            res.status(200).json({ success: true, token: tokenObject.token, expiresAt: tokenObject.expiresAt })
        } else {
                res.status(401).json({ success: false, msg: "invalid password" });
            }
    }
);

// TODO
router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;
    const { salt, hash } = utils.genPassword(password);
    try {
        const usernameExists = !!(await db.user.findUnique({ where: { username } }));
        const emailExists = !!(await db.user.findUnique({ where: { email } }));
        if (usernameExists)
            return res.status(409).json({ msg: 'username already exists' });
        if (emailExists)
            return res.status(409).json({ msg: 'email already exists' });

        await db.user.create({
            data: {
                username,
                email,
                salt,
                hash
            }
        });
        res.status(201).send('user created successfully');
    } catch (error: any) {
        res.sendStatus(500);
    }
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.status(200).render('pages/index', { title: 'Home', user: null });
});

router.get('/req',utils.generateNewSession, (req, res, next) => {
    console.log(req.session.id)
    res.status(200).send('ok')
});
// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
    const form =
        '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.status(200).render('pages/login', { title: 'Sign In', user: null });
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {
    const form =
        '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.status(200).render('pages/register', { title: 'Sign Up', user: null });
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', passport.authenticate('jwt',{session:false}), (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/protected-route');
    });
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

export default router;
