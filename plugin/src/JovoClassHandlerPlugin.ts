import {BaseApp, Handler as JovoHandler, Plugin, PluginConfig} from 'jovo-core';
import {HandlerHelper} from './helpers/HandlerHelper';
import {JovoClassHandlerException} from './JovoClassHandlerException';

export type HandlerReference = string | Function;

export interface JovoClassHandlerConfig extends PluginConfig {
    handlers: HandlerReference[];
}

export class JovoClassHandlerPlugin implements Plugin {

    public config: JovoClassHandlerConfig = {
        handlers: [],
    };

    install(app: BaseApp): void {
        // get all handlers that are decorated with @Handler
        HandlerHelper.loadHandlers(app, this.config.handlers).then((handlers: JovoHandler[]) => {
            app.setHandler(...handlers);
        }).catch((e: Error | JovoClassHandlerException) => {
            if (e instanceof JovoClassHandlerException) {
                throw (e);
            } else {
                throw new JovoClassHandlerException(e);
            }
        });
    }

    uninstall(app?: BaseApp): void {
    }

}
