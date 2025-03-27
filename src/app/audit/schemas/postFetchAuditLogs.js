const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postFetchAuditLogsSchema = {
  description: "Fetch audit logs with filters",
  tags: ["Audit"],
  summary: "Retrieve audit logs based on filters",
  body: {
    type: "object",
    properties: {
      domain: {
        type: "string"
      },
      entity_type: {
        type: "string"
      },
      entity_id: {
        type: "string"
      },
      source_updated_at: {
        type: "string",
        format: "date-time"
      },
      update_from: {
        type: "string"
      },
      update_to: {
        type: "string"
      },
      is_updated_by_system: {
        type: "boolean"
      },
      include_changes: {
        type: "boolean"
      },
      current_page: { type: "integer", default: 1 },
      page_size: { type: "integer", default: 10 }
    },
    dependencies: {
      update_from: ["update_to"],
      update_to: ["update_from"]
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              audit_log_id: { type: "string", format: "uuid" },
              domain: { type: "string" },
              entity_type: { type: "string" },
              entity_id: { type: "string" },
              source_updated_at: { type: "string", format: "date-time" },
              source_updated_by: { type: "string" },
              is_updated_by_system: { type: "boolean" },
              changes: {
                type: "object",
                additionalProperties: true,
                nullable: true
              },
              change_type: { type: "string" },
              change_mode: { type: "string" },
              channel: { type: "string" },
              api_url: { type: "string" },
              outlet_id: { type: "string" },
              created_at: { type: "string" }
            }
          }
        },
        meta: {
          type: "object",
          properties: {
            pagination: {
              type: "object",
              properties: {
                total_items: { type: "integer" },
                current_page: { type: "integer" },
                page_size: { type: "integer" },
                total_pages: { type: "integer" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = postFetchAuditLogsSchema;
