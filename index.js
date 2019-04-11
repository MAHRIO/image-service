const server = require('./server');
const fs = require('fs');

server.run().then( server => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return h.file( 'index.html' );
        }
    });
    server.route({
        method: 'GET',
        path: '/images/{any*}',
        handler: (req, h) => {
            const { params } = req;
            return h.file( `uploads/${params.any}` );
        }
    });
    server.route({
        method: 'POST',
        path: '/upload',
        handler: (req, h) => {
            const { payload } = req;
            
            return new Promise( (res, rej) => {
                if( payload.dataURL ) {
                    payload.file = payload.file.replace('data:image/png;base64,', '');
                    payload.file = Buffer.from( payload.file, 'base64');
                    fs.writeFile(`./public/uploads/${payload.filename}`, payload.file, 'base64', err => {
                        if( err ) {
                            console.log(err);
                            rej(err);
                        }
                        res({file: payload.filename});
                    });
                } else {
                    fs.writeFile(`./public/uploads/${payload.filename}`, payload.file, err => {
                        if( err ) {
                            console.log(err);
                            rej(err);
                        }
                        res({success: true});
                    });
                }
            });
        }
    });    
});