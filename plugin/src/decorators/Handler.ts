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

    // tslint:disable
    return function <TFunction extends () => any>(constructor: TFunction): TFunction | void {
        // tslint:enable
        const state = options && options.state ? options.state : '';
        const metaData: HandlerMetaData = Reflect.getMetadata(HandlerMetaDataKey, constructor) || {
            state,
            intents: [],
        };
        metaData.state = state;
        Reflect.defineMetadata(HandlerMetaDataKey, metaData, constructor);
    };
}

export function Handler(options?: HandlerOptions): any {
    if (!options) {
        options = {};
    }
    return HandlerDecoratorFactory(options);
}
