const auditLogsRepo = require("../repository/audit_logs");

function getAuditLogById(fastify) {
  const { fetchAuditLogById } = auditLogsRepo(fastify);

  return async ({ logTrace, query }) => {
    const response = await fetchAuditLogById.call(fastify.knex, {
      input: query,
      logTrace
    });
    return response;
  };
}
module.exports = getAuditLogById;
