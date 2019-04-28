import {IntentMetaData} from './Intent';

export interface HandlerOptions {
    state?: string;
}

export const HandlerMetaDataKey = 'handlerMetaData';

export interface HandlerMetaData {
    state: string;
    intents: IntentMetaData[];
}

function HandlerDecoratorFactory(options?: HandlerOptions) {
    return function <TFunction extends Function>(constructor: TFunction): TFunction | void {
        const state = options && options.state ? options.state : '';
        const metaData: HandlerMetaData = Reflect.getMetadata(HandlerMetaDataKey, constructor) || {
            state,
            intents: [],
        };
        metaData.state = state;
        Reflect.defineMetadata(HandlerMetaDataKey, metaData, constructor);
    };
}

export function Handler(options?: HandlerOptions): ClassDecorator {
    if (!options) {
        options = {};
    }
    return HandlerDecoratorFactory(options);
}
