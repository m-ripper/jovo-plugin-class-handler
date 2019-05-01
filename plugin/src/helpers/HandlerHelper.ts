import {HandlerReference} from '../JovoClassHandlerPlugin';
import {JovoClassHandlerException} from '../JovoClassHandlerException';
import * as glob from 'glob-promise';
import {BaseApp, Handler as JovoHandler, Jovo} from 'jovo-core';
import {DataParamMetaData, HandlerMetaData, HandlerMetaDataKey} from '..';
import _set = require('lodash.set');
import _get = require('lodash.get');

export class HandlerHelper {

    public static async loadHandlers(app: BaseApp, references: HandlerReference[]): Promise<JovoHandler[]> {
        const handlers: JovoHandler[] = [];

        if (references.length === 0) {
            throw new JovoClassHandlerException('No references are given in the config-file. That means no handlers can be loaded.');
        }

        // for each reference check if it is a valid constructor and add it to constructors
        const constructors: any[] = [];
        for (const ref of references) {
            if (typeof ref === 'string') {
                // Assume it's a path
                try {
                    const matches = await glob(ref);
                    for (const match of matches) {
                        const importedMatch = await import(match);
                        if (importedMatch && importedMatch.default) {
                            if (!constructors.some((ctr: any) => {
                                return ctr === importedMatch.default;
                            })) {
                                constructors.push(importedMatch.default);
                            }
                        }
                    }
                } catch (e) {
                    throw new JovoClassHandlerException(e);
                }
            } else {
                // Assume it's a function-ref
                if (!constructors.some((ctr: any) => {
                    return ctr === ref;
                })) {
                    constructors.push(ref);
                }
            }
        }

        // for each constructor get the metadata and transform it to a handler if possible and add it to handlers
        for (const ctor of constructors) {
            const instance = new ctor();
            const handler: JovoHandler = {};
            const metaData: HandlerMetaData | undefined = Reflect.getMetadata(HandlerMetaDataKey, ctor);
            if (metaData) {
                for (const intent of metaData.intents) {
                    if (typeof instance[intent.key] === 'function') {

                        const func = instance[intent.key];
                        const newFunc = (method: any, dataParams: DataParamMetaData[], jovo: Jovo) => {
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
                handlers.push(handler);
            }
        }

        return handlers;
    }
}
