const postEvents = require("./postEvents");
const postEntityMapping = require("./postEntityMapping");
const getEntityMapping = require("./getEntityMapping");
const getEntitySnapshot = require("./getEntitySnapshot");
const postFetchAuditLogs = require("./postFetchAuditLogs");
const getAuditLogById = require("./getAuditLogById");

module.exports = {
  postEvents,
  postEntityMapping,
  getEntityMapping,
  postFetchAuditLogs,
  getEntitySnapshot,
  getAuditLogById
};
