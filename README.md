# fastify-jaeger-middleware

## Install
```
npm i @3rdi/fastify-jaeger-middleware --save
```

## Usage
First create a jaeger tracer by following the guide from https://github.com/jaegertracing/jaeger-client-node
```js
var initTracer = require('jaeger-client').initTracer;

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
  serviceName: 'my-awesome-service',
  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    collectorEndpoint: 'http://jaeger-collector:14268/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: '',
  },
};
var options = {
  tags: {
    'my-awesome-service.version': '1.1.2',
  },
  metrics: metrics,
  logger: logger,
};
var tracer = initTracer(config, options);
 
```
Then register the middleware and instantiate this with the tracer.

```js
const jegerMiddleware = require('@3rdi/fastify-jaeger-middleware');

 fastify.register(jegerMiddleware, { tracer: jaegerTracer });
 
```
This will give you a report in jaeger like this.



## License

Licensed under [MIT](./LICENSE).
