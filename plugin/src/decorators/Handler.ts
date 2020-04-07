import { IntentMetaData } from './Intent';

export interface HandlerOptions {
  state?: string;
}

export const HandlerMetaDataKey = 'handlerMetaData';

export interface HandlerMetaData {
  state: string;
  intents: IntentMetaData[];
}

export function Handler(options?: HandlerOptions | string): ClassDecorator {
  if (!options) {
    options = {
      state: '',
    };
  } else if (typeof options === 'string') {
    options = {
      state: options,
    };
  }

  const $options: HandlerOptions = options as HandlerOptions;
  return (constructor) => {
    const state = $options && $options.state ? $options.state : '';
    const metaData: HandlerMetaData = Reflect.getMetadata(HandlerMetaDataKey, constructor) || {
      state,
      intents: [],
    };
    metaData.state = state;
    Reflect.defineMetadata(HandlerMetaDataKey, metaData, constructor);
  };
}
