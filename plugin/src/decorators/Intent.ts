import {HandlerMetaData, HandlerMetaDataKey} from './Handler';

export interface IntentOptions {
    name?: string;
}

export interface IntentMetaData {
    key: string;
    name: string;
}

export function Intent(options?: IntentOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const name = options && options.name ? options.name : propertyKey;
        const metaData: HandlerMetaData = Reflect.getMetadata(HandlerMetaDataKey, target.constructor) || {
            state: '',
            intents: [],
        };
        metaData.intents.push({key: propertyKey, name});
        Reflect.defineMetadata(HandlerMetaDataKey, metaData, target.constructor);
    };
}
