const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getAuditLogByIdSchema = {
  tags: ["AUDIT"],
  summary: "This API is for getting audit log by audit_log_id",
  queryParams: {
    type: "object",
    required: ["audit_log_id"],
    properties: {
      audit_log_id: { type: "string", minLength: 1 }
    }
  },
  response: {
    ...errorSchemas
  }
};

module.exports = getAuditLogByIdSchema;
