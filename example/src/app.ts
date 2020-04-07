import {FileDb} from 'jovo-db-filedb';
import {App} from 'jovo-framework';
import {Alexa} from 'jovo-platform-alexa';
import {GoogleAssistant} from 'jovo-platform-googleassistant';
import {JovoClassHandler} from 'jovo-plugin-class-handler';
import {JovoDebugger} from 'jovo-plugin-debugger';


// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
    new JovoClassHandler(),
);

export {app};
