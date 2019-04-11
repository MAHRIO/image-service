
/* Required Server Modules */
const Hapi = require('hapi');   // Hapi Server
const Good = require('good');   // Request Loggin
const Inert = require('inert'); // Static Files Engine

/* Node Utilities */
const Path = require('path');
const fs = require('fs');

/* Server Config */
const config = require('./config');
config.routes = {
    files: {
        relativeTo: Path.join(__dirname, 'public')
    }
}
if( config.tls ) {
    config.tls = {
        key: fs.readFileSync( Path.join(__dirname, 'key.pem') ),
        cert: fs.readFileSync( Path.join(__dirname, 'cert.pem') )
    }
}
let serverVersion;
try {
    const packageJson = fs.readFileSync( './package.json');
    serverVersion = JSON.parse( packageJson.toString() ).version;
} catch( e ) {
    console.log(e);
}

const server = Hapi.server( config );
const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        mahrioReporter: [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            },
            {
                module: 'good-console'
            },
            'stdout'
        ]
    }
};
server.route({
    method:'GET',
    path:'/healthcheck',
    handler: () => {
        try {
            return {uptime: process.uptime(), version: serverVersion};
        } catch( e ) {
            return {error: e.toString()};
        }
    }
});
module.exports = {
    run: () => {
        return new Promise( (res, rej) => {
            try {
                (async () => {
                    await server.register(Inert);
                    await server.register({
                        plugin: Good,
                        options
                    });
                    await server.start();
                    res( server );
                    console.log('Server running at:', server.info.uri);
                })();
            } catch (err) {
                console.log(err);
                rej(err);
                process.exit(1);
            }
        });
    }
}