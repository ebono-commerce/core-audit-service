const postEntityMappingService = require("../services/postEntityMapping");

function postEntityMappingHandler(fastify) {
  const postEntityMapping = postEntityMappingService(fastify);

  return async (request, reply) => {
    const { logTrace, body } = request;

    const response = await postEntityMapping({
      body,
      logTrace
    });
    return reply.code(201).send(response);
  };
}

module.exports = postEntityMappingHandler;
