const getEntitySnapshotService = require("../services/getEntitySnapshot");

function getEntitySnapshotHandler(fastify) {
  const getEntitySnapshot = getEntitySnapshotService(fastify);

  return async (request, reply) => {
    const { logTrace, query } = request;

    const response = await getEntitySnapshot({ query, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getEntitySnapshotHandler;
