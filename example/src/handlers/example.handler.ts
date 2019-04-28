import {Handler, Intent} from 'jovo-plugin-class-handler';
import {Jovo} from 'jovo-core';

@Handler({state: 'example'})
export default class ExampleHandler {

    @Intent({name: 'TestIntent'})
    someMethodName(jovo: Jovo) {
        jovo.tell('Hello this is the example state.');
    }

}
