const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/events",
    schema: schemas.postEvents,
    handler: handlers.postEvents(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/entity-snapshot",
    schema: schemas.getEntitySnapshot,
    handler: handlers.getEntitySnapshot(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/entity-mapping",
    schema: schemas.postEntityMapping,
    handler: handlers.postEntityMapping(fastify)
  });

  fastify.route({
    method: "GET",
    url: "/entity-mapping",
    schema: schemas.getEntityMapping,
    handler: handlers.getEntityMapping(fastify)
  });

  /** Fetch audit logs with filters */
  fastify.route({
    method: "POST",
    url: "/audit-logs",
    schema: schemas.postFetchAuditLogsSchema,
    handler: handlers.postFetchAuditLogs(fastify)
  });

  /** Fetch audit logs with audit_log_id  */
  fastify.route({
    method: "GET",
    url: "/audit-logs",
    schema: schemas.getAuditLogByIdSchema,
    handler: handlers.getAuditLogById(fastify)
  });
};
