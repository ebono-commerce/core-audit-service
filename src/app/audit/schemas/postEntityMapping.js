const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postEventsSchema = {
  tags: ["AUDIT"],
  summary: "This API is for creating entity mapping",
  body: {
    type: "array",
    items: {
      type: "object",
      required: ["entity_id", "entity_type", "domain"],
      properties: {
        entity_id: { type: "string" },
        entity_type: { type: "string" },
        domain: { type: "string" }
      }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postEventsSchema;
