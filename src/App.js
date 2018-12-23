#!/usr/bin/env node
const Wordpress = require( 'wpapi' );

const Hapi = require('hapi');


function client() {
    const config = {
        endpoint: process.env.url,
        username: process.env.username,
        password: process.env.password
    };
    return new Wordpress(config);
}


const server = Hapi.server({
    port: 5000,
    host: 'localhost'
});


server.route({
    method: 'GET',
    path: '/posts',
    handler: async (request, h) => {
        const client = client();
        let response = {};
        await client().posts()
        .then((data) => {
            response = data;
        });
        return response;
    }
});

server.route({
    method: 'POST',
    path: '/newpost',
    handler: async (request, h) => {
        let response = {};
        let code = 200;
        await client().posts().create(request.payload)
        .then((data) => {
            response = data;
        }).catch((error) => {
            response = error;
            code = error.data.status;
        });
        return h.response(response).code(code);
    }
});

server.route({
    method: 'PATCH',
    path: '/updatepost',
    handler: async (request, h) => {
        let response = {};
        let code = 200;
        const id = request.payload.id;
        delete request.payload.id;
        await client().posts().id(id).update(request.payload)
        .then((data) => {
            response = data;
        }).catch((error) => {
            response = error;
            code = error.data.status;
        });
        return h.response(response).code(code);
    }
});


server.route({
    method: 'DELETE',
    path: '/deletepost',
    handler: async (request, h) => {
        let response = {};
        let code = 204;
        await client().posts().id(request.payload.id).delete()
        .then((data) => {

        }).catch((error) => {
            response = error;
            code = error.data.status;
        });
        return h.response(response).code(code);
    }
});


const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
