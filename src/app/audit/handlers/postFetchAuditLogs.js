const postFetchAuditLogsService = require("../services/postFetchAuditLogs");

function postFetchAuditLogs(fastify) {
  const fetchAuditLogs = postFetchAuditLogsService(fastify);

  return async (request, reply) => {
    const { logTrace, body } = request;
    const response = await fetchAuditLogs({
      logTrace,
      body
    });
    return reply.code(200).send(response);
  };
}

module.exports = postFetchAuditLogs;
