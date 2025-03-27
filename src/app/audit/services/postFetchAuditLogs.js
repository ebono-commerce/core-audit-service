const auditLogsRepo = require("../repository/audit_logs");

function postFetchAuditLogs(fastify) {
  const { fetchAuditLogsByFilters } = auditLogsRepo(fastify);

  /**
   * you can filter the data on these fileds -
   * domain
   * entity_type
   * entity_id
   * update_from
   * update_to,
   * updated_by
   * is_updated_by_system
   */

  return async ({ logTrace, body }) => {
    const response = await fetchAuditLogsByFilters.call(fastify.knex, {
      input: body,
      logTrace
    });
    if (body?.include_changes === false) {
      response.data = response.data.map(({ changes, ...rest }) => rest);
    }
    return response;
  };
}
module.exports = postFetchAuditLogs;
