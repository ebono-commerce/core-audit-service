exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("entity_snapshot"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("entity_snapshot", table => {
          table
            .uuid("entity_snapshot_id")
            .primary()
            .notNullable()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          table.string("entity_type");
          table.string("entity_id");
          table.jsonb("snapshot");
          table.timestamp("created_at").defaultTo(knex.fn.now());
          table.string("created_by");
          table.string("domain");
          table.string("outlet_id");
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("entity_snapshot");
};
