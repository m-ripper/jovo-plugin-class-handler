// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------


const config = {
    logging: false,

    intentMap: {
        'AMAZON.StopIntent': 'END',
    },

    db: {
        FileDb: {
            pathToFile: './../../db/db.json',
        },
    },

    plugin: {
        JovoClassHandlerPlugin: {
            handlers: [
                __dirname + '/**/*.handler.{ts,js}',
            ],
        },
    },
};

export = config;
