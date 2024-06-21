import { Session, Store, type SessionData } from 'express-session';
import { db } from './db';

export class PrismaSessionStore extends Store {
    createSession(req: Express.Request, session: SessionData): Session & SessionData{
        
    }
    async get(sid: string, callback: (err: any, session?: SessionData | null | undefined) => void) {
        try {
            const session = await db.session.findUnique({ where: { sid } });
            console.log(session)
            if (!session) callback(null, null);
            callback(null, JSON.parse(session?.data as string) as unknown as SessionData);
        } catch (error) {}
    }

    async set(sid: string, session: SessionData, callback: (err?: any) => void) {
        try {
            await db.session.upsert({
                where: { sid },
                update: { data: JSON.stringify(session) },
                create: { sid, data: JSON.stringify(session), expire: session.cookie.expires as Date }
            });
            callback();
        } catch (error) {
            callback(error);
        }
    }

    async destroy(sid: string, callback: (err?: any) => void) {
        try {
            await db.session.delete({ where: { sid } });
            callback();
        } catch (error) {
            callback(error);
        }
    }
}
