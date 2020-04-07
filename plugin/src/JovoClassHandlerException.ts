import { ErrorCode, JovoError } from 'jovo-core';

export class JovoClassHandlerException extends JovoError {
  constructor(err: string | Error, details?: string, hint?: string, seeMore?: string) {
    super(
      typeof err === 'string' ? err : err.message,
      ErrorCode.ERR_PLUGIN,
      'JovoClassHandler',
      details,
      hint,
      seeMore,
    );
  }
}
