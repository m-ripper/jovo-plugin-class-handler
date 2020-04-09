import * as glob from 'glob';
import { BaseApp, Handler as JovoHandler, HandleRequest, Host, Jovo, Log, Plugin, PluginConfig } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');

import { DataParamMetaData } from './decorators/DataDecorators';
import { HandlerMetaData, HandlerMetaDataKey } from './decorators/Handler';
import { BaseHandler } from './BaseHandler';
import { JovoClassHandlerException } from './JovoClassHandlerException';

function asyncGlob(pattern: string, options?: glob.IOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, options || {}, (err, matches) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    });
  });
}

export type Constructor<T = any> = new (app: BaseApp, host: Host, handleRequest?: HandleRequest) => T;
export type HandlerReference = string | Constructor;

export interface Config extends PluginConfig {
  handlers: HandlerReference[];
}

export class JovoClassHandler implements Plugin {
  config: Config = {
    handlers: [],
  };

  #handlers: JovoHandler[] = [];
  #processedConstructors: Constructor[] = [];

  get loadedHandlers(): JovoHandler[] {
    return this.#handlers.slice();
  }

  get name() {
    return this.constructor.name;
  }

  install(app: BaseApp): void {
    app.middleware('setup')!.use(this.setup.bind(this));
  }

  async setup(handleRequest: HandleRequest) {
    try {
      await this.loadHandlers(handleRequest, this.config.handlers);
      handleRequest.app.setHandler(...this.#handlers);
    } catch (e) {
      if (e instanceof JovoClassHandlerException) {
        throw e;
      }
      throw new JovoClassHandlerException(e);
    }
  }

  private async loadHandlers(handleRequest: HandleRequest, references: HandlerReference[]): Promise<void> {
    if (references.length === 0) {
      throw new JovoClassHandlerException('No references are given in the config. No handlers could be loaded.');
    }

    this.#processedConstructors = [];
    for (let i = 0, len = references.length; i < len; i++) {
      await this.processReference(handleRequest, references[i]);
    }
  }

  private async processReference(handleRequest: HandleRequest, reference: HandlerReference): Promise<void> {
    if (typeof reference === 'string') {
      try {
        const matches = await asyncGlob(reference);
        for (let i = 0, len = matches.length; i < len; i++) {
          const importedMatch = await import(matches[i]);
          if (importedMatch) {
            for (const potentialHandler in importedMatch) {
              if (
                importedMatch.hasOwnProperty(potentialHandler) &&
                typeof importedMatch[potentialHandler] === 'function'
              ) {
                this.processPotentialHandler(handleRequest, importedMatch[potentialHandler]);
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
        throw new JovoClassHandlerException(e);
      }
    } else if (typeof reference === 'function') {
      this.processPotentialHandler(handleRequest, reference);
    } else {
      Log.info(`[${this.name}] reference of type ${typeof reference} is not supported.`);
    }
  }

  private processPotentialHandler(handleRequest: HandleRequest, constructor: Constructor) {
    const metaData: HandlerMetaData | undefined = Reflect.getMetadata(HandlerMetaDataKey, constructor);
    const instanceExists = this.#processedConstructors.some((ctr: Constructor) => {
      return ctr === constructor;
    });
    if (metaData && metaData.intents.length > 0 && !instanceExists) {
      const instance = new constructor(handleRequest.app, handleRequest.host, handleRequest);
      const handler: JovoHandler = {};

      for (let i = 0, len = metaData.intents.length; i < len; i++) {
        const { key, name, dataParameters } = metaData.intents[i];
        if (typeof instance[key] === 'function') {
          const fn = instance[key];
          const newFn = ((func: (...args: any[]) => any, dataParams: DataParamMetaData[], jovo: Jovo) => {
            const injectParams = dataParams
              .sort((a, b) => {
                return a.index - b.index;
              })
              .map((dataParam) => {
                const path = dataParam.accessor ? `${dataParam.type}.${dataParam.accessor}` : dataParam.type;
                return _get(jovo, path);
              });
            if (instance instanceof BaseHandler) {
              for (const prop in jovo) {
                if (jovo.hasOwnProperty(prop)) {
                  (instance as any)[prop] = (jovo as any)[prop];
                }
              }
              return func.apply(instance, injectParams);
            }
            return func.apply(instance, [jovo, ...injectParams]);
          }).bind(instance, fn, dataParameters);

          if (metaData.state.length === 0) {
            handler[name] = newFn;
          } else {
            _set(handler, `${metaData.state}.${name}`, newFn);
          }
        }
      }
      this.#processedConstructors.push(constructor);
      this.#handlers.push(handler);
    }
  }
}
