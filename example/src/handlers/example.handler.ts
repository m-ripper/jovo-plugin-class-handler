import {Data, Handler, Intent} from 'jovo-plugin-class-handler';
import {Jovo} from 'jovo-core';

@Handler({state: 'example'})
export default class ExampleHandler {

    @Intent({name: 'TestIntent'})
    someMethodName(jovo: Jovo, @Data('example') example: string) {
        jovo.tell(example || 'no request-data passed.');
    }

}
