import { SessionData } from 'express-session';

declare module 'express-session' {
    interface SessionData {
        cookie: Cookie;
        viewCount: number;
    }
}

export {};
