import 'reflect-metadata'; // tslint:disable-line

import { Config } from './JovoClassHandler';

interface AppJovoClassHandlerConfig {
  JovoClassHandler?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface ExtensiblePluginConfigs extends AppJovoClassHandlerConfig {}
}

export { JovoClassHandler, Config, HandlerReference } from './JovoClassHandler';
export { JovoClassHandlerException } from './JovoClassHandlerException';

export { BaseHandler } from './BaseHandler';

export { Handler, HandlerOptions } from './decorators/Handler';
export { Intent, IntentOptions } from './decorators/Intent';
export {
  Data,
  AppData,
  RequestData,
  InputData,
  Session,
  SessionData,
  User,
  UserData,
} from './decorators/DataDecorators';
