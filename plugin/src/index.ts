import 'reflect-metadata';
import 'jovo-framework/dist/src/index';

declare module 'jovo-core' {
    interface Jovo {
        [index: string]: any;
    }
}

export {JovoClassHandlerPlugin, JovoClassHandlerConfig, HandlerReference} from './JovoClassHandlerPlugin';
export {JovoClassHandlerException} from './JovoClassHandlerException';

export {BaseHandler} from './BaseHandler';

/* region Decorators */
export {Handler, HandlerOptions, HandlerMetaData, HandlerMetaDataKey} from './decorators/Handler';
export {Intent, IntentOptions, IntentMetaData} from './decorators/Intent';
export * from './decorators/DataDecorators';
/* endregion */
