import {Jovo, SpeechBuilder} from 'jovo-core';

/**
 * BaseHandler, this is just used to provide access to method/properties of the Jovo object via `this`.
 * All method implementations are simply there to satisfy the inheritance. The correct values are injected during the plugin-installation.
 */
export class BaseHandler extends Jovo {
    public isNewSession(): boolean {
        return false;
    }

    public hasAudioInterface(): boolean {
        return false;
    }

    public hasScreenInterface(): boolean {
        return false;
    }

    public hasVideoInterface(): boolean {
        return false;
    }

    public getSpeechBuilder(): SpeechBuilder | undefined {
        return;
    }

    public speechBuilder(): SpeechBuilder | undefined {
        return;
    }

    public getDeviceId(): string | undefined {
        return;
    }

    public getRawText(): string | undefined {
        return;
    }

    public getTimestamp(): string | undefined {
        return;
    }

    public getLocale(): string | undefined {
        return;
    }

    public getType(): string | undefined {
        return;
    }

    public getPlatformType(): string {
        return '';
    }

    public getSelectedElementId(): string | undefined {
        return;
    }

}
