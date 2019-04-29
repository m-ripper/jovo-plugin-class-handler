import {HandlerReference} from '../JovoClassHandlerPlugin';
import {JovoClassHandlerException} from '../JovoClassHandlerException';
import * as glob from 'glob-promise';
import {BaseApp, Handler as JovoHandler} from 'jovo-core';
import {HandlerMetaData, HandlerMetaDataKey} from '..';
import _set = require('lodash.set');

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
                if (metaData.state.length === 0) {
                    for (const intent of metaData.intents) {
                        if (typeof instance[intent.key] === 'function') {
                            handler[intent.name] = instance[intent.key].bind(instance);
                        }
                    }
                } else {
                    for (const intent of metaData.intents) {
                        if (typeof instance[intent.key] === 'function') {
                            _set(handler, `${metaData.state}.${intent.name}`, instance[intent.key].bind(instance));
                        }
                    }
                }
                handlers.push(handler);
            }
        }

        return handlers;
    }
}
