import {Handler, Intent} from 'jovo-plugin-class-handler';
import {Jovo} from 'jovo-core';

@Handler()
export default class RootHandler {

    @Intent()
    LAUNCH(jovo: Jovo) {
        return jovo.toIntent('HelloWorldIntent');
    }

    @Intent()
    HelloWorldIntent(jovo: Jovo) {
        jovo.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    }


    @Intent()
    MyNameIsIntent(jovo: Jovo) {
        jovo.tell('Hey ' + jovo.$inputs.name.value + ', nice to meet you!');
    }

    @Intent()
    TestIntent(jovo: Jovo) {
        return jovo.toStateIntent('example', 'TestIntent');
    }

    @Intent()
    NestedTestIntent(jovo: Jovo) {
        return jovo.toStateIntent('some.nested.state', 'TestIntent');
    }
}
