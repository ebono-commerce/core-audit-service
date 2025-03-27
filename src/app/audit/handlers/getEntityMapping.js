const getEntityMappingService = require("../services/getEntityMapping");

function getEntityMappingHandler(fastify) {
  const getEntityMapping = getEntityMappingService(fastify);

  return async (request, reply) => {
    const { logTrace } = request;

    const response = await getEntityMapping({
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = getEntityMappingHandler;
