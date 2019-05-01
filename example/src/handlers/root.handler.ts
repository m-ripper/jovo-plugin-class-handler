import {Handler, InputData, Intent, Session} from 'jovo-plugin-class-handler';
import {Input, Jovo} from 'jovo-core';

@Handler()
export default class RootHandler {

    @Intent()
    LAUNCH(jovo: Jovo) {
        return jovo.toIntent('HelloWorldIntent');
    }

    @Intent()
    HelloWorldIntent(jovo: Jovo) {
        jovo.$session.$data.example = 'nice to meet you!';
        jovo.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    }

    @Intent()
    MyNameIsIntent(jovo: Jovo, @InputData('name') name: Input, @Session('example') example: string) {
        jovo.tell(`Hey ${name.value}, ${example || 'no session data passed.'}`);
    }

    @Intent()
    TestIntent(jovo: Jovo) {
        jovo.$data.example = 'Hello this is the request-data example.';
        return jovo.toStateIntent('example', 'TestIntent');
    }

    @Intent()
    NestedTestIntent(jovo: Jovo) {
        return jovo.toStateIntent('some.nested.state', 'TestIntent');
    }
}
