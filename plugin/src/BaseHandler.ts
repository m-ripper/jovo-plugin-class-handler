import { AudioData, Jovo, SpeechBuilder } from 'jovo-core';

/**
 * BaseHandler, this is just used to provide access to method/properties of the Jovo object via `this`.
 * All method implementations are simply there to satisfy the inheritance. The correct values are injected during the execution of the @Intent-method.
 */
export class BaseHandler extends Jovo {
  isNewSession(): boolean {
    return false;
  }

  hasAudioInterface(): boolean {
    return false;
  }

  hasScreenInterface(): boolean {
    return false;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  getSpeechBuilder(): SpeechBuilder | undefined {
    return;
  }

  speechBuilder(): SpeechBuilder | undefined {
    return;
  }

  getDeviceId(): string | undefined {
    return;
  }

  getRawText(): string | undefined {
    return;
  }

  getTimestamp(): string | undefined {
    return;
  }

  getLocale(): string | undefined {
    return;
  }

  getType(): string | undefined {
    return;
  }

  getPlatformType(): string {
    return '';
  }

  getSelectedElementId(): string | undefined {
    return;
  }

  getAudioData(): AudioData | undefined {
    return undefined;
  }
}
