import {BaseHandler, Data, Handler, Intent} from 'jovo-plugin-class-handler';

@Handler({state: 'example'})
export class ExampleHandler extends BaseHandler {

    @Intent({name: 'TestIntent'})
    someMethodName(@Data('example') example: string) {
        this.tell(example || 'no request-data passed.');
    }

}
