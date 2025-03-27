const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postEventsSchema = {
  tags: ["AUDIT"],
  summary: "This API is for receiving events",
  body: {
    type: "object",
    required: ["message", "subscription"],
    additionalProperties: false,
    properties: {
      message: {
        type: "object",
        additionalProperties: true,
        properties: {
          attributes: {
            type: "object",
            additionalProperties: { type: "string" }
          },
          data: { type: "string" }
        }
      },
      subscription: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postEventsSchema;
