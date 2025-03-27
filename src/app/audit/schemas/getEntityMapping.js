const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getEntityMappingSchema = {
  tags: ["AUDIT"],
  summary: "This API is for getting  entity mapping",

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          entity_id: { type: "string" },
          entity_type: { type: "string" },
          domain: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getEntityMappingSchema;
