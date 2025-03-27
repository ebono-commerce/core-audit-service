const getAuditLogService = require("../services/getAuditLogById");

function getAuditLogByIdHandler(fastify) {
  const getAuditLogById = getAuditLogService(fastify);

  return async (request, reply) => {
    const { logTrace, query } = request;

    const response = await getAuditLogById({
      logTrace,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getAuditLogByIdHandler;
