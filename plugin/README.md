Allows defining classes which serve as handlers via decorators.
> Example handler: `root.handler.ts`
```typescript
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
}
```

# Requirements
* `typescript` v3.0 or newer
* `jovo/jovo-framework` v2.0 or newer

# Installation
```sh
$ npm install jovo-plugin-class-handler --save
```

Make sure that `experimentalDecorators` and `emitDecoratorMetadata` are set to `true` in the `tsconfig.json`

In your `app.ts`:
```typescript
import {JovoClassHandlerPlugin} from 'jovo-plugin-class-handler';

const app = new App();

app.use(
    // ...
    new JovoClassHandlerPlugin(),
);
```

# Configuration
You need a configuration in order for the plugin to detect all handlers. 

### Example
> This configuration assumes that all handlers follow the pattern: (name).handler.(ts or js).

In your `config.ts`:
```typescript
const config = {
    // ...
    plugin: {
        JovoClassHandlerPlugin: {
            handlers: [
                __dirname + '/**/*.handler.{ts,js}',
            ],
        },
    },
    // ...
}
```

`handlers` can be a string like in the example above (regex is supported), but also a direct import:
```typescript
import RootHandler from './handlers/root.handler';

const config = {
    // ...
    plugin: {
        JovoClassHandlerPlugin: {
            handlers: [
                RootHandler,
            ],
        },
    },
    // ...
}
```

# How To Use
After following the installation the plugin is usable.

## Defining a Handler
In order to define a handler you have to create a class and decorate it with `@Handler()`.
### `@Handler({state?: string})`

* **state**: State of the handler that is applied to all it's intents. 
If none is supplied, the handler will be in the root-state.

#### Nested States
Nested states can be achieved by providing a path via the state parameter.
 
 *Example*: \
`@Handler({name: 'some.nested.state'})`

## Defining an Intent
In order to define intents you have to decorate methods of an `@Handler()` annotated class.

### `@Intent({name?: string})`

* **name**: Alternative name that can be used for the binding instead of the method-name. 
If none is supplied, the name will be the method's name.

## Roadmap
All things have no specific order and are just things I had in my mind:
* Parameter decorator to inject data from the `Jovo`-object. (example: `@Session(key?: string)` or `@SessionData(key?: string)`)
* Find a way to allow access to `Jovo` context in class to allow calls in vanilla handlers like `this.tell(...)`
* Find more things for the roadmap
