const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getEntityMappingSchema = {
  tags: ["AUDIT"],
  summary: "This API is for getting snapshot by entity id and entity type",
  queryParams: {
    type: "object",
    required: ["entity_id", "entity_type"],
    properties: {
      entity_id: { type: "string", minLength: 1 },
      entity_type: { type: "string", minLength: 1 }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        entity_id: { type: "string" },
        entity_type: { type: "string" },
        domain: { type: "string" },
        snapshot: {
          type: "object",
          additionalProperties: true
        },
        source_updated_at: { type: "string" },
        source_updated_by: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getEntityMappingSchema;
