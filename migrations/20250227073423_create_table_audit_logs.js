exports.up = knex => {
  return knex.schema.hasTable("audit_logs").then(exists => {
    if (!exists) {
      return knex.schema.createTable("audit_logs", table => {
        table
          .uuid("audit_log_id")
          .primary()
          .notNullable()
          .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("domain");
        table.string("entity_type");
        table.string("entity_id");
        table.timestamp("source_updated_at");
        table.string("source_updated_by");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.string("created_by");
        table.boolean("is_updated_by_system");
        table.jsonb("changes");
        table.string("outlet_id");
        table.string("change_type");
        table.string("change_mode");
        table.string("channel");
        table.string("api_url");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.dropTable("audit_logs");
};
