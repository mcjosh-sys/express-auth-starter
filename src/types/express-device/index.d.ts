declare module 'device' {
    interface Parser {
        options: {
            emptyUserAgentDeviceType: string;
        };
    }

    function Parser(): Parser;
}

declare module 'device-parser' {
    import { Parser } from 'device';
    export = Parser;
}
