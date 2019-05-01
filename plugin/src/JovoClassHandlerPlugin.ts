import {BaseApp, Handler as JovoHandler, Plugin, PluginConfig} from 'jovo-core';
import {HandlerHelper} from './helpers/HandlerHelper';
import {JovoClassHandlerException} from './JovoClassHandlerException';

export type Constructor<T = any> = new () => T;
export type HandlerReference = string | Constructor;

export interface JovoClassHandlerConfig extends PluginConfig {
    handlers: HandlerReference[];
}

export class JovoClassHandlerPlugin implements Plugin {

    public config: JovoClassHandlerConfig = {
        handlers: [],
    };

    public install(app: BaseApp): void {
        HandlerHelper.loadHandlers(...this.config.handlers).then((handlers: JovoHandler[]) => {
            app.setHandler(...handlers);
        }).catch((e: Error | JovoClassHandlerException) => {
            if (e instanceof JovoClassHandlerException) {
                throw (e);
            } else {
                throw new JovoClassHandlerException(e);
            }
        });
    }
}
