# jogo-plugin-class-handler
Allows defining classes which serve as handlers via decorators.

## Example:
> Handler: `root.handler.ts`
```typescript
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
}
```

## Table of Contents
  * [Example:](#example-)
  * [Getting Started](#getting-started)
    + [Prerequisites](#prerequisites)
    + [Installation](#installation)
    + [Configuration](#configuration)
      - [Example](#example)
  * [Usage](#usage)
    + [Handler](#handler)
    + [Intent](#intent)
    + [Data-Decorators](#data-decorators)
  * [API](#api)
    + [`@Handler(options?: HandlerOptions | string)`](#--handler-options---handleroptions---string--)
      - [Parameter `options`](#parameter--options-)
    + [`@Intent(options?: IntentOptions | string)`](#--intent-options---intentoptions---string--)
      - [Parameter `options`](#parameter--options--1)
    + [Data Decorators](#data-decorators)
      - [`@Data(key?: string)` / `@RequestData(key?: string)`](#--data-key---string-------requestdata-key---string--)
      - [`@Session(key?: string)` / `@SessionData(key?: string)`](#--session-key---string-------sessiondata-key---string--)
      - [`@User(key?: string)` / `@UserData(key?: string)`](#--user-key---string-------userdata-key---string--)
      - [`@AppData(key?: string)`](#--appdata-key---string--)
      - [`@InputData(key?: string)`](#--inputdata-key---string--)
  * [Roadmap](#roadmap)


## Getting Started
These instructions will get you the plugin installed and ready to be used.
 
### Prerequisites
* `typescript` v3.0 or newer
* `jovo/jovo-framework` v2.0 or newer

### Installation
```sh
$ npm install jovo-plugin-class-handler --save
```

> Make sure that `experimentalDecorators` and `emitDecoratorMetadata` are set to `true` in the `tsconfig.json`

In your `app.ts`:
```typescript
import {JovoClassHandlerPlugin} from 'jovo-plugin-class-handler';

const app = new App();

app.use(
    // ...
    new JovoClassHandlerPlugin(),
);
```
### Configuration
You need to setup a configuration for the plugin in the `config.ts` in order for the plugin to detect all handlers. 

#### Example
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

Parts of `handlers` can be a string like in the example above (regex is supported), but also a direct import:
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

## Usage
After following the installation the plugin is usable. \
You can find a working example in the github-repository in the `example` folder.

### Handler
To get started, create a new Typescript file and export a class and annotate it with `@Handler`. \
The class could look like this:
> The class has to be export as `default`!
```typescript
import {Handler} from 'jovo-plugin-class-handler';

@Handler()
export default class RootHandler {
}
```
Additionally you can set the state of the handler:
```typescript
import {Handler} from 'jovo-plugin-class-handler';

@Handler('example')
export default class ExampleHandler {
}
```
For more information look at the [API here](#api-handler)

### Intent
After you have defined a handler you can define the intents. For that you have to annotate it with `@Intent`. \
Here is an example:

```typescript
import {Handler, Intent} from 'jovo-plugin-class-handler';
import {Jovo} from 'jovo-core';

@Handler()
export default class RootHandler {

    @Intent()
    LAUNCH(jovo: Jovo) {
        return jovo.toIntent('HelloWorldIntent');
    }

    @Intent('HelloWorldIntent')
    differentName(jovo: Jovo) {
        jovo.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    }

    @Intent({name: 'MyNameIsIntent'})
    anotherDifferentName(jovo: Jovo, ) {
        jovo.tell(`Hey ... ${jovo.$inputs.name.value}`);
    }
}
```
For more information look at the [API here](#api-intent)

### Data-Decorators
You can decorate `@Intent`-annotated methods with parameter decorators that bind data of the `Jovo`-object to the corresponding parameter.

Decorator | Binds ...
--- | ---
`@Data(key?: string)` / `@RequestData(key?: string)` | `$data` / `$data.{key}`
`@Session(key?: string)` / `@SessionData(key?: string)` | `$session.$data` / `$session.$data.{key}`
`@User(key?: string)` / `@UserData(key?: string)` | `$user.$data` / `$user.$data.{key}`
`@AppData(key?: string)` | `$app.$data` / `$app.$data.{key}`
`@InputData(key?: string)` | `$inputs` / `$inputs.{key}`

Example:
```typescript
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
}
```

<a name="api"></a>
## API
<a name="api-handler"></a>
### `@Handler(options?: HandlerOptions | string)`
> `HandlerOptions`: `{state?: string}`

#### Parameter `options`
* if no `options`: The handler's state will be stateless.

* if `options` of type `string`: The handler's state will be set to `options`.
* if `options` of type `HandlerOptions` and `state`: The handler's state will be set to `options.state`.
* if `options` of type `HandlerOptions` and no `state`: The handler will be stateless

---

<a name="api-intent"></a>
 ### `@Intent(options?: IntentOptions | string)`
 > `IntentOptions`: `{name?: string}`
 
 #### Parameter `options`
* if no `options`: The intent's name will be the annotated method's name.

* if `options` of type `string`: The intent's name will be set to `options`.
* if `options` of type `HandlerOptions` and `state`: The intent's name will be set to `options.name`.
* if `options` of type `HandlerOptions` and no `state`: The intent's name will be the method's name

---

<a name="api-data-decorators"></a>
### Data Decorators

#### `@Data(key?: string)` / `@RequestData(key?: string)`
Binds `$data` or `$data.{key}` if key is given.

#### `@Session(key?: string)` / `@SessionData(key?: string)`
Binds `$session.$data` or `$session.$data.{key}` if key is given.

#### `@User(key?: string)` / `@UserData(key?: string)`
Binds `$user.$data` or `$user.$data.{key}` if key is given.

#### `@AppData(key?: string)`
Binds `$app.$data` or `$app.$data.{key}` if key is given.

#### `@InputData(key?: string)`
Binds `$inputs` or `$inputs.{key}` if key is given.

## Roadmap
All listed points have no specific order:

* ~~Parameter decorator to inject data from the `Jovo`-object, example: `@Session(key?: string)` or `@SessionData(key?: string)`.~~
* ~~Find~~ Implement a way to allow access to `Jovo` context in class to allow calls in vanilla handlers like `this.tell(...)`
* Implement validation for data and/or input
