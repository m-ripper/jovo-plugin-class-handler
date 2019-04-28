import 'jovo-framework/dist/src/index';
import {Handler as JovoHandler} from 'jovo-core';

declare module 'jovo-core/dist/src/BaseApp' {

    interface BaseAppConfig {
        handlers?: JovoHandler[];
    }
}
