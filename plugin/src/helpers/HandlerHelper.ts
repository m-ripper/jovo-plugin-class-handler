import {Constructor, HandlerReference} from '../JovoClassHandlerPlugin';
import {JovoClassHandlerException} from '../JovoClassHandlerException';
import * as glob from 'glob-promise';
import {Handler as JovoHandler, Jovo} from 'jovo-core';
import {DataParamMetaData, HandlerMetaData, HandlerMetaDataKey} from '..';
import _set = require('lodash.set');
import _get = require('lodash.get');


export class HandlerHelper {

    private static processedConstructors: Constructor[] = [];

    /**
     * Returns all handlers that are detected through the given references.
     * @param references
     */
    public static async loadHandlers(...references: HandlerReference[]): Promise<JovoHandler[]> {
        const handlers: JovoHandler[] = [];

        if (references.length === 0) {
            throw new JovoClassHandlerException('No references are given in the config-file. That means no handlers can be loaded.');
        }

        this.processedConstructors = [];
        for (const ref of references) {
            await this.processReference(handlers, ref);
        }

        return handlers;
    }

    private static async processReference(handlers: JovoHandler[], reference: HandlerReference) {
        if (typeof reference === 'string') {
            // Assume it's a path
            try {
                const matches = await glob(reference);
                for (const match of matches) {
                    const importedMatch = await import(match);
                    if (importedMatch) {
                        for (const potentialHandler in importedMatch) {
                            if (importedMatch.hasOwnProperty(potentialHandler) && typeof importedMatch[potentialHandler] === 'function') {
                                await this.processPotentialHandler(handlers, importedMatch[potentialHandler]);
                            }
                        }
                    }
                }
            } catch (e) {
                throw new JovoClassHandlerException(e);
            }
        } else if (typeof reference === 'function') {
            // Assume it's a function-ref
            await this.processPotentialHandler(handlers, reference);
        }
    }

    private static async processPotentialHandler(handlers: JovoHandler[], constructor: Constructor) {
        const metaData: HandlerMetaData | undefined = Reflect.getMetadata(HandlerMetaDataKey, constructor);
        const exists = this.processedConstructors.some((ctr: Constructor) => {
            return ctr === constructor;
        });
        if (metaData && metaData.intents.length > 0 && !exists) {
            const instance = new constructor();
            const handler: JovoHandler = {};

            for (const intent of metaData.intents) {
                if (typeof instance[intent.key] === 'function') {

                    const func = instance[intent.key];
                    const newFunc = (method: (...args: any[]) => any, dataParams: DataParamMetaData[], jovo: Jovo) => {
                        const injectParams: any[] = [];
                        dataParams.sort((a: DataParamMetaData, b: DataParamMetaData) => {
                            return a.index - b.index;
                        }).forEach((dataParam: DataParamMetaData) => {
                            const path = dataParam.accessor ? `${dataParam.type}.${dataParam.accessor}` : dataParam.type;
                            injectParams.push(_get(jovo, path));
                        });
                        return method.apply(instance, [jovo].concat(injectParams));
                    };
                    if (metaData.state.length === 0) {
                        handler[intent.name] = newFunc.bind(instance, func, intent.dataParameters);
                    } else {
                        _set(handler, `${metaData.state}.${intent.name}`, newFunc.bind(instance, func, intent.dataParameters));
                    }
                }
            }
            this.processedConstructors.push(constructor);
            handlers.push(handler);
        }
    }
}
