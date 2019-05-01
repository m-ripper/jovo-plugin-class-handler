import {HandlerMetaData, HandlerMetaDataKey} from './Handler';
import {DataParamMetaData, DataParamMetaDataKey} from './DataDecorators';

export interface IntentOptions {
    name?: string;
}

export interface IntentMetaData {
    key: string | symbol;
    name: string;
    dataParameters: DataParamMetaData[];
}

export function Intent(options?: IntentOptions | string): MethodDecorator {
    if (!options) {
        options = {
            name: '',
        };
    } else if (typeof options === 'string') {
        options = {
            name: options,
        };
    }

    const $options: IntentOptions = options as IntentOptions;
    return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const name = $options && $options.name ? $options.name : propertyKey.toString();

        const dataParams: DataParamMetaData[] = Reflect.getMetadata(DataParamMetaDataKey, target, propertyKey) || [];

        const metaData: HandlerMetaData = Reflect.getMetadata(HandlerMetaDataKey, target.constructor) || {
            state: '',
            intents: [],
        };

        metaData.intents.push({key: propertyKey, name, dataParameters: dataParams});
        Reflect.defineMetadata(HandlerMetaDataKey, metaData, target.constructor);
    };
}
