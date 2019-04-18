'use strict';

const fp = require('fastify-plugin');
const { Tags } = require('jaeger-client').opentracing;

function fastifyJaeger(fastify, opts, next) {
  const { tracer } = Object.assign(
    {
      tracer: null,
    },
    opts,
  );
  function extractFunctionName(path) {
    // const destPath = path.split('/');
    // return destPath[destPath.length - 1].split('?')[0];
    return 'foo'
  }

  function traceRequest(request, reply, traceNext) {
    console.log(request);
    const { headers } = request;
    const ctx = tracer.extract('http_headers', Object.setPrototypeOf(headers, Object.prototype));
    const span = tracer.startSpan(extractFunctionName(request.headers[':path']), { childOf: ctx });
    span.setTag(Tags.SPAN_KIND, 'server');
    span.setTag(Tags.HTTP_METHOD, request.headers[':method']);
    span.setTag(Tags.HTTP_URL, request.headers[':path']);

    request.trace = span;
    traceNext();
  }

  function traceResponse(request, reply, responseNext) {
    const span = request.trace;
    span.setTag(Tags.HTTP_STATUS_CODE, reply.res.statusCode);
    span.finish();
    responseNext();
  }

  function traceError(request, reply, error, errorNext) {
    const span = request.trace;
    span.setTag(Tags.HTTP_STATUS_CODE, reply.res.statusCode);
    span.setTag(Tags.ERROR, true);
    span.finish();
    errorNext();
  }

  fastify.addHook('onResponse', traceResponse);
  fastify.addHook('onRequest', traceRequest);
  fastify.addHook('onError', traceError);
  fastify.decorateRequest('trace', '');

  next();
}

module.exports = fp(fastifyJaeger, {
  fastify: '>=2.0.0',
  name: 'fastify-jaeger',
});
