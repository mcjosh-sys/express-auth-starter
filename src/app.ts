import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import exoressLayouts from 'express-ejs-layouts';
import connectPgSimple from 'connect-pg-simple';
//@ts-ignore
import device from 'express-device';
import routes from '@/routes';
import { pool } from './config/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '..');

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const app = express();

app.use(exoressLayouts);
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('combined', { stream: logStream }));
app.use(device.capture());
const pgSession = connectPgSimple(session);
app.use(
    session({
        store: new pgSession({
            pool,
            tableName: 'Sessions',
            createTableIfMissing: true
        }),
        secret: process.env.COOKIE_SECRET || 'some',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
            signed: true
        } // 1 day
        // Insert express-session options here
    })
);

import '@/config/passport';

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
const port = Number(process.env.PORT) || 8880;
app.listen(port, '0.0.0.0', () => console.log(`server is running on port ${port}...`));
