export class JovoClassHandlerException extends Error {
    public baseError?: Error;

    constructor(message: string | Error) {
        super('[jovo-class-handler] ' + message);
        if (typeof message !== 'string') {
            this.baseError = message;
        }
    }
}
