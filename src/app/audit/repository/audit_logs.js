const { logQuery } = require("../../commons/helpers");
const { AUDIT_LOGS } = require("../commons/model");

function auditLogs(fastify) {
  async function createAudityLog({ data, logTrace }) {
    const knex = this;
    const query = knex(AUDIT_LOGS.NAME).insert(data);

    logQuery({
      logger: fastify.log,
      query,
      context: "Create audit log",
      logTrace
    });
    return query;
  }

  async function fetchAuditLogs({ input, logTrace }) {
    const knex = this;
    const { filters, page_size, current_page } = input;

    const { whereFields } = filters;
    let query = knex(AUDIT_LOGS.NAME).select("*");

    if (whereFields) {
      query = query.where(whereFields);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get audit logs",
      logTrace
    });
    query = query
      .orderBy(AUDIT_LOGS.COLUMNS.SOURCE_UPDATED_AT, "desc")
      .paginate({
        page_size,
        current_page
      });

    return query;
  }

  // eslint-disable-next-line complexity
  async function fetchAuditLogsByFilters({ input, logTrace }) {
    const knex = this;
    const query = knex(AUDIT_LOGS.NAME).select("*");

    if (input.domain) {
      query.where(AUDIT_LOGS.COLUMNS.DOMAIN, input.domain);
    }

    if (input.entity_type) {
      query.where(AUDIT_LOGS.COLUMNS.ENTITY_TYPE, input.entity_type);
    }

    if (input.entity_id) {
      query.where(AUDIT_LOGS.COLUMNS.ENTITY_ID, input.entity_id);
    }

    if (input.source_updated_at) {
      query.where(AUDIT_LOGS.COLUMNS.SOURCE_UPDATED_AT, input.updated_at);
    }

    if (input.update_from) {
      query.where(
        AUDIT_LOGS.COLUMNS.SOURCE_UPDATED_AT,
        ">=",
        input.update_from
      );
    }

    if (input.update_to) {
      query.where(AUDIT_LOGS.COLUMNS.SOURCE_UPDATED_AT, "<=", input.update_to);
    }
    if (input.source_updated_by) {
      query.where(AUDIT_LOGS.COLUMNS.UPDATED_BY, input.updated_by);
    }
    if (input.outlet_id) {
      query.where(AUDIT_LOGS.COLUMNS.OUTLET_ID, input.outlet_id);
    }
    if (input.is_updated_by_system) {
      query.where(
        AUDIT_LOGS.COLUMNS.IS_UPDATED_BY_SYSTEM,
        input.is_updated_by_system
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get audit logs by filters",
      logTrace
    });
    const response = await query
      .orderBy(AUDIT_LOGS.COLUMNS.SOURCE_UPDATED_AT, "desc")
      .paginate({
        page_size: input.page_size,
        current_page: input.current_page
      });
    return response;
  }

  async function fetchAuditLogById({ input, logTrace }) {
    const knex = this;
    const { audit_log_id } = input;

    const query = knex(AUDIT_LOGS.NAME)
      .select("*")
      .where(AUDIT_LOGS.COLUMNS.AUDIT_LOGS_ID, audit_log_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get audit log by id",
      logTrace
    });

    const response = await query;
    return response[0];
  }

  return {
    createAudityLog,
    fetchAuditLogs,
    fetchAuditLogsByFilters,
    fetchAuditLogById
  };
}

module.exports = auditLogs;
