const postEvents = require("./postEvents");
const postEntityMapping = require("./postEntityMapping");
const getEntityMapping = require("./getEntityMapping");
const getEntitySnapshot = require("./getEntitySnapshot");
const postFetchAuditLogsSchema = require("./postFetchAuditLogs");
const getAuditLogByIdSchema = require("./getAuditLogById");

module.exports = {
  postEvents,
  postEntityMapping,
  getEntityMapping,
  getEntitySnapshot,
  postFetchAuditLogsSchema,
  getAuditLogByIdSchema
};
